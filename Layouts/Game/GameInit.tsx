/* @app-slot:anchor */
/**
 * ORBIT SIGNAL LAB
 * One state machine owns the current screen - no navigation library.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { SCREEN_FADE_MS, THEME, TOTAL_LEVELS } from './AppResources';
import { nextLevelIndex } from './GameLogic';
import type { RunResult } from './GameLogic';
import { usePersistentProgress } from './AppUI';
import { CollectionScreen, GameScreen, LevelSelectScreen, LoaderScreen, MenuScreen, ProgressScreen, ResultScreen, SettingsScreen } from './AppScreens';

type Screen =
  | 'loader'
  | 'menu'
  | 'levels'
  | 'game'
  | 'result'
  | 'collection'
  | 'progress'
  | 'settings';

export default function App() {
  const { progress, commitRun, updateSettings, wipe } = usePersistentProgress();
  const [screen, setScreen] = useState<Screen>('loader');
  const [levelIndex, setLevelIndex] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [lastRun, setLastRun] = useState<RunResult | null>(null);

  const fade = useRef(new Animated.Value(1)).current;

  const go = useCallback(
    (next: Screen) => {
      setScreen(next);
      fade.setValue(0);
      Animated.timing(fade, {
        toValue: 1,
        duration: SCREEN_FADE_MS,
        useNativeDriver: true,
      }).start();
    },
    [fade],
  );

  const startLevel = useCallback(
    (index: number) => {
      setLevelIndex(Math.max(0, Math.min(TOTAL_LEVELS - 1, index)));
      setRunKey(k => k + 1);
      go('game');
    },
    [go],
  );

  const handleGameOver = useCallback(
    (run: RunResult) => {
      setLastRun(run);
      commitRun(run);
      go('result');
    },
    [commitRun, go],
  );

  // system Back: forward screens return to Menu, Menu closes the app
  useEffect(() => {
    const onBack = () => {
      if (screen === 'loader') {
        return true;
      }
      if (screen === 'menu') {
        return false;
      }
      go('menu');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [go, screen]);

  const currentLevel = Math.min(progress.unlocked - 1, TOTAL_LEVELS - 1);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {/* box-none: the fade wrapper must never swallow a tap meant for a screen */}
      <Animated.View pointerEvents="box-none" style={[styles.layer, { opacity: fade }]}>
        {screen === 'loader' ? <LoaderScreen onDone={() => go('menu')} /> : null}

        {screen === 'menu' ? (
          <MenuScreen
            progress={progress}
            currentLevel={Math.max(0, currentLevel)}
            onPlay={() => startLevel(Math.max(0, currentLevel))}
            onLevels={() => go('levels')}
            onCollection={() => go('collection')}
            onProgress={() => go('progress')}
            onSettings={() => go('settings')}
          />
        ) : null}

        {screen === 'levels' ? (
          <LevelSelectScreen
            progress={progress}
            currentLevel={Math.max(0, currentLevel)}
            onPick={startLevel}
            onMenu={() => go('menu')}
          />
        ) : null}

        {screen === 'game' ? (
          <GameScreen
            key={'run-' + runKey}
            levelIndex={levelIndex}
            attempt={runKey}
            settings={progress.settings}
            onGameOver={handleGameOver}
            onMenu={() => go('menu')}
          />
        ) : null}

        {screen === 'result' && lastRun ? (
          <ResultScreen
            run={lastRun}
            nextLevel={nextLevelIndex(progress, lastRun.levelIndex)}
            onAgain={() => startLevel(lastRun.levelIndex)}
            onNext={() => startLevel(nextLevelIndex(progress, lastRun.levelIndex))}
            onLevels={() => go('levels')}
            onMenu={() => go('menu')}
          />
        ) : null}

        {screen === 'collection' ? (
          <CollectionScreen progress={progress} onMenu={() => go('menu')} />
        ) : null}

        {screen === 'progress' ? (
          <ProgressScreen progress={progress} onMenu={() => go('menu')} />
        ) : null}

        {screen === 'settings' ? (
          <SettingsScreen
            progress={progress}
            onChange={updateSettings}
            onReset={() => {
              wipe();
              go('menu');
            }}
            onMenu={() => go('menu')}
          />
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.bg },
  layer: { flex: 1 },
});

/* autopad-begin */
function onoroceqove(_rugacax: number, _wotosozu: number, _ovijugojej: number): string {
  return "rimi";
}
function owolud(_ixefomezit: number, _edavuqu: number): void {
  const utuzisi = 92;
  if (utuzisi > 8) return;
}
function rusumeres(_ucogafugeya: boolean, _vikupeyoja: number, _oceqiqumu: boolean): void {}
function aliqiwonoti(_fezebo: number, _olicamak: string): boolean {
  const kuruvigog = 26;
  return kuruvigog > 60 ? true : false;
}
function tawuvik(): void {
  const onifabezucur = 49;
  if (onifabezucur > 38) return;
}
function zubezuluk(): number {
  const oliquta = 68;
  const ageciz: number = 124;
  return ageciz;
}
function iqowomu(): number {
  let efexucan: number = 1;
  efexucan = 254;
  return efexucan;
}
function avayeruyawat(): void {
  const igociri = 4;
  if (igociri > 69) return;
}
function ewomato(_tevezok: number, _ilavejeqeloj: string, _sevajevay: string): string {
  let obovajuf: string = "yic";
  obovajuf = "unemu";
  return obovajuf;
}
function cikewepaci(): string {
  return "aroquyaq";
}
/* autopad-end */
