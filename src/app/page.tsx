"use client";

import { useMemo, useState } from "react";

const FABRICS = [
  { count: 14, needle: 24 },
  { count: 16, needle: 26 },
  { count: 18, needle: 28 },
];

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export default function Page() {
  const [w, setW] = useState<number>(100);
  const [h, setH] = useState<number>(100);
  const [allow, setAllow] = useState<number>(2);

  const rows = useMemo(() => {
    return FABRICS.map(({ count, needle }) => {
      const finishedW = w / count;
      const finishedH = h / count;
      const cutW = finishedW + 2 * allow;
      const cutH = finishedH + 2 * allow;

      return {
        count,
        needle,
        finishedW: round1(finishedW),
        finishedH: round1(finishedH),
        cutW: round1(cutW),
        cutH: round1(cutH),
      };
    });
  }, [w, h, allow]);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>CountWise</h1>
      <p style={{ marginTop: 0, marginBottom: 18, opacity: 0.8 }}>
        Cross-stitch fabric cut size across common counts, plus needle suggestions.
      </p>

      <section
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: 18,
        }}
      >
        <label>
          Stitch width
          <input
            type="number"
            min={1}
            value={w}
            onChange={(e) => setW(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Stitch height
          <input
            type="number"
            min={1}
            value={h}
            onChange={(e) => setH(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Framing allowance (inches)
          <input
            type="number"
            step="0.25"
            min={0}
            value={allow}
            onChange={(e) => setAllow(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>
      </section>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Aida count</th>
            <th align="left">Finished size (in)</th>
            <th align="left">Cut size (in)</th>
            <th align="left">Needle</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.count} style={{ borderTop: "1px solid rgba(0,0,0,0.12)" }}>
              <td style={{ padding: "10px 0" }}>{r.count} ct</td>
              <td style={{ padding: "10px 0" }}>
                {r.finishedW}" × {r.finishedH}"
              </td>
              <td style={{ padding: "10px 0" }}>
                {r.cutW}" × {r.cutH}"
              </td>
              <td style={{ padding: "10px 0" }}>Size {r.needle}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 16, fontSize: 13, opacity: 0.7 }}>
        Needle suggestions assume standard 2-strand stitching on Aida.
      </p>
    </main>
  );
}