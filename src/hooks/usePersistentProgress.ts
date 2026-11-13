import { useCallback, useState } from 'react';
import { applyRun, type Progress, type Settings } from '../game/progression';
import { loadProgress, resetProgress, saveProgress } from '../game/storage';
import type { RunResult } from '../game/types';

/** Single owner of the stored lab data. Screens receive slices, never the setter. */
export function usePersistentProgress() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  const commitRun = useCallback((run: RunResult) => {
    setProgress(prev => {
      const next = applyRun(prev, run);
      saveProgress(next);
      return next;
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setProgress(prev => {
      const next = { ...prev, settings: { ...prev.settings, ...patch } };
      saveProgress(next);
      return next;
    });
  }, []);

  const wipe = useCallback(() => {
    setProgress(resetProgress());
  }, []);

  return { progress, commitRun, updateSettings, wipe };
}
