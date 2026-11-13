import {
  AMPLIFY_FREEZE_MS,
  LOADER_DURATION_MS,
  SIGNAL_WINDOWS,
  windowSeconds,
} from '../src/constants/config';
import { buildResult } from '../src/game/scoring';

describe('signal timer', () => {
  it('holds the loader for exactly 8000 ms', () => {
    expect(LOADER_DURATION_MS).toBe(8000);
  });

  it('offers three windows, all at least 60 seconds', () => {
    expect(SIGNAL_WINDOWS.length).toBe(3);
    SIGNAL_WINDOWS.forEach(w => expect(w.seconds).toBeGreaterThanOrEqual(60));
  });

  it('maps a window id to its length and falls back to the standard one', () => {
    expect(windowSeconds('calm')).toBe(95);
    expect(windowSeconds('standard')).toBe(80);
    expect(windowSeconds('expert')).toBe(65);
    expect(windowSeconds('nonsense' as never)).toBe(80);
  });

  it('ends the round as SIGNAL LOST when the window closes with dark satellites', () => {
    const run = buildResult({
      levelIndex: 0,
      outcome: 'timeout',
      timeLeft: 0,
      stability: 62,
      chargesLeft: 3,
      amplifiersLit: 0,
      surges: 1,
      linked: 1,
      satellites: 2,
    });
    expect(run.outcome).toBe('timeout');
    expect(run.stars).toBe(0);
    expect(run.timeLeft).toBe(0);
  });

  it('freezes the clock for five seconds per amplifier charge', () => {
    expect(AMPLIFY_FREEZE_MS).toBe(5000);
  });
});
