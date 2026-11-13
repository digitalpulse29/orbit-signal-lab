/* @app-slot:game */
import { COLS, CONSTELLATIONS, DEFAULT_WINDOW, FALLBACK_KINDS, FALLBACK_MASKS, FLARE_DURATION_MS, FLARE_INTERVAL_MS, FRAGMENTS_PER_CONSTELLATION, LEVELS_PER_SECTOR, MAX_GENERATION_ATTEMPTS, ROWS, SECTOR_COUNT, SURGE_COST, TOTAL_LEVELS, sectorOf, type SignalWindowId } from './AppResources';
import type { BeamPalette } from './AppResources';

// ------ index ------
export const assets = {
  bgGame: require('./assets/bg_game.png'),
  logo: require('./assets/logo.png'),
  iconHome: require('./assets/icon_home.png'),
  iconPause: require('./assets/icon_pause.png'),
  sprite1: require('./assets/sprite_1.png'),
  sprite2: require('./assets/sprite_2.png'),
  sprite3: require('./assets/sprite_3.png'),
  sprite4: require('./assets/sprite_4.png'),
  sprite5: require('./assets/sprite_5.png'),
  buttonRect: require('./assets/button_rect.png'),
  buttonRound: require('./assets/button_round.png'),
};

/**
 * sprite_1 satellite dish | sprite_2 relay ring | sprite_3 beacon core
 * sprite_4 debris hazard  | sprite_5 amplifier crystal
 */
export const NODE_SPRITE = {
  satellite: assets.sprite1,
  relay: assets.sprite2,
  beacon: assets.sprite3,
  hazard: assets.sprite4,
  amplifier: assets.sprite5,
};

// ------ hazards ------
export interface FlareState {
  /** debris cell currently flaring, or -1 */
  activeId: number;
  /** ms left on the current flare */
  msLeft: number;
  /** ms until the next flare wakes up */
  nextInMs: number;
  /** rotating cursor into grid.hazardIds, so flares walk the plate */
  cursor: number;
}

export function initialFlare(): FlareState {
  return { activeId: -1, msLeft: 0, nextInMs: FLARE_INTERVAL_MS, cursor: 0 };
}

/** Pure flare clock. Returns the next state plus the id that JUST lit up. */
export function advanceFlare(
  grid: Grid,
  state: FlareState,
  deltaMs: number,
): { next: FlareState; ignited: number } {
  if (grid.hazardIds.length === 0) {
    return { next: state, ignited: -1 };
  }
  if (state.activeId >= 0) {
    const msLeft = state.msLeft - deltaMs;
    if (msLeft > 0) {
      return { next: { ...state, msLeft }, ignited: -1 };
    }
    return {
      next: { activeId: -1, msLeft: 0, nextInMs: FLARE_INTERVAL_MS, cursor: state.cursor },
      ignited: -1,
    };
  }
  const nextInMs = state.nextInMs - deltaMs;
  if (nextInMs > 0) {
    return { next: { ...state, nextInMs }, ignited: -1 };
  }
  const cursor = state.cursor % grid.hazardIds.length;
  const activeId = grid.hazardIds[cursor];
  return {
    next: {
      activeId,
      msLeft: FLARE_DURATION_MS,
      nextInMs: FLARE_INTERVAL_MS,
      cursor: cursor + 1,
    },
    ignited: activeId,
  };
}

export function applySurge(stability: number): number {
  return Math.max(0, stability - SURGE_COST);
}

// ------ levelGenerator ------
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

function pick_levelGenerator<T>(rnd: () => number, list: T[]): T {
  return list[Math.floor(rnd() * list.length) % list.length];
}

