/** Product + gameplay constants. */

/** Loader holds for exactly 8000 ms - timer driven, no tap-to-skip, no early exit. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_BAR_MS = 7600;

export const COLS = 5;
export const ROWS = 6;
export const CELL_COUNT = COLS * ROWS;

export const SECTOR_COUNT = 4;
export const LEVELS_PER_SECTOR = 6;
export const TOTAL_LEVELS = SECTOR_COUNT * LEVELS_PER_SECTOR; // 24
export const STARS_TOTAL = TOTAL_LEVELS * 3; // 72

export const SIGNAL_WINDOWS = [
  { id: 'calm', label: 'CALM 95s', seconds: 95 },
  { id: 'standard', label: 'STANDARD 80s', seconds: 80 },
  { id: 'expert', label: 'EXPERT 65s', seconds: 65 },
];
export type SignalWindowId = 'calm' | 'standard' | 'expert';
export const DEFAULT_WINDOW: SignalWindowId = 'standard';

export function windowSeconds(id: SignalWindowId): number {
  const found = SIGNAL_WINDOWS.find(w => w.id === id);
  return found ? found.seconds : 80;
}

export const STABILITY_START = 100;
export const SURGE_COST = 34;
export const GO_FAIL_COST = 15;
export const OVERRIDE_COST = 10;
export const SURGE_REVERT_MS = 600;

export const UNDO_LIMIT = 3;
export const CHARGE_BONUS = 6;

export const FLARE_INTERVAL_MS = 15000;
export const FLARE_DURATION_MS = 4000;
export const AMPLIFY_FREEZE_MS = 5000;

export const ROTATE_TENSION = 150;
export const ROTATE_FRICTION = 11;
export const PRESS_TENSION = 220;
export const PRESS_FRICTION = 12;
export const ENTRANCE_TENSION = 46;
export const ENTRANCE_FRICTION = 8;

export const MAX_GENERATION_ATTEMPTS = 20;
export const HINT_VISIBLE_MS = 6000;
export const SCREEN_FADE_MS = 220;

export const CONSTELLATIONS = [
  { id: 'orion', name: 'ORION RELAY', sector: 0, flavour: 'ROUTED FROM SECTOR ALPHA' },
  { id: 'lyra', name: 'LYRA LINK', sector: 0, flavour: 'ROUTED FROM SECTOR ALPHA' },
  { id: 'vela', name: 'VELA ARC', sector: 1, flavour: 'ROUTED FROM SECTOR BETA' },
  { id: 'pyxis', name: 'PYXIS NODE', sector: 1, flavour: 'ROUTED FROM SECTOR BETA' },
  { id: 'carina', name: 'CARINA BEAM', sector: 2, flavour: 'ROUTED FROM SECTOR GAMMA' },
  { id: 'dorado', name: 'DORADO GRID', sector: 2, flavour: 'ROUTED FROM SECTOR GAMMA' },
  { id: 'tucana', name: 'TUCANA LOOP', sector: 3, flavour: 'ROUTED FROM SECTOR DELTA' },
  { id: 'phoenix', name: 'PHOENIX CORE', sector: 3, flavour: 'ROUTED FROM SECTOR DELTA' },
];
export const FRAGMENTS_PER_CONSTELLATION = 3;
