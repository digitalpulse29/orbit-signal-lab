import { DIRS, opposite, rotateMask } from './ports';
import type { BeamEdge, Grid, Routing } from './types';

/**
 * Flood fill from the beacon. A link exists only when BOTH touching nodes
 * expose a port on the shared edge, and debris never carries the beam.
 */
export function solveRouting(grid: Grid, rotations: number[]): Routing {
  const { cols, rows, cells } = grid;
  const energised = new Array<boolean>(cells.length).fill(false);
  const edges: BeamEdge[] = [];
  const linked: number[] = [];
  const breaches: number[] = [];

  const maskOf = (id: number) => {
    const cell = cells[id];
    if (cell.kind === 'hazard') {
      return 0;
    }
    return rotateMask(cell.baseMask, rotations[id] || 0);
  };

  const queue: number[] = [grid.beaconId];
  energised[grid.beaconId] = true;

  while (queue.length > 0) {
    const id = queue.shift() as number;
    const cell = cells[id];
    const mask = maskOf(id);
    for (let d = 0; d < DIRS.length; d++) {
      const dir = DIRS[d];
      if ((mask & dir.bit) === 0) {
        continue;
      }
      const nr = cell.row + dir.dr;
      const nc = cell.col + dir.dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
        continue;
      }
      const nid = nr * cols + nc;
      if (cells[nid].kind === 'hazard') {
        if (breaches.indexOf(id) === -1) {
          breaches.push(id);
        }
        continue;
      }
      if ((maskOf(nid) & opposite(dir.bit)) === 0) {
        continue;
      }
      if (id < nid) {
        edges.push({ a: id, b: nid });
      }
      if (!energised[nid]) {
        energised[nid] = true;
        queue.push(nid);
      }
    }
  }

  for (let i = 0; i < grid.satelliteIds.length; i++) {
    const sid = grid.satelliteIds[i];
    if (energised[sid]) {
      linked.push(sid);
    }
  }

  return { energised, edges, linked, breaches };
}

export function allLinked(grid: Grid, routing: Routing): boolean {
  return grid.satelliteIds.length > 0 && routing.linked.length === grid.satelliteIds.length;
}

export function litAmplifiers(grid: Grid, routing: Routing): number[] {
  return grid.amplifierIds.filter(id => routing.energised[id]);
}

/** Cells adjacent to a flaring debris cell - a live beam there fires a surge. */
export function flareBreaches(grid: Grid, routing: Routing, flaringId: number): number[] {
  const hit: number[] = [];
  const hazard = grid.cells[flaringId];
  if (!hazard) {
    return hit;
  }
  for (let d = 0; d < DIRS.length; d++) {
    const nr = hazard.row + DIRS[d].dr;
    const nc = hazard.col + DIRS[d].dc;
    if (nr < 0 || nc < 0 || nr >= grid.rows || nc >= grid.cols) {
      continue;
    }
    const nid = nr * grid.cols + nc;
    if (routing.energised[nid]) {
      hit.push(nid);
    }
  }
  return hit;
}
