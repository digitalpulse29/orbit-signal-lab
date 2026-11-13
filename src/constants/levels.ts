import { LEVELS_PER_SECTOR } from './config';

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