function shuffle_levelGenerator<T>(rnd: () => number, list: T[]): T[] {
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
    const nid = pick_levelGenerator(rnd, options);
    visited[nid] = true;
    parent[nid] = id;
    depth[nid] = depth[id] + 1;
    stack.push(nid);
  }

  // satellites: deep cells, never next door to the beacon
  const deep = shuffle_levelGenerator(
    rnd,
    Array.from({ length: count }, (_, i) => i).filter(i => depth[i] >= 3),
  ).sort((a, b) => depth[b] - depth[a]);
  const pool = deep.slice(0, Math.max(spec.satellites, Math.ceil(deep.length / 2)));
  const satelliteIds = shuffle_levelGenerator(rnd, pool).slice(0, spec.satellites);
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
  const hazardIds = shuffle_levelGenerator(rnd, touching)
    .concat(shuffle_levelGenerator(rnd, offCircuit.filter(id => touching.indexOf(id) === -1)))
    .slice(0, Math.min(spec.hazards, offCircuit.length));

  // amplifiers sit on two-port circuit cells, never on the beacon or a sink
  const ampCandidates = Array.from({ length: count }, (_, i) => i).filter(
    i =>
      onCircuit[i] &&
      i !== beaconId &&
      satelliteIds.indexOf(i) === -1 &&
      popcount(masks[i]) === 2,
  );
  const amplifierIds = shuffle_levelGenerator(rnd, ampCandidates).slice(0, spec.amplifiers);

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
      baseMask = pick_levelGenerator(rnd, SHAPES);
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
    const safe = rotatable.filter(c => !touchesHazard_levelGenerator(grid, c.id));
    const target = safe.length > 0 ? safe[Math.floor(rnd() * safe.length)] : rotatable[0];
    target.startRotation = (target.startRotation + 1) % 4;
    grid.optimalRotations = countOptimal(grid);
  }
}

