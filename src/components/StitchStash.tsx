'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { DMC, FAMILY_ORDER, type DmcColor } from '@/data/dmc'
import s from './StitchStash.module.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface InventoryItem { n: string; qty: number; threshold: number; project: string }
interface Project { id: string; name: string }
type Tab = 'stash' | 'browse' | 'projects'

// ─── IndexedDB helpers (module-level, not recreated on render) ────────────────
let _db: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('StitchStash', 2)
    req.onupgradeneeded = (e) => {
      const d = (e.target as IDBOpenDBRequest).result
      if (!d.objectStoreNames.contains('inventory'))
        d.createObjectStore('inventory', { keyPath: 'n' })
      if (!d.objectStoreNames.contains('projects'))
        d.createObjectStore('projects', { keyPath: 'id' })
    }
    req.onsuccess = (e) => { _db = (e.target as IDBOpenDBRequest).result; resolve(_db) }
    req.onerror = () => reject(req.error)
  })
}

function dbGetAll<T>(store: string): Promise<T[]> {
  return openDB().then(db => new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly').objectStore(store).getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  }))
}

function dbPut(store: string, item: object): Promise<void> {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    tx.objectStore(store).put(item)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  }))
}

function dbDelete(store: string, key: string): Promise<void> {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    tx.objectStore(store).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  }))
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function StitchStash() {
  const [tab, setTab] = useState<Tab>('stash')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>({})
  const [projects, setProjects] = useState<Record<string, Project>>({})

  // Color modal state
  const [colorModal, setColorModal] = useState<DmcColor | null>(null)
  const [modalQty, setModalQty] = useState(0)
  const [modalThreshold, setModalThreshold] = useState(1)
  const [modalProject, setModalProject] = useState('')

  // Project modal state
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const projectInputRef = useRef<HTMLInputElement>(null)

  // Toast
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load from IndexedDB on mount
  useEffect(() => {
    Promise.all([
      dbGetAll<InventoryItem>('inventory'),
      dbGetAll<Project>('projects'),
    ]).then(([inv, prj]) => {
      const invMap: Record<string, InventoryItem> = {}
      inv.forEach(i => { invMap[i.n] = i })
      const prjMap: Record<string, Project> = {}
      prj.forEach(p => { prjMap[p.id] = p })
      setInventory(invMap)
      setProjects(prjMap)
    }).catch(console.warn)
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setToastVisible(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500)
  }, [])

  // ─── Filtered color list ────────────────────────────────────────────────────
  const filteredColors = (() => {
    // When searching, always scan the full DMC list so users can find
    // any colour by number/name regardless of which tab they're on.
    let list = (tab === 'stash' && !search)
      ? DMC.filter(c => inventory[c.n] && inventory[c.n].qty > 0)
      : DMC

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c => c.n.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
    }

    if (filter === 'low') {
      list = list.filter(c => {
        const inv = inventory[c.n]
        return inv && inv.qty > 0 && inv.qty <= (inv.threshold ?? 1)
      })
    } else if (filter !== 'all') {
      list = list.filter(c => c.family === filter)
    }

    return list
  })()

  const stashCount = Object.values(inventory).filter(i => i.qty > 0).length

  // ─── Open color modal ───────────────────────────────────────────────────────
  function openColor(color: DmcColor) {
    const inv = inventory[color.n]
    setColorModal(color)
    setModalQty(inv?.qty ?? 0)
    setModalThreshold(inv?.threshold ?? 1)
    setModalProject(inv?.project ?? '')
  }

  function closeColorModal() { setColorModal(null) }

  async function saveColor() {
    if (!colorModal) return
    const item: InventoryItem = {
      n: colorModal.n,
      qty: modalQty,
      threshold: modalThreshold,
      project: modalProject,
    }
    setInventory(prev => ({ ...prev, [colorModal.n]: item }))
    await dbPut('inventory', item)
    closeColorModal()
    showToast(`DMC ${colorModal.n} saved — ${modalQty} skein${modalQty !== 1 ? 's' : ''}`)
  }

  async function removeColor() {
    if (!colorModal) return
    const n = colorModal.n
    setInventory(prev => { const next = { ...prev }; delete next[n]; return next })
    await dbDelete('inventory', n)
    closeColorModal()
    showToast(`DMC ${n} removed from stash`)
  }

  // ─── Project modal ──────────────────────────────────────────────────────────
  function openProjectModal() {
    setProjectName('')
    setProjectModalOpen(true)
    setTimeout(() => projectInputRef.current?.focus(), 300)
  }

  async function saveProject() {
    const name = projectName.trim()
    if (!name) return
    const proj: Project = { id: Date.now().toString(), name }
    setProjects(prev => ({ ...prev, [proj.id]: proj }))
    await dbPut('projects', proj)
    setProjectModalOpen(false)
    showToast(`Project "${name}" created`)
  }

  // ─── Render helpers ─────────────────────────────────────────────────────────
  function renderColorGrid(list: DmcColor[]) {
    if (list.length === 0) return null
    return (
      <div className={s.colorGrid}>
        {list.map(c => {
          const inv = inventory[c.n]
          const qty = inv?.qty ?? 0
          const lowStock = qty > 0 && qty <= (inv?.threshold ?? 1)
          const inStash = qty > 0
          return (
            <div
              key={c.n}
              className={[s.colorCard, inStash ? s.inStash : '', lowStock ? s.lowStock : ''].join(' ')}
              onClick={() => openColor(c)}
            >
              <div className={s.swatch} style={{ background: c.hex }} />
              <div className={s.cardInfo}>
                <div className={s.cardNumber}>{c.n}</div>
                <div className={s.cardName}>{c.name}</div>
              </div>
              <div className={s.cardQty}>
                <span className={s.qtyNum}>{inStash ? qty : '+'}</span>
                <span className={s.qtyLabel}>{inStash ? 'skeins' : 'add'}</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  function renderGrouped(list: DmcColor[]) {
    const grouped: Partial<Record<string, DmcColor[]>> = {}
    list.forEach(c => {
      if (!grouped[c.family]) grouped[c.family] = []
      grouped[c.family]!.push(c)
    })
    return FAMILY_ORDER.map(fam => {
      const colors = grouped[fam]
      if (!colors?.length) return null
      return (
        <div key={fam}>
          <div className={s.sectionHeader}>{fam}</div>
          {renderColorGrid(colors)}
        </div>
      )
    })
  }

  // ─── Stash / Browse content ──────────────────────────────────────────────────
  function renderColorContent() {
    if (filteredColors.length === 0) {
      if (tab === 'stash' && !search && filter === 'all') {
        return (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>🧵</div>
            <h3 className={s.emptyTitle}>Your stash is empty</h3>
            <p className={s.emptyText}>
              Switch to &ldquo;Browse All&rdquo; to add colours to your stash, or search for a DMC number.
            </p>
          </div>
        )
      }
      return <div className={s.noResults}>No colours found matching your search.</div>
    }
    return search ? renderColorGrid(filteredColors) : renderGrouped(filteredColors)
  }

  // ─── Projects content ────────────────────────────────────────────────────────
  function renderProjects() {
    const projList = Object.values(projects)
    return (
      <div className={s.projectsList}>
        {projList.length === 0 && (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>📋</div>
            <h3 className={s.emptyTitle}>No projects yet</h3>
            <p className={s.emptyText}>
              Create a project to organise your threads by pattern or project.
            </p>
          </div>
        )}
        {projList.map(p => {
          const projectColors = Object.values(inventory)
            .filter(i => i.project === p.id && i.qty > 0)
            .map(i => DMC.find(c => c.n === i.n))
            .filter((c): c is DmcColor => Boolean(c))
          return (
            <div key={p.id} className={s.projectCard}>
              <div className={s.projectHeader}>
                <span className={s.projectName}>{p.name}</span>
                <span className={s.projectCount}>
                  {projectColors.length} colour{projectColors.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className={s.projectSwatches}>
                {projectColors.map(c => (
                  <div
                    key={c.n}
                    className={s.miniSwatch}
                    style={{ background: c.hex }}
                    title={`DMC ${c.n}: ${c.name}`}
                    onClick={() => openColor(c)}
                  />
                ))}
                {projectColors.length === 0 && (
                  <span className={s.projectEmpty}>
                    Assign colours to this project when editing threads
                  </span>
                )}
              </div>
            </div>
          )
        })}
        <button className={s.addProjectBtn} onClick={openProjectModal}>
          + New Project
        </button>
      </div>
    )
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={s.app}>
      {/* Header */}
      <header className={s.header}>
        <div>
          <h1 className={s.headerTitle}>
            Stitch <span className={s.headerTitleAccent}>Stash</span>
          </h1>
          <p className={s.headerTagline}>DMC Thread Inventory</p>
        </div>
        <div className={s.headerStats}>
          <div className={s.headerCount}>{stashCount}</div>
          <div className={s.headerCountLabel}>in stash</div>
        </div>
      </header>

      {/* Search */}
      <div className={s.searchWrap}>
        <svg className={s.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          className={s.searchInput}
          placeholder="Search by number or colour name…"
          inputMode="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <nav className={s.tabs}>
        {(['stash', 'browse', 'projects'] as Tab[]).map(t => (
          <button
            key={t}
            className={[s.tabBtn, tab === t ? s.active : ''].join(' ')}
            onClick={() => { setTab(t); setFilter('all') }}
          >
            {t === 'stash' ? 'My Stash' : t === 'browse' ? 'Browse All' : 'Projects'}
          </button>
        ))}
      </nav>

      {/* Filter pills */}
      <div className={s.filterRow}>
        {[
          { key: 'all', label: 'All', alert: false },
          { key: 'low', label: '⚠ Low Stock', alert: true },
          ...FAMILY_ORDER.map(f => ({ key: f, label: f, alert: false })),
        ].map(({ key, label, alert }) => (
          <span
            key={key}
            className={[s.pill, filter === key ? s.active : '', alert ? s.pillAlert : ''].join(' ')}
            onClick={() => setFilter(key)}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Main content */}
      <main className={s.main}>
        {tab === 'projects' ? renderProjects() : renderColorContent()}
      </main>

      {/* Color modal */}
      <div
        className={[s.modalOverlay, colorModal ? s.open : ''].join(' ')}
        onClick={e => { if (e.target === e.currentTarget) closeColorModal() }}
      >
        <div className={s.modal}>
          <div className={s.modalHandle} />
          {colorModal && (
            <>
              <div className={s.modalSwatchRow}>
                <div className={s.modalSwatch} style={{ background: colorModal.hex }} />
                <div>
                  <div className={s.modalColorName}>DMC {colorModal.n}</div>
                  <div className={s.modalColorDesc}>{colorModal.name}</div>
                  <div className={s.modalHex}>{colorModal.hex}</div>
                </div>
              </div>

              <div className={s.qtyControl}>
                <button
                  className={s.qtyBtn}
                  onClick={() => setModalQty(q => Math.max(0, q - 1))}
                >−</button>
                <div>
                  <div className={s.qtyDisplay}>{modalQty}</div>
                  <div className={s.qtySublabel}>skeins</div>
                </div>
                <button
                  className={s.qtyBtn}
                  onClick={() => setModalQty(q => q + 1)}
                >+</button>
              </div>

              <div className={s.thresholdRow}>
                <label className={s.thresholdLabel}>
                  Low stock alert
                  <small className={s.thresholdHint}>Warn me when skeins drop to or below</small>
                </label>
                <input
                  type="number"
                  className={s.thresholdInput}
                  min={0}
                  max={20}
                  value={modalThreshold}
                  onChange={e => setModalThreshold(Number(e.target.value))}
                />
              </div>

              <select
                className={s.projectSelect}
                value={modalProject}
                onChange={e => setModalProject(e.target.value)}
              >
                <option value="">No project assigned</option>
                {Object.values(projects).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <div className={s.modalBtnRow}>
                <button className={s.btnSave} onClick={saveColor}>Save to Stash</button>
                {inventory[colorModal.n]?.qty > 0 && (
                  <button className={s.btnRemove} onClick={removeColor}>Remove</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Project modal */}
      <div
        className={[s.modalOverlay, projectModalOpen ? s.open : ''].join(' ')}
        onClick={e => { if (e.target === e.currentTarget) setProjectModalOpen(false) }}
      >
        <div className={s.modal}>
          <div className={s.modalHandle} />
          <h2 className={s.projectModalTitle}>New Project</h2>
          <input
            ref={projectInputRef}
            type="text"
            className={s.inputField}
            placeholder="Project name (e.g. Winter Garden Sampler)"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveProject() }}
          />
          <div className={s.modalBtnRow}>
            <button className={s.btnSave} onClick={saveProject}>Create Project</button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={[s.toast, toastVisible ? s.show : ''].join(' ')}>{toast}</div>
    </div>
  )
}
