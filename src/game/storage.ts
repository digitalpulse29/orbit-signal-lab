import { emptyProgress, type Progress } from './progression';

/**
 * Single persistence adapter. The whole game talks to THIS module only, so the
 * unit tests never touch a native module and the storage backend can be
 * swapped without touching gameplay code.
 *
 * The approved dependency list carries no storage module, so the backend is a
 * module-scoped store that survives every screen change, remount and replay
 * inside the app session. Writes are fire-and-forget and can never throw into
 * the render path.
 */

const KEY = 'orbit-signal-lab/progress/v1';

type Backend = {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

function memoryBackend(): Backend {
  const map: Record<string, string> = {};
  return {
    get: key => (Object.prototype.hasOwnProperty.call(map, key) ? map[key] : null),
    set: (key, value) => {
      map[key] = value;
    },
    remove: key => {
      delete map[key];
    },
  };
}

let backend: Backend = memoryBackend();

/** Test seam: lets the unit tests install a fake backend. */
export function __setBackend(next: Backend): void {
  backend = next;
}

export function loadProgress(): Progress {
  try {
    const raw = backend.get(KEY);
    if (!raw) {
      return emptyProgress();
    }
    const parsed = JSON.parse(raw);
    const base = emptyProgress();
    return {
      ...base,
      ...parsed,
      fragments: Array.isArray(parsed.fragments) ? parsed.fragments : base.fragments,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      settings: { ...base.settings, ...(parsed.settings || {}) },
    };
  } catch (err) {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress): void {
  try {
    backend.set(KEY, JSON.stringify(progress));
  } catch (err) {
    // never let persistence break a frame
  }
}

export function resetProgress(): Progress {
  try {
    backend.remove(KEY);
  } catch (err) {
    // ignore
  }
  const fresh = emptyProgress();
  saveProgress(fresh);
  return fresh;
}
