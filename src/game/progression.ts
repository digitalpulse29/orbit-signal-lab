import {
  CONSTELLATIONS,
  DEFAULT_WINDOW,
  FRAGMENTS_PER_CONSTELLATION,
  LEVELS_PER_SECTOR,
  SECTOR_COUNT,
  TOTAL_LEVELS,
  type SignalWindowId,
} from '../constants/config';
import type { BeamPalette } from '../constants/theme';
import type { RunResult } from './types';

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