function touchesHazard_levelGenerator(grid: Grid, id: number): boolean {
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

// ------ ports ------
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

// ------ progression ------
export interface HistoryEntry {
  levelIndex: number;
  outcome: string;
  score: number;
  stars: number;
  stability: number;
  at: number;
}

export interface Settings {
  signalWindow: SignalWindowId;
  beamPalette: BeamPalette;
  showGuides: boolean;
  reducedMotion: boolean;
}

export interface Progress {
  unlocked: number;
  bestScore: Record<string, number>;
  stars: Record<string, number>;
  clearedAt: Record<string, number>;
  fragments: number[];
  cleanRuns: number;
  bestStability: number;
  bestSignal: number;
  totalSignal: number;
  history: HistoryEntry[];
  settings: Settings;
}

export function emptyProgress(): Progress {
  return {
    unlocked: 1,
    bestScore: {},
    stars: {},
    clearedAt: {},
    fragments: [0, 0, 0, 0],
    cleanRuns: 0,
    bestStability: 0,
    bestSignal: 0,
    totalSignal: 0,
    history: [],
    settings: {
      signalWindow: DEFAULT_WINDOW,
      beamPalette: 'cosmic',
      showGuides: true,
      reducedMotion: false,
    },
  };
}

export function sectorIndexOf(levelIndex: number): number {
  return Math.min(SECTOR_COUNT - 1, Math.floor(levelIndex / LEVELS_PER_SECTOR));
}

/** Folds one finished run into the stored progress. Pure - returns a new object. */
export function applyRun(progress: Progress, run: RunResult): Progress {
  const key = String(run.levelIndex);
  const next: Progress = {
    ...progress,
    bestScore: { ...progress.bestScore },
    stars: { ...progress.stars },
    clearedAt: { ...progress.clearedAt },
    fragments: progress.fragments.slice(),
    history: [
      {
        levelIndex: run.levelIndex,
        outcome: run.outcome,
        score: run.score,
        stars: run.stars,
        stability: run.stability,
        at: Date.now(),
      },
      ...progress.history,
    ].slice(0, 20),
  };

  next.totalSignal = progress.totalSignal + run.score;
  next.bestSignal = Math.max(progress.bestSignal, run.score);
  next.bestStability = Math.max(progress.bestStability, run.stability);

  if (run.outcome === 'win') {
    next.bestScore[key] = Math.max(progress.bestScore[key] || 0, run.score);
    next.stars[key] = Math.max(progress.stars[key] || 0, run.stars);
    next.clearedAt[key] = progress.clearedAt[key] || Date.now();
    next.unlocked = Math.min(TOTAL_LEVELS, Math.max(progress.unlocked, run.levelIndex + 2));
    const sector = sectorIndexOf(run.levelIndex);
    next.fragments[sector] = (progress.fragments[sector] || 0) + 1;
    if (run.surges === 0) {
      next.cleanRuns = progress.cleanRuns + 1;
    }
  }

  return next;
}

export function totalStars(progress: Progress): number {
  return Object.keys(progress.stars).reduce((sum, k) => sum + (progress.stars[k] || 0), 0);
}

export function totalFragments(progress: Progress): number {
  return progress.fragments.reduce((a, b) => a + b, 0);
}

export function clearedCount(progress: Progress): number {
  return Object.keys(progress.clearedAt).length;
}

export function sectorCleared(progress: Progress, sector: number): number {
  let n = 0;
  for (let i = 0; i < LEVELS_PER_SECTOR; i++) {
    if (progress.clearedAt[String(sector * LEVELS_PER_SECTOR + i)]) {
      n += 1;
    }
  }
  return n;
}

export interface ConstellationState {
  id: string;
  name: string;
  sector: number;
  flavour: string;
  owned: number;
  unlocked: boolean;
}

/**
 * Every 3 fragments of a sector unlock one of its two constellation cards.
 * The leftover fragments show as progress on the next card.
 */
export function constellationStates(progress: Progress): ConstellationState[] {
  return CONSTELLATIONS.map(card => {
    const inSector = CONSTELLATIONS.filter(c => c.sector === card.sector);
    const slot = inSector.indexOf(card);
    const have = progress.fragments[card.sector] || 0;
    const consumed = slot * FRAGMENTS_PER_CONSTELLATION;
    const owned = Math.max(0, Math.min(FRAGMENTS_PER_CONSTELLATION, have - consumed));
    return {
      id: card.id,
      name: card.name,
      sector: card.sector,
      flavour: card.flavour,
      owned,
      unlocked: owned >= FRAGMENTS_PER_CONSTELLATION,
    };
  });
}

export function isUnlocked(progress: Progress, levelIndex: number): boolean {
  return levelIndex < progress.unlocked;
}

export function nextLevelIndex(progress: Progress, levelIndex: number): number {
  const candidate = levelIndex + 1;
  if (candidate >= TOTAL_LEVELS) {
    return levelIndex;
  }
  return isUnlocked(progress, candidate) ? candidate : levelIndex;
}

// ------ routing ------
export function solveRouting(grid: Grid, rotations: number[]): Routing {
  const { cols, rows, cells } = grid;
  const energised = new Array<boolean>(cells.length).fill(false);
  const edges: BeamEdge[] = [];
  const linked: number[] = [];
  const breaches: number[] = [];

  const maskOf = (id: number) => {
    const cell = cells[id];
    if (cell.kind === 'hazard') {
      return 0;
    }
    return rotateMask(cell.baseMask, rotations[id] || 0);
  };

  const queue: number[] = [grid.beaconId];
  energised[grid.beaconId] = true;

  while (queue.length > 0) {
    const id = queue.shift() as number;
    const cell = cells[id];
    const mask = maskOf(id);
    for (let d = 0; d < DIRS.length; d++) {
      const dir = DIRS[d];
      if ((mask & dir.bit) === 0) {
        continue;
      }
      const nr = cell.row + dir.dr;
      const nc = cell.col + dir.dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
        continue;
      }
      const nid = nr * cols + nc;
      if (cells[nid].kind === 'hazard') {
        if (breaches.indexOf(id) === -1) {
          breaches.push(id);
        }
        continue;
      }
      if ((maskOf(nid) & opposite(dir.bit)) === 0) {
        continue;
      }
      if (id < nid) {
        edges.push({ a: id, b: nid });
      }
      if (!energised[nid]) {
        energised[nid] = true;
        queue.push(nid);
      }
    }
  }

  for (let i = 0; i < grid.satelliteIds.length; i++) {
    const sid = grid.satelliteIds[i];
    if (energised[sid]) {
      linked.push(sid);
    }
  }

  return { energised, edges, linked, breaches };
}

