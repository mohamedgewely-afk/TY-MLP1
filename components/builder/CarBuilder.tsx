import React, { useMemo, useState } from "react";
import { BuilderProgress } from "./BuilderProgress";
import { BuilderNavigation } from "./BuilderNavigation";
import type { Grade } from "../../types.d.ts";
import { SAMPLE_GRADES } from "../../data/grades";
import { analytics } from "../../utils/analytics";

const STEPS = ["Grade", "Exterior", "Wheels", "Interior", "Packages", "Summary"];

export const CarBuilder: React.FC<{ grades?: Grade[] }> = ({ grades = SAMPLE_GRADES }) => {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<{ gradeId?: string; color?: string; wheels?: string; interior?: string; packages?: string[] }>({});
  const currentGrade = useMemo(() => grades.find((g) => g.id === selection.gradeId) || grades[0], [selection.gradeId, grades]);

  const onSelect = (k: string, v: any) => {
    setSelection((s) => ({ ...s, [k]: v }));
    analytics.track("selection_change", { k, v });
  };

  return (
    <section aria-labelledby="builder-title" className="py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-neutral-900 p-4 rounded-xl">
            <h2 id="builder-title" className="text-xl font-semibold text-white">Build Your Land Cruiser</h2>
            <div className="mt-4">
              <BuilderProgress step={step} steps={STEPS} />
            </div>

            <div className="mt-6">
              {step === 0 && (
                <div>
                  <p className="text-white/70">Choose a grade</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {grades.map((g) => (
                      <button key={g.id} onClick={() => onSelect("gradeId", g.id)} className={`p-4 rounded-lg text-left border ${selection.gradeId === g.id ? "border-[var(--brand-primary)]" : "border-white/6"}`}>  
                        <div className="text-white font-semibold">{g.name}</div>
                        <div className="text-white/60 mt-1">{g.power}</div>
                        <div className="text-white/90 mt-2">{g.price ? `$${g.price}` : "-"}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 1 && (
                <div>
                  <p className="text-white/70">Exterior colors</p>
                  <div className="mt-4 flex gap-3">
                    {[
                      "Carbon Matte",
                      "Pearl White",
                      "Byd Red"
                    ].map((c) => (
                      <button key={c} onClick={() => onSelect("color", c)} className={`px-3 py-2 rounded ${selection.color === c ? "ring-2 ring-[var(--brand-primary)]" : "border border-white/6"}`}>  
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <p className="text-white/70">Wheels</p>
                  <div className="mt-4 flex gap-3">
                    {[
                      "18 inch",
                      "20 inch",
                      "21 inch"
                    ].map((w) => (
                      <button key={w} onClick={() => onSelect("wheels", w)} className={`px-3 py-2 rounded ${selection.wheels === w ? "ring-2 ring-[var(--brand-primary)]" : "border border-white/6"}`}>  
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <p className="text-white/70">Interior</p>
                  <div className="mt-4 flex gap-3">
                    {[
                      "Black Leather",
                      "Sand Leather",
                      "Sport Alcantara"
                    ].map((i) => (
                      <button key={i} onClick={() => onSelect("interior", i)} className={`px-3 py-2 rounded ${selection.interior === i ? "ring-2 ring-[var(--brand-primary)]" : "border border-white/6"}`}>  
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 4 && (
                <div>
                  <p className="text-white/70">Packages</p>
                  <div className="mt-4 flex gap-3">
                    {[
                      "Tech Pack",
                      "Offroad Pack",
                      "Luxury Pack"
                    ].map((p) => (
                      <label key={p} className="flex items-center gap-2 px-3 py-2 border rounded">
                        <input
                          type="checkbox"
                          checked={selection.packages?.includes(p) || false}
                          onChange={(e) => {
                            const set = new Set(selection.packages || []);
                            if (e.target.checked) set.add(p);
                            else set.delete(p);
                            onSelect("packages", Array.from(set));
                          }}
                        />
                        <span className="text-white">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {step === 5 && (
                <div>
                  <h3 className="text-white font-semibold">Summary</h3>
                  <div className="mt-3 text-white/80 space-y-2">
                    <div>Grade: {currentGrade.name}</div>
                    <div>Color: {selection.color || "—"}</div>
                    <div>Wheels: {selection.wheels || "—"}</div>
                    <div>Interior: {selection.interior || "—"}</div>
                    <div>Packages: {(selection.packages || []).join(", ") || "—"}</div>
                    <div className="mt-3 text-white/60 text-sm">Estimated price: {currentGrade.price ? `$${currentGrade.price}` : "—"}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <BuilderNavigation
                onPrev={() => setStep((s) => Math.max(0, s - 1))}
                onNext={() => {
                  setStep((s) => Math.min(STEPS.length - 1, s + 1));
                }}
                canNext={step < STEPS.length - 1}
              />
            </div>
          </div>
        </div>

        <aside className="order-1 lg:order-2 lg:col-span-1">
          <div className="bg-neutral-900 p-4 rounded-xl sticky top-28">
            <div className="text-white/80">Preview</div>
            <div className="mt-3 h-44 bg-black/30 rounded flex items-center justify-center text-white/60">
              {selection.gradeId ? `Grade: ${selection.gradeId}` : `Grade: ${grades[0].name}`}
            </div>
            <div className="mt-4">
              <button onClick={() => analytics.track("start_build")} className="w-full px-3 py-2 rounded bg-[var(--brand-primary)] text-white">Start Build</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};