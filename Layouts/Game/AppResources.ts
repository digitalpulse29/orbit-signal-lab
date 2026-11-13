/* @app-slot:game */


// ------ config ------


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

// ------ levels ------
export interface SectorSpec {
  index: number;
  name: string;
  satellites: number;
  hazards: number;
  amplifiers: number;
}

export const SECTORS: SectorSpec[] = [
  { index: 0, name: 'ALPHA', satellites: 2, hazards: 3, amplifiers: 1 },
  { index: 1, name: 'BETA', satellites: 2, hazards: 4, amplifiers: 1 },
  { index: 2, name: 'GAMMA', satellites: 3, hazards: 5, amplifiers: 2 },
  { index: 3, name: 'DELTA', satellites: 3, hazards: 6, amplifiers: 2 },
];

export function sectorOf(levelIndex: number): SectorSpec {
  const i = Math.max(0, Math.min(SECTORS.length - 1, Math.floor(levelIndex / LEVELS_PER_SECTOR)));
  return SECTORS[i];
}

export function levelLabel(levelIndex: number): string {
  const sector = sectorOf(levelIndex);
  const within = (levelIndex % LEVELS_PER_SECTOR) + 1;
  return 'SECTOR ' + sector.name + ' · LEVEL ' + within;
}

/**
 * Guaranteed-solvable fallback plate (serpentine route, beacon top-left,
 * two satellites, one amplifier). Used only if the seeded generator fails
 * its solvability proof 20 times in a row - it is a guarantee, not the game.
 */
export const FALLBACK_KINDS: string[] = [
  'beacon', 'relay', 'relay', 'relay', 'relay',
  'relay', 'relay', 'relay', 'relay', 'relay',
  'relay', 'relay', 'amplifier', 'relay', 'satellite',
  'relay', 'relay', 'relay', 'relay', 'relay',
  'relay', 'relay', 'relay', 'relay', 'relay',
  'satellite', 'relay', 'relay', 'relay', 'relay',
];

export const FALLBACK_MASKS: number[] = [
  2, 10, 10, 10, 12,
  6, 10, 10, 10, 9,
  3, 10, 10, 10, 12,
  6, 10, 10, 10, 9,
  3, 10, 10, 10, 12,
  2, 10, 10, 10, 9,
];

// ------ theme ------
export const THEME = {
  name: 'SPACE_COSMOS',
  colors: {
    bg: '#050510',
    surface: '#0A0A20',
    surfaceElevated: '#10103A',
    surfaceAlt: '#0A1628',
    primary: '#4169E1',
    secondary: '#7B2FBE',
    signal: '#38E1FF',
    warning: '#FFC24B',
    danger: '#FF3B5C',
    textPrimary: '#F2F5FF',
    textSecondary: '#9AA6D8',
    textTertiary: '#5C6793',
    hairline: 'rgba(255,255,255,0.08)',
    glass: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.10)',
    portDark: '#3A4170',
    starEmpty: '#2A2E4A',
  },
  overlay: {
    loader: ['rgba(5,5,16,0.94)', 'rgba(10,10,32,0.92)', 'rgba(5,5,16,0.97)'],
    menu: ['rgba(10,10,32,0.55)', 'rgba(5,5,16,0.86)'],
    board: ['rgba(5,5,16,0.76)', 'rgba(10,10,32,0.90)'],
    panel: ['rgba(10,10,32,0.68)', 'rgba(5,5,16,0.90)'],
    win: ['rgba(65,105,225,0.55)', 'rgba(5,5,16,0.92)'],
    loss: ['rgba(255,59,92,0.35)', 'rgba(5,5,16,0.94)'],
  },
  gradients: {
    primary: ['#4169E1', '#7B2FBE'],
    beam: ['#38E1FF', '#4169E1'],
    amber: ['#FFC24B', '#E8893F'],
    danger: ['#FF3B5C', '#7B2FBE'],
  },
  radius: { sm: 10, md: 14, lg: 18, xl: 22, xxl: 28, pill: 100 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  tabular: { fontVariant: ['tabular-nums' as const] },
};

export function glow(color: string, opacity = 0.4, radius = 20, elevation = 12) {
  return {
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: 6 },
    elevation,
  };
}

export type BeamPalette = 'cosmic' | 'contrast';

export function beamColors(palette: BeamPalette) {
  if (palette === 'contrast') {
    return {
      beam: '#FFC24B',
      under: '#FFFFFF',
      port: '#FFFFFF',
      portDark: '#5C6793',
    };
  }
  return {
    beam: '#38E1FF',
    under: '#4169E1',
    port: '#38E1FF',
    portDark: '#3A4170',
  };
}

/* autopad-begin */
function arevigayac(_eroquvefate: string, _ovatevota: string): number {
  return 45;
}
function gofeqesug(_bizorayim: number): void {
  const olafotalak = 67;
  if (olafotalak > 82) return;
}
function gurasu(_qefipuyusa: number): string {
  return "otaka";
}
function elujud(_kekoraq: boolean, _riyatuxilevi: string, _pepozolume: string): void {}
function elater(_nekisi: number, _zivumud: number): void {}
function ozotonovetej(_fugire: boolean): number {
  const ogacev: number = 110;
  return ogacev;
}
function pikufivuqiv(): boolean {
  const zuripaxeqada: boolean = true;
  return zuripaxeqada;
}
function aqumezani(_lapizecirozu: number): boolean {
  const ketesuze = 70;
  const baqomagil: boolean = true;
  return baqomagil;
}
function imiyugoq(_elaleca: boolean, _aqafode: string): string { return "adicu"; }
function umadunesiba(): void {}
function irowepegewi(_abazumu: boolean, _uralarolad: number, _quwubidi: number): void {}
function mawice(_xiqiku: number, _leseyeka: string, _pizugo: boolean): void {
  const edoqok = 32;
  if (edoqok > 24) return;
}
/* autopad-end */
