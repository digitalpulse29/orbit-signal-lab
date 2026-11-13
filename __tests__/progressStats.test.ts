import { STARS_TOTAL, TOTAL_LEVELS } from '../src/constants/config';
import {
  applyRun,
  clearedCount,
  emptyProgress,
  sectorCleared,
  totalStars,
} from '../src/game/progression';
import { buildResult } from '../src/game/scoring';
import type { Progress } from '../src/game/progression';

function run(progress: Progress, levelIndex: number, outcome: 'win' | 'overload') {
  return applyRun(
    progress,
    buildResult({
      levelIndex,
      outcome,
      timeLeft: outcome === 'win' ? 45 : 0,
      stability: outcome === 'win' ? 88 : 0,
      chargesLeft: outcome === 'win' ? 6 : 0,
      amplifiersLit: outcome === 'win' ? 2 : 0,
      surges: outcome === 'win' ? 0 : 3,
      linked: outcome === 'win' ? 2 : 1,
      satellites: 2,
    }),
  );
}

describe('progress statistics', () => {
  it('starts every counter at zero', () => {
    const progress = emptyProgress();
    expect(clearedCount(progress)).toBe(0);
    expect(totalStars(progress)).toBe(0);
    expect(progress.totalSignal).toBe(0);
    expect(progress.bestSignal).toBe(0);
    expect(progress.history.length).toBe(0);
  });

  it('counts only cleared levels', () => {
    let progress = run(emptyProgress(), 0, 'win');
    progress = run(progress, 1, 'overload');
    expect(clearedCount(progress)).toBe(1);
    expect(progress.history.length).toBe(2);
  });

  it('adds every run to the total signal but only the best to bestSignal', () => {
    let progress = run(emptyProgress(), 0, 'win');
    const first = progress.totalSignal;
    progress = run(progress, 1, 'overload');
    expect(progress.totalSignal).toBeGreaterThanOrEqual(first);
    expect(progress.bestSignal).toBe(first);
  });

  it('keeps the history newest first and caps it at 20 entries', () => {
    let progress = emptyProgress();
    for (let i = 0; i < 25; i++) {
      progress = run(progress, i % TOTAL_LEVELS, 'overload');
    }
    expect(progress.history.length).toBe(20);
    expect(progress.history[0].levelIndex).toBe(24 % TOTAL_LEVELS);
  });

  it('never exceeds the star ceiling', () => {
    let progress = emptyProgress();
    for (let i = 0; i < TOTAL_LEVELS; i++) {
      progress = run(progress, i, 'win');
    }
    expect(totalStars(progress)).toBeLessThanOrEqual(STARS_TOTAL);
    expect(clearedCount(progress)).toBe(TOTAL_LEVELS);
    expect(sectorCleared(progress, 3)).toBe(6);
  });
});
