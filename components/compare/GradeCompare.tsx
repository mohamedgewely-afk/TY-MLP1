import React, { useMemo, useState } from "react";
import type { Grade, SpecRow } from "../../types.d.ts";
import { SAMPLE_GRADES } from "../../data/grades";
import { SAMPLE_SPECS } from "../../data/specs";

export const GradeCompare: React.FC<{ grades?: Grade[]; specs?: SpecRow[] }> = ({ grades = SAMPLE_GRADES, specs = SAMPLE_SPECS }) => {
  const [selected, setSelected] = useState<string[]>(grades.slice(0, Math.min(2, grades.length)).map((g) => g.id));
  const [highlight, setHighlight] = useState(true);

  const visibleGrades = useMemo(() => grades.filter((g) => selected.includes(g.id)), [grades, selected]);

  return (
    <section aria-labelledby="compare-title" className="py-10 bg-carbon-matte">
      <div className="max-w-7xl mx-auto px-4">
        <h2 id="compare-title" className="text-xl font-semibold text-white">Compare Grades</h2>
        <div className="mt-4 flex gap-3 items-center">
          {grades.map((g) => (
            <label key={g.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(g.id)}
                onChange={(e) => {
                  if (e.target.checked) setSelected((s) => (s.length >= 4 ? s.slice(1).concat(g.id) : s.concat(g.id)));
                  else setSelected((s) => s.filter((id) => id !== g.id));
                }}
              />
              <span className="text-white">{g.name}</span>
            </label>
          ))}
          <button onClick={() => setHighlight((h) => !h)} className="ml-auto px-3 py-2 rounded border border-white/6 text-white">
            {highlight ? "Hide Differences" : "Show Differences"}
          </button>
        </div>

        <div className="mt-6 overflow-auto">
          <table className="min-w-full table-auto border-separate border-spacing-0">
            <thead className="sticky top-0 bg-neutral-900">
              <tr>
                <th className="text-left p-3 text-white/70 w-48">Spec</th>
                {visibleGrades.map((g) => (
                  <th key={g.id} className="p-3 text-left text-white">{g.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => {
                const vals = visibleGrades.map((g) => String(s.values[g.id] ?? "-"));
                const isDifferent = new Set(vals).size > 1;
                return (
                  <tr key={s.key} className={`${highlight && isDifferent ? "bg-white/3" : ""}`}>  
                    <td className="p-3 text-white/70">{s.label}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="p-3 text-white">{v}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};