import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AMPLIFY_FREEZE_MS,
  CHARGE_BONUS,
  GO_FAIL_COST,
  OVERRIDE_COST,
  STABILITY_START,
  SURGE_COST,
  SURGE_REVERT_MS,
  UNDO_LIMIT,
} from '../constants/config';
import { advanceFlare, initialFlare, type FlareState } from '../game/hazards';
import { startRotations } from '../game/levelGenerator';
import { allLinked, flareBreaches, litAmplifiers, solveRouting } from '../game/routing';
import { buildResult } from '../game/scoring';
import { generateLevel } from '../game/solver';
import type { Outcome, RunResult } from '../game/types';

const TICK_MS = 100;

export interface UseOrbitBoardOptions {
  levelIndex: number;
  /** attempt counter - shifts the generator seed so a retry looks different */
  attempt: number;
  seconds: number;
  onFinish: (run: RunResult) => void;
}

/**
 * Owns one round: the plate, the signal clock, the flare schedule and every
 * resource. Every timer is started from an effect and cleared on unmount, and
 * every callback reads live data from refs instead of a stale closure.
 */
export function useOrbitBoard(options: UseOrbitBoardOptions) {
  const { levelIndex, attempt, seconds, onFinish } = options;

  const grid = useMemo(() => generateLevel(levelIndex, attempt), [attempt, levelIndex]);
  const budget = grid.optimalRotations + CHARGE_BONUS;

  const [rotations, setRotations] = useState<number[]>(() => startRotations(grid));
  const [charges, setCharges] = useState(budget);
  const [undosLeft, setUndosLeft] = useState(UNDO_LIMIT);
  const [stability, setStability] = useState(STABILITY_START);
  const [surges, setSurges] = useState(0);
  const [ampCharges, setAmpCharges] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [surgeNonce, setSurgeNonce] = useState(0);
  const [flare, setFlare] = useState<FlareState>(() => initialFlare());
  const [over, setOver] = useState(false);

  const rotationsRef = useRef(rotations);
  rotationsRef.current = rotations;
  const stabilityRef = useRef(stability);
  stabilityRef.current = stability;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const overRef = useRef(over);
  overRef.current = over;
  const flareRef = useRef(flare);
  flareRef.current = flare;

  const remainingMsRef = useRef(seconds * 1000);
  const freezeUntilRef = useRef(0);
  const undoStackRef = useRef<number[]>([]);
  const collectedAmpsRef = useRef<number[]>([]);
  const surgesRef = useRef(0);
  const chargesRef = useRef(budget);
  chargesRef.current = charges;
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const finishedRef = useRef(false);

  const routing = useMemo(() => solveRouting(grid, rotations), [grid, rotations]);
  const linkedCount = routing.linked.length;
  const solved = allLinked(grid, routing);

  const finish = useCallback(
    (outcome: Outcome) => {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      setOver(true);
      overRef.current = true;
      const current = solveRouting(grid, rotationsRef.current);
      const run = buildResult({
        levelIndex,
        outcome,
        timeLeft: Math.max(0, remainingMsRef.current / 1000),
        stability: Math.max(0, stabilityRef.current),
        chargesLeft: Math.max(0, chargesRef.current),
        amplifiersLit: collectedAmpsRef.current.length,
        surges: surgesRef.current,
        linked: current.linked.length,
        satellites: grid.satelliteIds.length,
      });
      onFinish(run);
    },
    [grid, levelIndex, onFinish],
  );

  const spendStability = useCallback(
    (cost: number) => {
      const next = Math.max(0, stabilityRef.current - cost);
      stabilityRef.current = next;
      setStability(next);
      if (next <= 0) {
        finish('overload');
      }
      return next;
    },
    [finish],
  );

  const fireSurge = useCallback(
    (offenders: number[]) => {
      surgesRef.current += 1;
      setSurges(surgesRef.current);
      setSurgeNonce(n => n + 1);
      const target = offenders.length > 0 ? offenders[0] : -1;
      if (target >= 0 && grid.cells[target].rotatable) {
        const t = setTimeout(() => {
          setRotations(prev => {
            const next = prev.slice();
            next[target] = (next[target] + 3) % 4;
            rotationsRef.current = next;
            return next;
          });
        }, SURGE_REVERT_MS);
        timeoutsRef.current.push(t);
      }
      spendStability(SURGE_COST);
    },
    [grid, spendStability],
  );

  const collectAmplifiers = useCallback(
    (nextRotations: number[]) => {
      const lit = litAmplifiers(grid, solveRouting(grid, nextRotations));
      let gained = 0;
      for (let i = 0; i < lit.length; i++) {
        if (collectedAmpsRef.current.indexOf(lit[i]) === -1) {
          collectedAmpsRef.current.push(lit[i]);
          gained += 1;
        }
      }
      if (gained > 0) {
        setAmpCharges(c => c + gained);
      }
    },
    [grid],
  );

  const rotate = useCallback(
    (id: number) => {
      if (overRef.current || pausedRef.current) {
        return;
      }
      const cell = grid.cells[id];
      if (!cell || !cell.rotatable) {
        return;
      }
      const next = rotationsRef.current.slice();
      next[id] = (next[id] + 1) % 4;
      rotationsRef.current = next;
      undoStackRef.current.push(id);
      setRotations(next);

      if (chargesRef.current > 0) {
        chargesRef.current -= 1;
        setCharges(chargesRef.current);
      } else {
        spendStability(OVERRIDE_COST);
      }

      collectAmplifiers(next);

      const result = solveRouting(grid, next);
      if (result.breaches.length > 0) {
        fireSurge(result.breaches.indexOf(id) >= 0 ? [id] : result.breaches);
      }
    },
    [collectAmplifiers, fireSurge, grid, spendStability],
  );

  const undo = useCallback(() => {
    if (overRef.current || pausedRef.current || undosLeft <= 0) {
      return;
    }
    const id = undoStackRef.current.pop();
    if (id === undefined) {
      return;
    }
    const next = rotationsRef.current.slice();
    next[id] = (next[id] + 3) % 4;
    rotationsRef.current = next;
    setRotations(next);
    setUndosLeft(n => Math.max(0, n - 1));
    chargesRef.current += 1;
    setCharges(chargesRef.current);
  }, [undosLeft]);

  const go = useCallback(() => {
    if (overRef.current || pausedRef.current) {
      return;
    }
    const result = solveRouting(grid, rotationsRef.current);
    if (allLinked(grid, result)) {
      finish('win');
      return;
    }
    spendStability(GO_FAIL_COST);
  }, [finish, grid, spendStability]);

  const amplify = useCallback(() => {
    if (overRef.current || pausedRef.current || ampCharges <= 0) {
      return;
    }
    setAmpCharges(c => Math.max(0, c - 1));
    freezeUntilRef.current = Date.now() + AMPLIFY_FREEZE_MS;
    setFrozen(true);
  }, [ampCharges]);

  // one clock drives the countdown, the freeze window and the flare schedule
  useEffect(() => {
    const interval = setInterval(() => {
      if (overRef.current || pausedRef.current) {
        return;
      }
      const isFrozen = Date.now() < freezeUntilRef.current;
      if (!isFrozen) {
        remainingMsRef.current = Math.max(0, remainingMsRef.current - TICK_MS);
      }
      setFrozen(prev => (prev === isFrozen ? prev : isFrozen));

      const whole = Math.ceil(remainingMsRef.current / 1000);
      setSecondsLeft(prev => (prev === whole ? prev : whole));

      const step = advanceFlare(grid, flareRef.current, TICK_MS);
      if (step.next !== flareRef.current) {
        flareRef.current = step.next;
        setFlare(step.next);
      }
      if (step.ignited >= 0) {
        const current = solveRouting(grid, rotationsRef.current);
        const hit = flareBreaches(grid, current, step.ignited);
        if (hit.length > 0) {
          fireSurge(hit);
        }
      }

      if (remainingMsRef.current <= 0) {
        finish('timeout');
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [finish, fireSurge, grid]);

  useEffect(() => {
    const pending = timeoutsRef.current;
    return () => {
      for (let i = 0; i < pending.length; i++) {
        clearTimeout(pending[i]);
      }
      pending.length = 0;
    };
  }, []);

  return {
    grid,
    rotations,
    routing,
    linkedCount,
    solved,
    charges,
    budget,
    undosLeft,
    stability,
    surges,
    ampCharges,
    secondsLeft,
    totalSeconds: seconds,
    paused,
    frozen,
    surgeNonce,
    flaringId: flare.activeId,
    over,
    rotate,
    undo,
    go,
    amplify,
    setPaused,
  };
}
