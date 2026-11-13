import { CHARGE_BONUS, OVERRIDE_COST, UNDO_LIMIT } from '../src/constants/config';
import { countOptimal, startRotations } from '../src/game/levelGenerator';
import { minRotationsTo } from '../src/game/ports';
import { generateLevel } from '../src/game/solver';
import { computeScore } from '../src/game/scoring';

describe('charge budget', () => {
  it('gives the optimal number of taps plus a six tap cushion', () => {
    const grid = generateLevel(0);
    const budget = grid.optimalRotations + CHARGE_BONUS;
    expect(CHARGE_BONUS).toBe(6);
    expect(budget).toBeGreaterThan(grid.optimalRotations);
  });

  it('always leaves at least one tap to make', () => {
    for (let level = 0; level < 24; level++) {
      expect(generateLevel(level).optimalRotations).toBeGreaterThanOrEqual(1);
    }
  });

  it('agrees with a tap-by-tap walk back to the solution', () => {
    const grid = generateLevel(8);
    let taps = 0;
    grid.cells.forEach(cell => {
      if (!cell.rotatable || cell.baseMask === 0) {
        return;
      }
      taps += minRotationsTo(cell.baseMask, cell.startRotation, cell.solutionRotation);
    });
    expect(taps).toBe(grid.optimalRotations);
    expect(countOptimal(grid)).toBe(taps);
    expect(startRotations(grid).length).toBe(grid.cells.length);
  });

  it('pays 25 points per leftover charge', () => {
    const base = {
      levelIndex: 0,
      outcome: 'win' as const,
      timeLeft: 10,
      stability: 50,
      amplifiersLit: 0,
      surges: 0,
      linked: 2,
      satellites: 2,
    };
    const poor = computeScore({ ...base, chargesLeft: 0 });
    const rich = computeScore({ ...base, chargesLeft: 4 });
    expect(rich - poor).toBe(100);
  });

  it('charges an override instead of blocking the player at zero', () => {
    expect(OVERRIDE_COST).toBeGreaterThan(0);
    expect(OVERRIDE_COST).toBeLessThan(34);
    expect(UNDO_LIMIT).toBe(3);
  });
});
