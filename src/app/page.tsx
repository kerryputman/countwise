"use client";

import { useMemo, useState } from "react";

type FabricType = "aida" | "evenweave";

interface Fabric {
  type: FabricType;
  count: number;
  needle: string;
  overCount: number;
}

const FABRICS: Fabric[] = [
  // Aida — stitch over 1
  { type: "aida", count: 11, needle: "22", overCount: 1 },
  { type: "aida", count: 14, needle: "24", overCount: 1 },
  { type: "aida", count: 16, needle: "26", overCount: 1 },
  { type: "aida", count: 18, needle: "26", overCount: 1 },
  { type: "aida", count: 20, needle: "28", overCount: 1 },
  { type: "aida", count: 22, needle: "28", overCount: 1 },
  { type: "aida", count: 25, needle: "28", overCount: 1 },
  { type: "aida", count: 28, needle: "28", overCount: 1 },
  // Evenweave / linen — stitch over 2
  { type: "evenweave", count: 25, needle: "22", overCount: 2 },
  { type: "evenweave", count: 28, needle: "24", overCount: 2 },
  { type: "evenweave", count: 32, needle: "26", overCount: 2 },
  { type: "evenweave", count: 36, needle: "26", overCount: 2 },
  { type: "evenweave", count: 40, needle: "28", overCount: 2 },
];

type Unit = "imperial" | "metric";
type Filter = "all" | "aida" | "evenweave";

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function fmt(inches: number, unit: Unit) {
  if (unit === "metric") {
    return `${round1(inches * 2.54)} cm`;
  }
  return `${round1(inches)}"`;
}

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex rounded-full border border-linen-200 bg-white p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            value === opt.value
              ? "bg-sage-500 text-white shadow-sm"
              : "text-linen-700 hover:bg-linen-100"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Page() {
  const [w, setW] = useState<number>(100);
  const [h, setH] = useState<number>(100);
  // allowance stored internally in inches
  const [allowInches, setAllowInches] = useState<number>(2);
  const [unit, setUnit] = useState<Unit>("imperial");
  const [filter, setFilter] = useState<Filter>("all");

  // displayed allowance value tracks unit
  const allowDisplay = unit === "metric" ? round1(allowInches * 2.54) : allowInches;

  function handleUnitChange(newUnit: Unit) {
    // convert allowance display value when switching units, no-op on internal storage
    setUnit(newUnit);
  }

  function handleAllowChange(display: number) {
    if (unit === "metric") {
      setAllowInches(display / 2.54);
    } else {
      setAllowInches(display);
    }
  }

  const rows = useMemo(() => {
    return FABRICS.filter((f) => filter === "all" || f.type === filter).map(
      (f) => {
        const effectiveCount = f.count / f.overCount;
        const finishedW = w / effectiveCount;
        const finishedH = h / effectiveCount;
        const cutW = finishedW + 2 * allowInches;
        const cutH = finishedH + 2 * allowInches;
        return { ...f, finishedW, finishedH, cutW, cutH };
      }
    );
  }, [w, h, allowInches, filter]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-linen-900">
          Fabric Calculator
        </h1>
        <p className="mt-1 text-linen-500">
          Cut size across common counts, plus needle suggestions.
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-white border border-linen-200 rounded-2xl p-5 shadow-sm mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-linen-500">
              Stitch width
            </span>
            <input
              type="number"
              min={1}
              value={w}
              onChange={(e) => setW(Number(e.target.value))}
              className="border border-linen-200 rounded-lg px-3 py-2 text-linen-900 focus:outline-none focus:ring-2 focus:ring-sage-400 bg-linen-50"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-linen-500">
              Stitch height
            </span>
            <input
              type="number"
              min={1}
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
              className="border border-linen-200 rounded-lg px-3 py-2 text-linen-900 focus:outline-none focus:ring-2 focus:ring-sage-400 bg-linen-50"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-linen-500">
              Framing allowance ({unit === "metric" ? "cm" : "in"})
            </span>
            <input
              type="number"
              step={unit === "metric" ? 0.5 : 0.25}
              min={0}
              value={allowDisplay}
              onChange={(e) => handleAllowChange(Number(e.target.value))}
              className="border border-linen-200 rounded-lg px-3 py-2 text-linen-900 focus:outline-none focus:ring-2 focus:ring-sage-400 bg-linen-50"
            />
          </label>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-linen-500">
            Units
          </span>
          <SegmentedControl
            options={[
              { value: "imperial" as Unit, label: "Imperial" },
              { value: "metric" as Unit, label: "Metric" },
            ]}
            value={unit}
            onChange={handleUnitChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-linen-500">
            Show
          </span>
          <SegmentedControl
            options={[
              { value: "all" as Filter, label: "All" },
              { value: "aida" as Filter, label: "Aida" },
              { value: "evenweave" as Filter, label: "Evenweave" },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white border border-linen-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-100">
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-linen-700">
                Count
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-linen-700">
                Type
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-linen-700">
                Finished size
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-linen-700">
                Cut size
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-linen-700">
                Needle
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={`${r.type}-${r.count}`}
                className={i % 2 === 0 ? "bg-white" : "bg-linen-50"}
              >
                <td className="px-4 py-3 font-medium text-linen-900">
                  {r.count} ct
                </td>
                <td className="px-4 py-3 text-linen-700">
                  {r.type === "aida" ? (
                    "Aida"
                  ) : (
                    <>
                      Evenweave
                      <span className="block text-xs text-linen-500">
                        over 2
                      </span>
                    </>
                  )}
                </td>
                <td className="px-4 py-3 text-linen-800">
                  {fmt(r.finishedW, unit)} × {fmt(r.finishedH, unit)}
                </td>
                <td className="px-4 py-3 text-linen-800">
                  {fmt(r.cutW, unit)} × {fmt(r.cutH, unit)}
                </td>
                <td className="px-4 py-3 text-linen-700">#{r.needle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-linen-500">
        Needle sizes assume 2-strand stitching. Evenweave counts are thread
        count; stitching over 2 gives the same stitch density as Aida at half
        the count.
      </p>
    </main>
  );
}
