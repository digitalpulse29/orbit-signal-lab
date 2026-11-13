import { solutionRotations, startRotations } from '../src/game/levelGenerator';
import { allLinked, solveRouting } from '../src/game/routing';
import { generateLevel } from '../src/game/solver';

describe('energy routing', () => {
  it('lights every satellite in the solution state', () => {
    const grid = generateLevel(0);
    const routing = solveRouting(grid, solutionRotations(grid));
    expect(allLinked(grid, routing)).toBe(true);
    expect(routing.linked.length).toBe(grid.satelliteIds.length);
  });

  it('always energises the beacon and never debris', () => {
    const grid = generateLevel(3);
    const routing = solveRouting(grid, startRotations(grid));
    expect(routing.energised[grid.beaconId]).toBe(true);
    for (let i = 0; i < grid.hazardIds.length; i++) {
      expect(routing.energised[grid.hazardIds[i]]).toBe(false);
    }
  });

  it('needs both sides of an edge to expose a port', () => {
    const grid = generateLevel(1);
    const routing = solveRouting(grid, solutionRotations(grid));
    routing.edges.forEach(edge => {
      expect(routing.energised[edge.a]).toBe(true);
      expect(routing.energised[edge.b]).toBe(true);
    });
  });

  it('starts scrambled, so the plate is not already solved', () => {
    const grid = generateLevel(5);
    const routing = solveRouting(grid, startRotations(grid));
    expect(allLinked(grid, routing)).toBe(false);
  });
});
