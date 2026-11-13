import { FLARE_DURATION_MS, FLARE_INTERVAL_MS } from '../src/constants/config';
import { advanceFlare, initialFlare } from '../src/game/hazards';
import { generateLevel } from '../src/game/solver';

describe('flare pulse', () => {
  it('starts idle and waits a full interval', () => {
    const state = initialFlare();
    expect(state.activeId).toBe(-1);
    expect(state.nextInMs).toBe(FLARE_INTERVAL_MS);
  });

  it('ignites one debris cell after the interval', () => {
    const grid = generateLevel(16);
    let state = initialFlare();
    let ignited = -1;
    for (let ms = 0; ms < FLARE_INTERVAL_MS + 200; ms += 100) {
      const step = advanceFlare(grid, state, 100);
      state = step.next;
      if (step.ignited >= 0) {
        ignited = step.ignited;
        break;
      }
    }
    expect(grid.hazardIds).toContain(ignited);
    expect(state.activeId).toBe(ignited);
    expect(state.msLeft).toBe(FLARE_DURATION_MS);
  });

  it('burns out after four seconds and rearms', () => {
    const grid = generateLevel(16);
    let state = initialFlare();
    for (let ms = 0; ms < FLARE_INTERVAL_MS + FLARE_DURATION_MS + 400; ms += 100) {
      state = advanceFlare(grid, state, 100).next;
    }
    expect(state.activeId).toBe(-1);
    expect(state.nextInMs).toBeLessThanOrEqual(FLARE_INTERVAL_MS);
  });

  it('walks the debris field instead of flaring the same cell forever', () => {
    const grid = generateLevel(22);
    const seen: number[] = [];
    let state = initialFlare();
    for (let ms = 0; ms < (FLARE_INTERVAL_MS + FLARE_DURATION_MS) * 3; ms += 100) {
      const step = advanceFlare(grid, state, 100);
      state = step.next;
      if (step.ignited >= 0) {
        seen.push(step.ignited);
      }
    }
    expect(seen.length).toBeGreaterThanOrEqual(2);
    if (grid.hazardIds.length > 1) {
      expect(seen[0]).not.toBe(seen[1]);
    }
  });

  it('does nothing on a plate without debris', () => {
    const grid = generateLevel(0);
    const empty = { ...grid, hazardIds: [] };
    const step = advanceFlare(empty, initialFlare(), 100000);
    expect(step.ignited).toBe(-1);
    expect(step.next.activeId).toBe(-1);
  });
});
