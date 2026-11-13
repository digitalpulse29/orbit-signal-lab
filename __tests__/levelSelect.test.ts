import { LEVELS_PER_SECTOR, SECTOR_COUNT, TOTAL_LEVELS } from '../src/constants/config';
import { SECTORS, levelLabel, sectorOf } from '../src/constants/levels';
import { applyRun, emptyProgress, isUnlocked, sectorCleared } from '../src/game/progression';
import { buildResult } from '../src/game/scoring';

describe('level select', () => {
  it('splits 24 levels into 4 sectors of 6', () => {
    expect(TOTAL_LEVELS).toBe(SECTOR_COUNT * LEVELS_PER_SECTOR);
    expect(SECTORS.length).toBe(SECTOR_COUNT);
    expect(SECTORS.map(s => s.name)).toEqual(['ALPHA', 'BETA', 'GAMMA', 'DELTA']);
  });

  it('maps a level index onto its sector', () => {
    expect(sectorOf(0).name).toBe('ALPHA');
    expect(sectorOf(5).name).toBe('ALPHA');
    expect(sectorOf(6).name).toBe('BETA');
    expect(sectorOf(23).name).toBe('DELTA');
    expect(sectorOf(999).name).toBe('DELTA');
  });

  it('labels a level with its sector and its number inside it', () => {
    expect(levelLabel(0)).toContain('ALPHA');
    expect(levelLabel(0)).toContain('LEVEL 1');
    expect(levelLabel(7)).toContain('BETA');
    expect(levelLabel(7)).toContain('LEVEL 2');
  });

  it('gets harder sector by sector', () => {
    for (let i = 1; i < SECTORS.length; i++) {
      expect(SECTORS[i].hazards).toBeGreaterThan(SECTORS[i - 1].hazards);
      expect(SECTORS[i].satellites).toBeGreaterThanOrEqual(SECTORS[i - 1].satellites);
    }
  });

  it('reports how much of a sector is routed', () => {
    let progress = emptyProgress();
    expect(sectorCleared(progress, 0)).toBe(0);
    progress = applyRun(
      progress,
      buildResult({
        levelIndex: 0,
        outcome: 'win',
        timeLeft: 20,
        stability: 70,
        chargesLeft: 2,
        amplifiersLit: 0,
        surges: 0,
        linked: 2,
        satellites: 2,
      }),
    );
    expect(sectorCleared(progress, 0)).toBe(1);
    expect(sectorCleared(progress, 1)).toBe(0);
    expect(isUnlocked(progress, 1)).toBe(true);
  });
});
