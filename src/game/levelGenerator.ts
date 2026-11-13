import { COLS, ROWS } from '../constants/config';
import { FALLBACK_KINDS, FALLBACK_MASKS, sectorOf } from '../constants/levels';
import { DIRS, SHAPES, dirBetween, minRotationsTo, opposite, popcount, rotateMask } from './ports';
import { solveRouting } from './routing';
import type { Grid, NodeCell, NodeKind } from './types';

/** Deterministic PRNG - one seed per attempt, so any layout is reproducible. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFor(levelIndex: number, attempt: number): number {
  return ((levelIndex + 1) * 7919) ^ ((attempt + 1) * 104729);
}

function pick<T>(rnd: () => number, list: T[]): T {
  return list[Math.floor(rnd() * list.length) % list.length];
}

function shuffle<T>(rnd: () => number, list: T[]): T[] {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

/**
 * Builds ONE candidate plate for the given seed. Placement always comes from
 * the generator, never from a constant: a randomised spanning tree is grown
 * from the beacon, satellites are picked from its deepest leaves, the tree is
 * pruned to the beacon-to-satellite paths and everything off that circuit
 * becomes debris or loose connectors.
 */
export function buildCandidate(levelIndex: number, attempt: number): Grid {
  const spec = sectorOf(levelIndex);
  const seed = seedFor(levelIndex, attempt);
  const rnd = mulberry32(seed);
  const count = COLS * ROWS;

  const beaconId = Math.floor(rnd() * count);
  const parent = new Array<number>(count).fill(-1);
  const depth = new Array<number>(count).fill(-1);
  const visited = new Array<boolean>(count).fill(false);

  // randomised DFS spanning tree over every cell
  const stack: number[] = [beaconId];
  visited[beaconId] = true;
  depth[beaconId] = 0;
  while (stack.length > 0) {
    const id = stack[stack.length - 1];
    const row = Math.floor(id / COLS);
    const col = id % COLS;
    const options: number[] = [];
    for (let d = 0; d < DIRS.length; d++) {
      const nr = row + DIRS[d].dr;
      const nc = col + DIRS[d].dc;
      if (nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS) {
        continue;
      }
      const nid = nr * COLS + nc;
      if (!visited[nid]) {
        options.push(nid);
      }
    }
    if (options.length === 0) {
      stack.pop();
      continue;
    }
    const nid = pick(rnd, options);
    visited[nid] = true;
    parent[nid] = id;
    depth[nid] = depth[id] + 1;
    stack.push(nid);
  }

  // satellites: deep cells, never next door to the beacon
  const deep = shuffle(
    rnd,
    Array.from({ length: count }, (_, i) => i).filter(i => depth[i] >= 3),
  ).sort((a, b) => depth[b] - depth[a]);
  const pool = deep.slice(0, Math.max(spec.satellites, Math.ceil(deep.length / 2)));
  const satelliteIds = shuffle(rnd, pool).slice(0, spec.satellites);
  if (satelliteIds.length < spec.satellites) {
    throw new Error('satellite placement failed');
  }

  // prune the tree down to the beacon-to-satellite circuit
  const masks = new Array<number>(count).fill(0);
  const onCircuit = new Array<boolean>(count).fill(false);
  onCircuit[beaconId] = true;
  for (let i = 0; i < satelliteIds.length; i++) {
    let cur = satelliteIds[i];
    onCircuit[cur] = true;
    while (cur !== beaconId && parent[cur] >= 0) {
      const p = parent[cur];
      const cr = Math.floor(cur / COLS);
      const cc = cur % COLS;
      const pr = Math.floor(p / COLS);
      const pc = p % COLS;
      const bit = dirBetween(cr, cc, pr, pc);
      masks[cur] |= bit;
      masks[p] |= opposite(bit);
      onCircuit[p] = true;
      cur = p;
    }
  }

  // debris goes off-circuit, preferably right next to the live route
  const offCircuit = Array.from({ length: count }, (_, i) => i).filter(i => !onCircuit[i]);
  const touching = offCircuit.filter(id => {
    const row = Math.floor(id / COLS);
    const col = id % COLS;
    for (let d = 0; d < DIRS.length; d++) {
      const nr = row + DIRS[d].dr;
      const nc = col + DIRS[d].dc;
      if (nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS) {
        continue;
      }
      if (onCircuit[nr * COLS + nc]) {
        return true;
      }
    }
    return false;
  });
  const hazardIds = shuffle(rnd, touching)
    .concat(shuffle(rnd, offCircuit.filter(id => touching.indexOf(id) === -1)))
    .slice(0, Math.min(spec.hazards, offCircuit.length));

  // amplifiers sit on two-port circuit cells, never on the beacon or a sink
  const ampCandidates = Array.from({ length: count }, (_, i) => i).filter(
    i =>
      onCircuit[i] &&
      i !== beaconId &&
      satelliteIds.indexOf(i) === -1 &&
      popcount(masks[i]) === 2,
  );
  const amplifierIds = shuffle(rnd, ampCandidates).slice(0, spec.amplifiers);

  const cells: NodeCell[] = [];
  for (let id = 0; id < count; id++) {
    const row = Math.floor(id / COLS);
    const col = id % COLS;
    let kind: NodeKind = 'relay';
    let baseMask = masks[id];
    let rotatable = true;

    if (id === beaconId) {
      kind = 'beacon';
      rotatable = false;
    } else if (satelliteIds.indexOf(id) >= 0) {
      kind = 'satellite';
      rotatable = false;
    } else if (hazardIds.indexOf(id) >= 0) {
      kind = 'hazard';
      baseMask = 0;
      rotatable = false;
    } else if (amplifierIds.indexOf(id) >= 0) {
      kind = 'amplifier';
    } else if (!onCircuit[id]) {
      // loose connector: real hardware, just not part of the intended route
      baseMask = pick(rnd, SHAPES);
    }

    cells.push({
      id,
      row,
      col,
      kind,
      baseMask,
      solutionRotation: 0,
      startRotation: 0,
      rotatable,
    });
  }

  const grid: Grid = {
    cols: COLS,
    rows: ROWS,
    cells,
    beaconId,
    satelliteIds,
    hazardIds,
    amplifierIds,
    optimalRotations: 0,
    seed,
    levelIndex,
    fallback: false,
  };

  scramble(grid, rnd);
  return grid;
}

