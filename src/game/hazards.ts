import { FLARE_DURATION_MS, FLARE_INTERVAL_MS, SURGE_COST } from '../constants/config';
import type { Grid } from './types';

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
