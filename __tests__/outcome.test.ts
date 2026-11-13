import { OUTCOME_NOTE, OUTCOME_TITLE, buildResult, computeStars } from '../src/game/scoring';

describe('round outcomes', () => {
  it('names every outcome in the game own words', () => {
    expect(OUTCOME_TITLE.win).toBe('CONSTELLATION STABILIZED');
    expect(OUTCOME_TITLE.timeout).toBe('SIGNAL LOST');
    expect(OUTCOME_TITLE.overload).toBe('GRID OVERLOADED');
    expect(OUTCOME_TITLE.win).not.toMatch(/game over/i);
    Object.keys(OUTCOME_NOTE).forEach(key => {
      expect(OUTCOME_NOTE[key as keyof typeof OUTCOME_NOTE].length).toBeGreaterThan(5);
    });
  });

  it('gives stars only on a win', () => {
    expect(computeStars('timeout', 9999, 0)).toBe(0);
    expect(computeStars('overload', 9999, 0)).toBe(0);
    expect(computeStars('win', 100, 4)).toBe(1);
  });

  it('builds a complete result payload for the result screen', () => {
    const run = buildResult({
      levelIndex: 6,
      outcome: 'win',
      timeLeft: 31.7,
      stability: 83.2,
      chargesLeft: 4,
      amplifiersLit: 1,
      surges: 0,
      linked: 2,
      satellites: 2,
    });
    expect(run.levelIndex).toBe(6);
    expect(run.timeLeft).toBe(32);
    expect(run.stability).toBe(83);
    expect(run.score).toBeGreaterThan(0);
    expect(run.stars).toBeGreaterThanOrEqual(1);
  });

  it('never returns a negative value to the UI', () => {
    const run = buildResult({
      levelIndex: 0,
      outcome: 'overload',
      timeLeft: -4,
      stability: -20,
      chargesLeft: -2,
      amplifiersLit: 0,
      surges: 3,
      linked: 0,
      satellites: 3,
    });
    expect(run.timeLeft).toBe(0);
    expect(run.stability).toBe(0);
    expect(run.chargesLeft).toBe(0);
    expect(run.score).toBeGreaterThanOrEqual(0);
  });
});
