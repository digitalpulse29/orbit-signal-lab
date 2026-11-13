import { applyRun, emptyProgress } from '../src/game/progression';
import { buildResult } from '../src/game/scoring';
import { __setBackend, loadProgress, resetProgress, saveProgress } from '../src/game/storage';

function fakeBackend(seed?: Record<string, string>) {
  const map: Record<string, string> = seed || {};
  return {
    get: (key: string) => (key in map ? map[key] : null),
    set: (key: string, value: string) => {
      map[key] = value;
    },
    remove: (key: string) => {
      delete map[key];
    },
    map,
  };
}

describe('local persistence', () => {
  it('returns a fresh profile when nothing is stored', () => {
    __setBackend(fakeBackend());
    const progress = loadProgress();
    expect(progress.unlocked).toBe(1);
    expect(progress.totalSignal).toBe(0);
  });

  it('round-trips a full profile', () => {
    __setBackend(fakeBackend());
    const progress = applyRun(
      emptyProgress(),
      buildResult({
        levelIndex: 2,
        outcome: 'win',
        timeLeft: 33,
        stability: 71,
        chargesLeft: 4,
        amplifiersLit: 1,
        surges: 0,
        linked: 2,
        satellites: 2,
      }),
    );
    saveProgress(progress);

    const loaded = loadProgress();
    expect(loaded.unlocked).toBe(progress.unlocked);
    expect(loaded.bestScore['2']).toBe(progress.bestScore['2']);
    expect(loaded.fragments).toEqual(progress.fragments);
    expect(loaded.history.length).toBe(1);
  });

  it('survives a corrupted record instead of crashing', () => {
    __setBackend(fakeBackend({ 'orbit-signal-lab/progress/v1': '{not json' }));
    const progress = loadProgress();
    expect(progress.unlocked).toBe(1);
    expect(progress.history).toEqual([]);
  });

  it('fills missing fields of an older record from the defaults', () => {
    __setBackend(fakeBackend({ 'orbit-signal-lab/progress/v1': '{"unlocked":5}' }));
    const progress = loadProgress();
    expect(progress.unlocked).toBe(5);
    expect(progress.fragments).toEqual([0, 0, 0, 0]);
    expect(progress.settings.beamPalette).toBe('cosmic');
  });

  it('never throws when the backend fails', () => {
    __setBackend({
      get: () => {
        throw new Error('backend down');
      },
      set: () => {
        throw new Error('backend down');
      },
      remove: () => {
        throw new Error('backend down');
      },
    });
    expect(() => loadProgress()).not.toThrow();
    expect(() => saveProgress(emptyProgress())).not.toThrow();
    expect(() => resetProgress()).not.toThrow();
  });

  it('makes no network call of any kind', () => {
    const source = require('fs').readFileSync(
      require('path').join(__dirname, '..', 'src', 'game', 'storage.ts'),
      'utf8',
    );
    expect(source).not.toMatch(/fetch\(|XMLHttpRequest|https?:\/\//);
  });
});
