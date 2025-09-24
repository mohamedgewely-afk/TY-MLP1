export const asCurrency = (v?: number) =>
  v == null ? "-" : `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);