import { SURGE_COST } from '../src/constants/config';
import { advanceFlare, applySurge, initialFlare } from '../src/game/hazards';
import { startRotations } from '../src/game/levelGenerator';
import { E, N, S, W, rotateMask } from '../src/game/ports';
import { flareBreaches, solveRouting } from '../src/game/routing';
import { generateLevel } from '../src/game/solver';
import type { Grid, NodeCell, NodeKind } from '../src/game/types';

/**
 * 2x2 test plate:
 *   (0,0) beacon   (0,1) relay
 *   (1,0) debris   (1,1) satellite
 */
function tinyGrid(beaconMask: number): Grid {
  const spec: Array<[NodeKind, number, boolean]> = [
    ['beacon', beaconMask, false],
    ['relay', W | S, true],
    ['hazard', 0, false],
    ['satellite', N, false],
  ];
  const cells: NodeCell[] = spec.map((entry, id) => ({
    id,
    row: Math.floor(id / 2),
    col: id % 2,
    kind: entry[0],
    baseMask: entry[1],
    solutionRotation: 0,
    startRotation: 0,
    rotatable: entry[2],
  }));
  return {
    cols: 2,
    rows: 2,
    cells,
    beaconId: 0,
    satelliteIds: [3],
    hazardIds: [2],
    amplifierIds: [],
    optimalRotations: 1,
    seed: 1,
    levelIndex: 0,
    fallback: false,
  };
}

describe('debris surge', () => {
  it('reports a breach when a live port faces debris', () => {
    const routing = solveRouting(tinyGrid(E | S), [0, 0, 0, 0]);
    expect(routing.breaches).toContain(0);
    expect(routing.energised[2]).toBe(false);
  });

  it('reports no breach when every live port faces an open node', () => {
    const routing = solveRouting(tinyGrid(E), [0, 0, 0, 0]);
    expect(routing.breaches.length).toBe(0);
    expect(routing.energised[1]).toBe(true);
    expect(routing.energised[3]).toBe(true);
  });

  it('a debris cell exposes no ports in any orientation', () => {
    const grid = generateLevel(20);
    grid.hazardIds.forEach(id => {
      for (let r = 0; r < 4; r++) {
        expect(rotateMask(grid.cells[id].baseMask, r)).toBe(0);
      }
    });
  });

  it('never energises a debris cell on a generated plate', () => {
    const grid = generateLevel(15);
    const routing = solveRouting(grid, startRotations(grid));
    grid.hazardIds.forEach(id => expect(routing.energised[id]).toBe(false));
  });

  it('costs 34 stability and floors at zero', () => {
    expect(applySurge(100)).toBe(100 - SURGE_COST);
    expect(applySurge(10)).toBe(0);
  });

  it('a flare catches every live neighbour of the flaring cell', () => {
    const grid = tinyGrid(E);
    const routing = solveRouting(grid, [0, 0, 0, 0]);
    const hit = flareBreaches(grid, routing, 2);
    expect(hit).toContain(3);
    expect(hit).toContain(0);
    expect(hit).not.toContain(1);
    expect(advanceFlare(grid, initialFlare(), 10).ignited).toBe(-1);
  });
});
