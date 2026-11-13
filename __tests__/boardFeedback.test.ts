import { PRESS_FRICTION, PRESS_TENSION, ROTATE_TENSION } from '../src/constants/config';
import { startRotations } from '../src/game/levelGenerator';
import { rotateMask } from '../src/game/ports';
import { solveRouting } from '../src/game/routing';
import { generateLevel } from '../src/game/solver';

function signature(grid: ReturnType<typeof generateLevel>, rotations: number[]): string {
  const routing = solveRouting(grid, rotations);
  return (
    routing.energised.map(e => (e ? 1 : 0)).join('') +
    '|' +
    routing.edges.map(e => e.a + '-' + e.b).join(',')
  );
}

describe('board feedback', () => {
  it('redraws the beam in the same pass as the tap', () => {
    const grid = generateLevel(1);
    const before = startRotations(grid);
    let changed = 0;
    for (let id = 0; id < grid.cells.length; id++) {
      if (!grid.cells[id].rotatable || grid.cells[id].baseMask === 0) {
        continue;
      }
      const after = before.slice();
      after[id] = (after[id] + 1) % 4;
      if (signature(grid, after) !== signature(grid, before)) {
        changed += 1;
      }
    }
    expect(changed).toBeGreaterThan(0);
  });

  it('turning a node always remaps its ports unless it is symmetric', () => {
    const grid = generateLevel(2);
    grid.cells.forEach(cell => {
      if (cell.baseMask === 0 || cell.baseMask === 15) {
        return;
      }
      expect(rotateMask(cell.baseMask, 1)).not.toBe(cell.baseMask);
    });
  });

  it('four taps bring a node back to where it started', () => {
    const grid = generateLevel(4);
    const rotations = startRotations(grid);
    const target = grid.cells.find(c => c.rotatable);
    expect(target).toBeDefined();
    const id = (target as { id: number }).id;
    const after = rotations.slice();
    for (let i = 0; i < 4; i++) {
      after[id] = (after[id] + 1) % 4;
    }
    expect(signature(grid, after)).toBe(signature(grid, rotations));
  });

  it('uses one press spring across every control', () => {
    expect(PRESS_TENSION).toBe(220);
    expect(PRESS_FRICTION).toBe(12);
    expect(ROTATE_TENSION).toBe(150);
  });

  it('leaves fixed nodes untappable', () => {
    const grid = generateLevel(7);
    expect(grid.cells[grid.beaconId].rotatable).toBe(false);
    grid.satelliteIds.forEach(id => expect(grid.cells[id].rotatable).toBe(false));
    grid.hazardIds.forEach(id => expect(grid.cells[id].rotatable).toBe(false));
  });
});
