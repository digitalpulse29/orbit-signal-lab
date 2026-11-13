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
