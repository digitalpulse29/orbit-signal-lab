/** Port maths. Bits: N=1, E=2, S=4, W=8. A rotation step is 90 degrees clockwise. */

export const N = 1;
export const E = 2;
export const S = 4;
export const W = 8;

export const DIRS = [
  { bit: N, dr: -1, dc: 0 },
  { bit: E, dr: 0, dc: 1 },
  { bit: S, dr: 1, dc: 0 },
  { bit: W, dr: 0, dc: -1 },
];

export function opposite(bit: number): number {
  if (bit === N) {
    return S;
  }
  if (bit === S) {
    return N;
  }
  if (bit === E) {
    return W;
  }
  return E;
}

export function rotateMask(mask: number, steps: number): number {
  let m = mask & 15;
  const k = ((steps % 4) + 4) % 4;
  for (let i = 0; i < k; i++) {
    m = ((m << 1) | (m >> 3)) & 15;
  }
  return m;
}

export function popcount(mask: number): number {
  let n = 0;
  let m = mask & 15;
  while (m) {
    n += m & 1;
    m >>= 1;
  }
  return n;
}

/** Smallest number of clockwise taps that turns `from` into an orientation equal to `to`. */
export function minRotationsTo(baseMask: number, from: number, to: number): number {
  const target = rotateMask(baseMask, to);
  for (let r = 0; r < 4; r++) {
    if (rotateMask(baseMask, from + r) === target) {
      return r;
    }
  }
  return 0;
}

export function dirBetween(
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): number {
  if (toRow === fromRow - 1 && toCol === fromCol) {
    return N;
  }
  if (toRow === fromRow + 1 && toCol === fromCol) {
    return S;
  }
  if (toRow === fromRow && toCol === fromCol + 1) {
    return E;
  }
  if (toRow === fromRow && toCol === fromCol - 1) {
    return W;
  }
  return 0;
}

/** Shapes a rotatable connector can take: straight, elbow, tee, cross. */
export const SHAPES = [N | S, N | E, N | E | S, N | E | S | W];