/**
 * Turns every rotatable node off its solution, then walks the result back
 * until the plate does NOT start inside a debris surge and still needs at
 * least one tap.
 */
export function scramble(grid: Grid, rnd: () => number): void {
  const rotatable = grid.cells.filter(c => c.rotatable);
  for (let i = 0; i < rotatable.length; i++) {
    rotatable[i].startRotation = Math.floor(rnd() * 4);
  }

  const rotations = () => grid.cells.map(c => c.startRotation);

  for (let guard = 0; guard < 24; guard++) {
    const routing = solveRouting(grid, rotations());
    if (routing.breaches.length === 0) {
      break;
    }
    for (let i = 0; i < routing.breaches.length; i++) {
      const cell = grid.cells[routing.breaches[i]];
      if (cell.rotatable) {
        cell.startRotation = (cell.startRotation + 1) % 4;
      }
    }
  }

  grid.optimalRotations = countOptimal(grid);
  if (grid.optimalRotations === 0 && rotatable.length > 0) {
    const safe = rotatable.filter(c => !touchesHazard(grid, c.id));
    const target = safe.length > 0 ? safe[Math.floor(rnd() * safe.length)] : rotatable[0];
    target.startRotation = (target.startRotation + 1) % 4;
    grid.optimalRotations = countOptimal(grid);
  }
}

function touchesHazard(grid: Grid, id: number): boolean {
  const cell = grid.cells[id];
  for (let d = 0; d < DIRS.length; d++) {
    const nr = cell.row + DIRS[d].dr;
    const nc = cell.col + DIRS[d].dc;
    if (nr < 0 || nc < 0 || nr >= grid.rows || nc >= grid.cols) {
      continue;
    }
    if (grid.cells[nr * grid.cols + nc].kind === 'hazard') {
      return true;
    }
  }
  return false;
}

export function countOptimal(grid: Grid): number {
  let total = 0;
  for (let i = 0; i < grid.cells.length; i++) {
    const cell = grid.cells[i];
    if (!cell.rotatable || cell.baseMask === 0) {
      continue;
    }
    total += minRotationsTo(cell.baseMask, cell.startRotation, cell.solutionRotation);
  }
  return total;
}

/** Hand-written guarantee layout - used only when 20 seeded attempts all fail. */
export function fallbackGrid(levelIndex: number): Grid {
  const cells: NodeCell[] = [];
  const satelliteIds: number[] = [];
  const amplifierIds: number[] = [];
  for (let id = 0; id < FALLBACK_KINDS.length; id++) {
    const kind = FALLBACK_KINDS[id] as NodeKind;
    if (kind === 'satellite') {
      satelliteIds.push(id);
    }
    if (kind === 'amplifier') {
      amplifierIds.push(id);
    }
    cells.push({
      id,
      row: Math.floor(id / COLS),
      col: id % COLS,
      kind,
      baseMask: FALLBACK_MASKS[id],
      solutionRotation: 0,
      startRotation: 0,
      rotatable: kind === 'relay' || kind === 'amplifier',
    });
  }
  const grid: Grid = {
    cols: COLS,
    rows: ROWS,
    cells,
    beaconId: 0,
    satelliteIds,
    hazardIds: [],
    amplifierIds,
    optimalRotations: 0,
    seed: seedFor(levelIndex, 999),
    levelIndex,
    fallback: true,
  };
  scramble(grid, mulberry32(grid.seed));
  return grid;
}

export function startRotations(grid: Grid): number[] {
  return grid.cells.map(c => c.startRotation);
}

export function solutionRotations(grid: Grid): number[] {
  return grid.cells.map(c => c.solutionRotation);
}

export function maskAt(grid: Grid, id: number, rotation: number): number {
  return rotateMask(grid.cells[id].baseMask, rotation);
}
