import { MAX_GENERATION_ATTEMPTS } from '../constants/config';
import {
  buildCandidate,
  fallbackGrid,
  solutionRotations,
  startRotations,
} from './levelGenerator';
import { allLinked, solveRouting } from './routing';
import type { Grid } from './types';

/**
 * A plate is accepted only when it is PROVEN solvable:
 * every satellite lights up in the solution state, the solution never
 * points a live port at debris, and the start state is scrambled but safe.
 */
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