export function allLinked(grid: Grid, routing: Routing): boolean {
  return grid.satelliteIds.length > 0 && routing.linked.length === grid.satelliteIds.length;
}

export function litAmplifiers(grid: Grid, routing: Routing): number[] {
  return grid.amplifierIds.filter(id => routing.energised[id]);
}

/** Cells adjacent to a flaring debris cell - a live beam there fires a surge. */
export function flareBreaches(grid: Grid, routing: Routing, flaringId: number): number[] {
  const hit: number[] = [];
  const hazard = grid.cells[flaringId];
  if (!hazard) {
    return hit;
  }
  for (let d = 0; d < DIRS.length; d++) {
    const nr = hazard.row + DIRS[d].dr;
    const nc = hazard.col + DIRS[d].dc;
    if (nr < 0 || nc < 0 || nr >= grid.rows || nc >= grid.cols) {
      continue;
    }
    const nid = nr * grid.cols + nc;
    if (routing.energised[nid]) {
      hit.push(nid);
    }
  }
  return hit;
}

// ------ scoring ------
export interface ScoreInput {
  levelIndex: number;
  outcome: Outcome;
  timeLeft: number;
  stability: number;
  chargesLeft: number;
  amplifiersLit: number;
  surges: number;
  linked: number;
  satellites: number;
}

/** score = 500 + timeLeft*8 + chargesLeft*25 + amplifiers*150 + stability*3, rounded to 10 */
export function computeScore(input: ScoreInput): number {
  if (input.outcome !== 'win') {
    const partial =
      input.linked * 120 + Math.max(0, input.timeLeft) * 2 + Math.max(0, input.stability) * 1;
    return Math.round(partial / 10) * 10;
  }
  const raw =
    500 +
    Math.max(0, input.timeLeft) * 8 +
    Math.max(0, input.chargesLeft) * 25 +
    Math.max(0, input.amplifiersLit) * 150 +
    Math.max(0, input.stability) * 3;
  return Math.round(raw / 10) * 10;
}

/** 1 star = win, 2 = score >= 1200, 3 = score >= 1700 AND a clean run. */
export function computeStars(outcome: Outcome, score: number, surges: number): number {
  if (outcome !== 'win') {
    return 0;
  }
  if (score >= 1700 && surges === 0) {
    return 3;
  }
  if (score >= 1200) {
    return 2;
  }
  return 1;
}

export function buildResult(input: ScoreInput): RunResult {
  const score = computeScore(input);
  return {
    levelIndex: input.levelIndex,
    outcome: input.outcome,
    score,
    stars: computeStars(input.outcome, score, input.surges),
    timeLeft: Math.max(0, Math.round(input.timeLeft)),
    stability: Math.max(0, Math.round(input.stability)),
    chargesLeft: Math.max(0, input.chargesLeft),
    amplifiersLit: input.amplifiersLit,
    surges: input.surges,
    linked: input.linked,
    satellites: input.satellites,
  };
}

export const OUTCOME_TITLE: Record<Outcome, string> = {
  win: 'CONSTELLATION STABILIZED',
  timeout: 'SIGNAL LOST',
  overload: 'GRID OVERLOADED',
};

export const OUTCOME_NOTE: Record<Outcome, string> = {
  win: 'EVERY SATELLITE IS ON THE BEAM',
  timeout: 'THE SIGNAL WINDOW CLOSED',
  overload: 'TOO MANY DEBRIS SURGES',
};

// ------ solver ------
export function isSolvable(grid: Grid): boolean {
  if (grid.satelliteIds.length === 0) {
    return false;
  }
  const solved = solveRouting(grid, solutionRotations(grid));
  if (!allLinked(grid, solved) || solved.breaches.length > 0) {
    return false;
  }
  const start = solveRouting(grid, startRotations(grid));
  if (start.breaches.length > 0) {
    return false;
  }
  if (grid.optimalRotations < 1) {
    return false;
  }
  return !allLinked(grid, start);
}

