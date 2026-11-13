import { CELL_COUNT, COLS, ROWS } from '../src/constants/config';
import { buildCandidate, seedFor, startRotations } from '../src/game/levelGenerator';
import { solveRouting } from '../src/game/routing';
import { generateLevel, isSolvable } from '../src/game/solver';

describe('seeded level generator', () => {
  it('derives a reproducible seed from level and attempt', () => {
    expect(seedFor(0, 0)).toBe(seedFor(0, 0));
    expect(seedFor(0, 0)).not.toBe(seedFor(0, 1));
    expect(seedFor(3, 2)).not.toBe(seedFor(4, 2));
  });

  it('builds the same plate twice from the same seed', () => {
    const a = buildCandidate(7, 0);
    const b = buildCandidate(7, 0);
    expect(a.cells.map(c => c.baseMask)).toEqual(b.cells.map(c => c.baseMask));
    expect(a.cells.map(c => c.startRotation)).toEqual(b.cells.map(c => c.startRotation));
  });

  it('fills the whole plate with exactly one beacon', () => {
    const grid = generateLevel(2);
    expect(grid.cells.length).toBe(CELL_COUNT);
    expect(grid.cols).toBe(COLS);
    expect(grid.rows).toBe(ROWS);
    expect(grid.cells.filter(c => c.kind === 'beacon').length).toBe(1);
  });

  it('proves every level solvable before showing it', () => {
    for (let level = 0; level < 24; level++) {
      const grid = generateLevel(level);
      expect(grid.fallback).toBe(false);
      expect(isSolvable(grid)).toBe(true);
    }
  });

  it('never starts a level already inside a debris surge', () => {
    for (let level = 0; level < 24; level++) {
      const grid = generateLevel(level);
      expect(solveRouting(grid, startRotations(grid)).breaches.length).toBe(0);
    }
  });

  it('makes two attempts at the same level look different', () => {
    const first = generateLevel(4, 0);
    const second = generateLevel(4, 1);
    const same =
      JSON.stringify(first.cells.map(c => c.kind)) ===
      JSON.stringify(second.cells.map(c => c.kind));
    expect(same).toBe(false);
  });

  it('keeps debris out of the solution route', () => {
    const grid = generateLevel(18);
    grid.hazardIds.forEach(id => {
      expect(grid.cells[id].kind).toBe('hazard');
      expect(grid.cells[id].rotatable).toBe(false);
    });
  });
});
