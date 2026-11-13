import { CONSTELLATIONS, FRAGMENTS_PER_CONSTELLATION } from '../src/constants/config';
import {
  applyRun,
  constellationStates,
  emptyProgress,
  sectorIndexOf,
  totalFragments,
} from '../src/game/progression';
import { buildResult } from '../src/game/scoring';
import type { Progress } from '../src/game/progression';

function clear(progress: Progress, levelIndex: number): Progress {
  return applyRun(
    progress,
    buildResult({
      levelIndex,
      outcome: 'win',
      timeLeft: 30,
      stability: 80,
      chargesLeft: 3,
      amplifiersLit: 0,
      surges: 0,
      linked: 2,
      satellites: 2,
    }),
  );
}

describe('constellation fragments', () => {
  it('starts with no fragments at all', () => {
    expect(totalFragments(emptyProgress())).toBe(0);
  });

  it('pays one fragment of the current sector per cleared level', () => {
    let progress = clear(emptyProgress(), 0);
    expect(progress.fragments[0]).toBe(1);
    progress = clear(progress, 1);
    expect(progress.fragments[0]).toBe(2);
    expect(progress.fragments[1]).toBe(0);
  });

  it('pays nothing for a lost run', () => {
    const progress = applyRun(
      emptyProgress(),
      buildResult({
        levelIndex: 0,
        outcome: 'timeout',
        timeLeft: 0,
        stability: 40,
        chargesLeft: 1,
        amplifiersLit: 0,
        surges: 0,
        linked: 1,
        satellites: 2,
      }),
    );
    expect(totalFragments(progress)).toBe(0);
  });

  it('unlocks a constellation card every three fragments of a sector', () => {
    let progress = emptyProgress();
    expect(constellationStates(progress).filter(c => c.unlocked).length).toBe(0);
    for (let i = 0; i < FRAGMENTS_PER_CONSTELLATION; i++) {
      progress = clear(progress, i);
    }
    const states = constellationStates(progress);
    expect(states[0].unlocked).toBe(true);
    expect(states[1].unlocked).toBe(false);
    expect(states[1].owned).toBe(0);
  });

  it('keeps eight cards, two per sector', () => {
    expect(CONSTELLATIONS.length).toBe(8);
    [0, 1, 2, 3].forEach(sector => {
      expect(CONSTELLATIONS.filter(c => c.sector === sector).length).toBe(2);
    });
    expect(sectorIndexOf(13)).toBe(2);
  });
});
