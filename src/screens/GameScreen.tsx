import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { assets } from '../assets';
import { FloatingControlBar } from '../components/FloatingControlBar';
import { HintChip } from '../components/HintChip';
import { OrbitBoard, boardTileSize } from '../components/OrbitBoard';
import { PauseOverlay } from '../components/PauseOverlay';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SignalMeter } from '../components/SignalMeter';
import { TimerRing } from '../components/TimerRing';
import { COLS, HINT_VISIBLE_MS, ROWS, windowSeconds } from '../constants/config';
import { levelLabel } from '../constants/levels';
import { THEME } from '../constants/theme';
import { useOrbitBoard } from '../hooks/useOrbitBoard';
import { usePressScale } from '../hooks/usePressScale';
import type { Settings } from '../game/progression';
import type { RunResult } from '../game/types';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const HEADER_H = 116;
const HUD_H = 46;
const HINT_H = 44;
const BAR_BLOCK_H = 88 + 22 + 24;
const SAFETY = 20;

export interface GameScreenProps {
  levelIndex: number;
  attempt: number;
  settings: Settings;
  onGameOver: (run: RunResult) => void;
  onMenu: () => void;
}

export function GameScreen({
  levelIndex,
  attempt,
  settings,
  onGameOver,
  onMenu,
}: GameScreenProps) {
  const { width, height } = useWindowDimensions();
  const seconds = windowSeconds(settings.signalWindow);
  const board = useOrbitBoard({ levelIndex, attempt, seconds, onFinish: onGameOver });
  const [hintVisible, setHintVisible] = useState(settings.showGuides);

  useEffect(() => {
    if (!settings.showGuides) {
      setHintVisible(false);
      return;
    }
    setHintVisible(true);
    const timer = setTimeout(() => setHintVisible(false), HINT_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [settings.showGuides, levelIndex]);

  const maxBoardW = Math.min(width - 32, 380);
  const availableH =
    height - HEADER_H - HUD_H - HINT_H - BAR_BLOCK_H - SAFETY;
  const tile = boardTileSize(maxBoardW, Math.max(180, availableH), COLS, ROWS);

  const openPause = useCallback(() => board.setPaused(true), [board]);
  const closePause = useCallback(() => board.setPaused(false), [board]);

  return (
    <ScreenBackground overlay={THEME.overlay.board} drift={!settings.reducedMotion}>
      <ScreenHeader
        framed
        title=""
        backLabel="MENU"
        onBack={openPause}
        centerSlot={
          <TimerRing
            secondsLeft={board.secondsLeft}
            total={board.totalSeconds}
            frozen={board.frozen}
          />
        }
        rightSlot={<PauseButton onPress={openPause} />}
      />

      <View style={styles.hud}>
        <SignalMeter stability={board.stability} />
        <View style={styles.hudRight}>
          <Text style={styles.linked}>
            {'LINKED ' + board.linkedCount + '/' + board.grid.satelliteIds.length}
          </Text>
          <Text style={styles.level}>{levelLabel(levelIndex)}</Text>
        </View>
      </View>

      <View style={styles.hintRow}>
        <HintChip text={'TAP A NODE TO ROTATE IT 90' + '°'} visible={hintVisible} />
      </View>

      <View style={styles.boardArea} pointerEvents="box-none">
        <OrbitBoard
          grid={board.grid}
          rotations={board.rotations}
          routing={board.routing}
          tile={tile}
          palette={settings.beamPalette}
          flaringId={board.flaringId}
          surgeNonce={board.surgeNonce}
          showGuides={settings.showGuides}
          reducedMotion={settings.reducedMotion}
          onRotate={board.rotate}
        />
      </View>

      <View style={styles.barWrap} pointerEvents="box-none">
        <FloatingControlBar
          charges={board.charges}
          budget={board.budget}
          undosLeft={board.undosLeft}
          ampCharges={board.ampCharges}
          frozen={board.frozen}
          onUndo={board.undo}
          onGo={board.go}
          onAmplify={board.amplify}
        />
      </View>

      {board.paused ? (
        <PauseOverlay
          onResume={closePause}
          onMenu={onMenu}
          linked={board.linkedCount}
          satellites={board.grid.satelliteIds.length}
        />
      ) : null}
    </ScreenBackground>
  );
}

function PauseButton({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel="PAUSE"
      style={styles.pausePress}>
      <Animated.View pointerEvents="box-none" style={[styles.pauseShell, { transform: [{ scale }] }]}>
        <Image source={assets.iconPause} style={styles.pauseIcon} resizeMode="contain" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hud: {
    height: HUD_H,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hudRight: { alignItems: 'flex-end' },
  linked: {
    color: THEME.colors.signal,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
    fontVariant: ['tabular-nums'],
  },
  level: {
    color: THEME.colors.textTertiary,
    fontSize: 9.5,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  hintRow: { height: HINT_H, justifyContent: 'center' },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: BAR_BLOCK_H,
  },
  barWrap: { position: 'absolute', left: 16, right: 16, bottom: 24 },
  pausePress: { width: 48, height: 48, alignItems: 'flex-end', justifyContent: 'center' },
  pauseShell: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIcon: { width: 28, height: 28 },
});