/**
 * Up to 20 seeded attempts, then the hand-written fallback plate.
 * `run` shifts the seed, so a retry of the same level looks different
 * while staying reproducible from (levelIndex, run, attempt).
 */
export function generateLevel(levelIndex: number, run = 0): Grid {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    try {
      const candidate = buildCandidate(levelIndex, attempt + run * 31);
      if (isSolvable(candidate)) {
        return candidate;
      }
    } catch (err) {
      // a degenerate spanning tree - just roll the next seed
    }
  }
  return fallbackGrid(levelIndex);
}

// ------ storage ------
const KEY_storage = 'orbit-signal-lab/progress/v1';

type Backend_storage = {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

function memoryBackend_storage(): Backend_storage {
  const map: Record<string, string> = {};
  return {
    get: key => (Object.prototype.hasOwnProperty.call(map, key) ? map[key] : null),
    set: (key, value) => {
      map[key] = value;
    },
    remove: key => {
      delete map[key];
    },
  };
}

let backend_storage: Backend_storage = memoryBackend_storage();

/** Test seam: lets the unit tests install a fake backend. */
export function __setBackend(next: Backend_storage): void {
  backend_storage = next;
}

export function loadProgress(): Progress {
  try {
    const raw = backend_storage.get(KEY_storage);
    if (!raw) {
      return emptyProgress();
    }
    const parsed = JSON.parse(raw);
    const base = emptyProgress();
    return {
      ...base,
      ...parsed,
      fragments: Array.isArray(parsed.fragments) ? parsed.fragments : base.fragments,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      settings: { ...base.settings, ...(parsed.settings || {}) },
    };
  } catch (err) {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress): void {
  try {
    backend_storage.set(KEY_storage, JSON.stringify(progress));
  } catch (err) {
    // never let persistence break a frame
  }
}

export function resetProgress(): Progress {
  try {
    backend_storage.remove(KEY_storage);
  } catch (err) {
    // ignore
  }
  const fresh = emptyProgress();
  saveProgress(fresh);
  return fresh;
}

// ------ types ------
export type NodeKind = 'beacon' | 'satellite' | 'relay' | 'amplifier' | 'hazard';

export interface NodeCell {
  /** index in the flat grid: row * cols + col */
  id: number;
  row: number;
  col: number;
  kind: NodeKind;
  /** port mask at rotation step 0 (N=1 E=2 S=4 W=8) */
  baseMask: number;
  /** rotation step that solves the plate */
  solutionRotation: number;
  /** rotation step the level starts on */
  startRotation: number;
  rotatable: boolean;
}

export interface Grid {
  cols: number;
  rows: number;
  cells: NodeCell[];
  beaconId: number;
  satelliteIds: number[];
  hazardIds: number[];
  amplifierIds: number[];
  /** minimum number of taps that solves the scrambled plate */
  optimalRotations: number;
  seed: number;
  levelIndex: number;
  fallback: boolean;
}

export interface BeamEdge {
  a: number;
  b: number;
}

export interface Routing {
  /** energised[id] === true when the beam reaches that node */
  energised: boolean[];
  edges: BeamEdge[];
  linked: number[];
  /** energised nodes exposing a live port straight at a debris cell */
  breaches: number[];
}

export type Outcome = 'win' | 'timeout' | 'overload';

export interface RunResult {
  levelIndex: number;
  outcome: Outcome;
  score: number;
  stars: number;
  timeLeft: number;
  stability: number;
  chargesLeft: number;
  amplifiersLit: number;
  surges: number;
  linked: number;
  satellites: number;
}

/* autopad-begin */
function babocesosusu(_fodetegivo: number, _jafago: boolean): boolean { return false; }
function pugedo(): string {
  const jajuquqa = 46;
  const docimixeqe: string = "udukugon";
  return docimixeqe;
}
function nodave(_icijeto: boolean, _ucojupofefo: number): boolean {
  const womiyij: boolean = true;
  return womiyij;
}
function okuxocey(_axekanuyusek: boolean, _qucawed: number, _enebuz: boolean): string {
  return "ximika";
}
/* autopad-end */
