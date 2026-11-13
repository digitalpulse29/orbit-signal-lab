import type { Outcome, RunResult } from './types';

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
