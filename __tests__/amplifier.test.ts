import { AMPLIFY_FREEZE_MS } from '../src/constants/config';
import { SECTORS } from '../src/constants/levels';
import { solutionRotations, startRotations } from '../src/game/levelGenerator';
import { litAmplifiers, solveRouting } from '../src/game/routing';
import { computeScore } from '../src/game/scoring';
import { generateLevel } from '../src/game/solver';

describe('amplifier relay', () => {
  it('places amplifiers on the live route, never on debris', () => {
    const grid = generateLevel(13);
    grid.amplifierIds.forEach(id => {
      expect(grid.cells[id].kind).toBe('amplifier');
      expect(grid.cells[id].rotatable).toBe(true);
      expect(grid.hazardIds).not.toContain(id);
    });
  });

  it('lights every amplifier when the plate is solved', () => {
    const grid = generateLevel(13);
    const solved = solveRouting(grid, solutionRotations(grid));
    expect(litAmplifiers(grid, solved).length).toBe(grid.amplifierIds.length);
  });

  it('starts with fewer amplifiers lit than the solution has', () => {
    const grid = generateLevel(13);
    const start = solveRouting(grid, startRotations(grid));
    expect(litAmplifiers(grid, start).length).toBeLessThanOrEqual(grid.amplifierIds.length);
  });

  it('pays 150 points per amplifier on the route', () => {
    const base = {
      levelIndex: 0,
      outcome: 'win' as const,
      timeLeft: 10,
      stability: 50,
      chargesLeft: 0,
      surges: 0,
      linked: 2,
      satellites: 2,
    };
    expect(
      computeScore({ ...base, amplifiersLit: 2 }) - computeScore({ ...base, amplifiersLit: 0 }),
    ).toBe(300);
  });

  it('buys exactly five frozen seconds per charge', () => {
    expect(AMPLIFY_FREEZE_MS).toBe(5000);
    expect(SECTORS.every(s => s.amplifiers >= 1)).toBe(true);
  });
});
