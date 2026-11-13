import { FRAGMENTS_PER_CONSTELLATION } from '../src/constants/config';
import { applyRun, constellationStates, emptyProgress } from '../src/game/progression';
import { buildResult } from '../src/game/scoring';
import type { Progress } from '../src/game/progression';

function clear(progress: Progress, levelIndex: number): Progress {
  return applyRun(
    progress,
    buildResult({
      levelIndex,
      outcome: 'win',
      timeLeft: 25,
      stability: 75,
      chargesLeft: 2,
      amplifiersLit: 1,
      surges: 0,
      linked: 2,
      satellites: 2,
    }),
  );
}

describe('collection screen data', () => {
  it('always returns eight cards with a name and a flavour line', () => {
    const cards = constellationStates(emptyProgress());
    expect(cards.length).toBe(8);
    cards.forEach(card => {
      expect(card.name.length).toBeGreaterThan(3);
      expect(card.flavour).toContain('SECTOR');
      expect(card.name).not.toMatch(/item \d/i);
    });
  });

  it('shows zero owned fragments before the first clear', () => {
    constellationStates(emptyProgress()).forEach(card => {
      expect(card.owned).toBe(0);
      expect(card.unlocked).toBe(false);
    });
  });

  it('never reports more fragments than a card needs', () => {
    let progress = emptyProgress();
    for (let i = 0; i < 6; i++) {
      progress = clear(progress, i);
    }
    constellationStates(progress).forEach(card => {
      expect(card.owned).toBeLessThanOrEqual(FRAGMENTS_PER_CONSTELLATION);
      expect(card.owned).toBeGreaterThanOrEqual(0);
    });
  });

  it('fills the second card of a sector only after the first one is complete', () => {
    let progress = emptyProgress();
    for (let i = 0; i < 4; i++) {
      progress = clear(progress, i);
    }
    const alpha = constellationStates(progress).filter(c => c.sector === 0);
    expect(alpha[0].unlocked).toBe(true);
    expect(alpha[1].owned).toBe(1);
    expect(alpha[1].unlocked).toBe(false);
  });

  it('records a clear date that the expanded card can show', () => {
    const progress = clear(emptyProgress(), 0);
    expect(typeof progress.clearedAt['0']).toBe('number');
    expect(progress.clearedAt['0']).toBeGreaterThan(0);
    expect(progress.bestScore['0']).toBeGreaterThan(0);
  });
});
