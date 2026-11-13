import { TOTAL_LEVELS } from '../src/constants/config';
import { applyRun, emptyProgress, isUnlocked, nextLevelIndex } from '../src/game/progression';
import { buildResult } from '../src/game/scoring';

function win(levelIndex: number, surges = 0, timeLeft = 40) {
  return buildResult({
    levelIndex,
    outcome: 'win',
    timeLeft,
    stability: 90,
    chargesLeft: 5,
    amplifiersLit: 1,
    surges,
    linked: 2,
    satellites: 2,
  });
}

describe('level unlocking', () => {
  it('starts with only the first level open', () => {
    const progress = emptyProgress();
    expect(isUnlocked(progress, 0)).toBe(true);
    expect(isUnlocked(progress, 1)).toBe(false);
  });

  it('opens the next level after a clear', () => {
    const progress = applyRun(emptyProgress(), win(0));
    expect(isUnlocked(progress, 1)).toBe(true);
    expect(isUnlocked(progress, 2)).toBe(false);
  });

  it('does not open anything on a loss', () => {
    const loss = buildResult({
      levelIndex: 0,
      outcome: 'overload',
      timeLeft: 10,
      stability: 0,
      chargesLeft: 0,
      amplifiersLit: 0,
      surges: 3,
      linked: 0,
      satellites: 2,
    });
    const progress = applyRun(emptyProgress(), loss);
    expect(isUnlocked(progress, 1)).toBe(false);
    expect(progress.history.length).toBe(1);
  });

  it('stores the best score and the best star count per level', () => {
    let progress = applyRun(emptyProgress(), win(0, 0, 60));
    const first = progress.bestScore['0'];
    progress = applyRun(progress, win(0, 2, 1));
    expect(progress.bestScore['0']).toBe(first);
    expect(progress.stars['0']).toBeGreaterThanOrEqual(1);
  });

  it('never unlocks past the last level', () => {
    let progress = emptyProgress();
    for (let i = 0; i < TOTAL_LEVELS; i++) {
      progress = applyRun(progress, win(i));
    }
    expect(progress.unlocked).toBe(TOTAL_LEVELS);
    expect(nextLevelIndex(progress, TOTAL_LEVELS - 1)).toBe(TOTAL_LEVELS - 1);
  });

  it('counts a clean run only when no surge fired', () => {
    const clean = applyRun(emptyProgress(), win(0, 0));
    const dirty = applyRun(emptyProgress(), win(0, 2));
    expect(clean.cleanRuns).toBe(1);
    expect(dirty.cleanRuns).toBe(0);
  });
});
