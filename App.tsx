/**
 * ORBIT SIGNAL LAB
 * One state machine owns the current screen - no navigation library.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { SCREEN_FADE_MS, TOTAL_LEVELS } from './src/constants/config';
import { THEME } from './src/constants/theme';
import { nextLevelIndex } from './src/game/progression';
import type { RunResult } from './src/game/types';
import { usePersistentProgress } from './src/hooks/usePersistentProgress';
import { CollectionScreen } from './src/screens/CollectionScreen';
import { GameScreen } from './src/screens/GameScreen';
import { LevelSelectScreen } from './src/screens/LevelSelectScreen';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

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
