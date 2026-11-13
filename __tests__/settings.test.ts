import { DEFAULT_WINDOW, SIGNAL_WINDOWS, windowSeconds } from '../src/constants/config';
import { beamColors } from '../src/constants/theme';
import { applyRun, emptyProgress } from '../src/game/progression';
import { buildResult } from '../src/game/scoring';
import { __setBackend, loadProgress, resetProgress, saveProgress } from '../src/game/storage';

function fakeBackend() {
  const map: Record<string, string> = {};
  return {
    get: (key: string) => (key in map ? map[key] : null),
    set: (key: string, value: string) => {
      map[key] = value;
    },
    remove: (key: string) => {
      delete map[key];
    },
  };
}

describe('settings', () => {
  beforeEach(() => {
    __setBackend(fakeBackend());
  });

  it('defaults to the standard window, cosmic beam, guides on, motion on', () => {
    const settings = emptyProgress().settings;
    expect(settings.signalWindow).toBe(DEFAULT_WINDOW);
    expect(settings.beamPalette).toBe('cosmic');
    expect(settings.showGuides).toBe(true);
    expect(settings.reducedMotion).toBe(false);
  });

  it('changes the real round length when the window changes', () => {
    const lengths = SIGNAL_WINDOWS.map(w => windowSeconds(w.id as never));
    expect(new Set(lengths).size).toBe(3);
    expect(windowSeconds('expert')).toBeLessThan(windowSeconds('calm'));
  });

  it('repaints the beam when the palette changes', () => {
    const cosmic = beamColors('cosmic');
    const contrast = beamColors('contrast');
    expect(cosmic.beam).not.toBe(contrast.beam);
    expect(cosmic.port).not.toBe(contrast.port);
  });

  it('persists a changed setting through the storage adapter', () => {
    const progress = emptyProgress();
    progress.settings.signalWindow = 'expert';
    progress.settings.reducedMotion = true;
    saveProgress(progress);
    const loaded = loadProgress();
    expect(loaded.settings.signalWindow).toBe('expert');
    expect(loaded.settings.reducedMotion).toBe(true);
  });

  it('wipes progress, stars, fragments and history on reset', () => {
    let progress = applyRun(
      emptyProgress(),
      buildResult({
        levelIndex: 0,
        outcome: 'win',
        timeLeft: 20,
        stability: 60,
        chargesLeft: 1,
        amplifiersLit: 0,
        surges: 0,
        linked: 2,
        satellites: 2,
      }),
    );
    saveProgress(progress);
    progress = resetProgress();
    expect(progress.unlocked).toBe(1);
    expect(progress.history.length).toBe(0);
    expect(progress.fragments).toEqual([0, 0, 0, 0]);
    expect(loadProgress().totalSignal).toBe(0);
  });
});
