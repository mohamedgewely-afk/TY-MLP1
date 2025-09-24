import type { SpecRow } from "../types.d.ts";

export const SAMPLE_SPECS: SpecRow[] = [
  { key: "power", label: "Power", values: { base: "285 hp", premium: "305 hp", sport: "325 hp", limited: "340 hp" } },
  { key: "torque", label: "Torque", values: { base: "350 Nm", premium: "370 Nm", sport: "390 Nm", limited: "410 Nm" } },
  { key: "seats", label: "Seating", values: { base: 5, premium: 5, sport: 5, limited: 7 } },
  { key: "warranty", label: "Warranty", values: { base: "3y/36k", premium: "3y/36k", sport: "4y/48k", limited: "5y/60k" } },
];