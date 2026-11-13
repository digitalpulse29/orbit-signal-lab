export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return value < min ? min : value > max ? max : value;
}

/** 1740 -> "1,740" */
export function formatScore(value: number): string {
  const safe = Number.isFinite(value) ? Math.round(value) : 0;
  return String(safe).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 42.4 -> "42s" */
export function formatSeconds(value: number): string {
  return Math.max(0, Math.ceil(value)) + 's';
}

/** 83.2 -> "83%" */
export function formatPercent(value: number): string {
  return Math.round(clamp(value, 0, 100)) + '%';
}
