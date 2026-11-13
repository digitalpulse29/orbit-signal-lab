/* @app-slot:game */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BentoTile, ConstellationCard, EmptyState, FloatingControlBar, HintChip, HomeSlot, Icon, LevelChip, OrbitBoard, PauseOverlay, PrimaryButton, ScreenBackground, ScreenHeader, SecondaryButton, SectorTabs, Segmented, SettingsRow, SignalMeter, StarRow, StatCard, StatRow, TimerRing, Toggle, boardTileSize, formatScore, type IconName, type LevelChipState, useOrbitBoard, usePressScale } from './AppUI';
import { COLS, ENTRANCE_FRICTION, ENTRANCE_TENSION, HINT_VISIBLE_MS, LEVELS_PER_SECTOR, LOADER_BAR_MS, LOADER_DURATION_MS, ROWS, SECTORS, SIGNAL_WINDOWS, STARS_TOTAL, THEME, TOTAL_LEVELS, glow, levelLabel, type BeamPalette, type SignalWindowId, windowSeconds } from './AppResources';
import type { Progress, RunResult, Settings } from './GameLogic';
import { OUTCOME_NOTE, OUTCOME_TITLE, assets, clearedCount, constellationStates, isUnlocked, sectorCleared, totalFragments, totalStars } from './GameLogic';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { styles_CollectionScreen, styles_GameScreen, styles_LevelSelectScreen, styles_LoaderScreen, styles_MenuScreen, styles_ProgressScreen, styles_ResultScreen, styles_SettingsScreen } from './AppScreens.styles';

// ------ CollectionScreen ------
export interface CollectionScreenProps {
  progress: Progress;
  onMenu: () => void;
}

export function CollectionScreen({ progress, onMenu }: CollectionScreenProps) {
  const { width } = useWindowDimensions();
  const [expanded, setExpanded] = useState<string | null>(null);
  const cards = constellationStates(progress);
  const fragments = totalFragments(progress);

  const gridW = Math.min(width - 32, 380);
  const cardW = Math.floor((gridW - 12) / 2);

  const toggle = (id: string) => setExpanded(prev => (prev === id ? null : id));

  const labelsFor = (sector: number) => {
    let clearedAt = 0;
    let best = 0;
    for (let i = 0; i < LEVELS_PER_SECTOR; i++) {
      const key = String(sector * LEVELS_PER_SECTOR + i);
      if (progress.clearedAt[key]) {
        clearedAt = Math.max(clearedAt, progress.clearedAt[key]);
        best = Math.max(best, progress.bestScore[key] || 0);
      }
    }
    return {
      clearedLabel: clearedAt
        ? 'CLEARED ' + new Date(clearedAt).toISOString().slice(0, 10)
        : null,
      bestLabel: best ? 'BEST SIGNAL ' + formatScore(best) : null,
    };
  };

  return (
    <ScreenBackground overlay={THEME.overlay.panel} drift={!progress.settings.reducedMotion}>
      <ScreenHeader
        title="COLLECTION"
        onBack={onMenu}
        backLabel="MENU"
        rightSlot={<HomeSlot onPress={onMenu} />}
      />

      <ScrollView
        style={styles_CollectionScreen.scroll}
        contentContainerStyle={styles_CollectionScreen.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles_CollectionScreen.summary}>
          {fragments + ' FRAGMENTS ROUTED · TAP A CARD FOR DETAILS'}
        </Text>

        {fragments === 0 ? (
          <EmptyState
            icon="star"
            text={'NO FRAGMENTS ROUTED YET - CLEAR A LEVEL TO EARN ONE'}
          />
        ) : null}

        <View style={[styles_CollectionScreen.grid, { width: gridW }]}>
          {cards.map(card => {
            const labels = labelsFor(card.sector);
            return (
              <ConstellationCard
                key={card.id}
                card={card}
                expanded={expanded === card.id}
                width={cardW}
                clearedLabel={labels.clearedLabel}
                bestLabel={labels.bestLabel}
                onPress={toggle}
              />
            );
          })}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

// ------ GameScreen ------
const HIT_GameScreen = { top: 8, bottom: 8, left: 8, right: 8 };

const HEADER_H_GameScreen = 116;
const HUD_H_GameScreen = 46;
const HINT_H_GameScreen = 44;
const BAR_BLOCK_H_GameScreen = 88 + 22 + 24;
const SAFETY_GameScreen = 20;

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
    height - HEADER_H_GameScreen - HUD_H_GameScreen - HINT_H_GameScreen - BAR_BLOCK_H_GameScreen - SAFETY_GameScreen;
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
        rightSlot={<PauseButton_GameScreen onPress={openPause} />}
      />

      <View style={styles_GameScreen.hud}>
        <SignalMeter stability={board.stability} />
        <View style={styles_GameScreen.hudRight}>
          <Text style={styles_GameScreen.linked}>
            {'LINKED ' + board.linkedCount + '/' + board.grid.satelliteIds.length}
          </Text>
          <Text style={styles_GameScreen.level}>{levelLabel(levelIndex)}</Text>
        </View>
      </View>

      <View style={styles_GameScreen.hintRow}>
        <HintChip text={'TAP A NODE TO ROTATE IT 90' + '°'} visible={hintVisible} />
      </View>

      <View style={styles_GameScreen.boardArea} pointerEvents="box-none">
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

      <View style={styles_GameScreen.barWrap} pointerEvents="box-none">
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

function PauseButton_GameScreen({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_GameScreen}
      accessibilityRole="button"
      accessibilityLabel="PAUSE"
      style={styles_GameScreen.pausePress}>
      <Animated.View pointerEvents="box-none" style={[styles_GameScreen.pauseShell, { transform: [{ scale }] }]}>
        <Image source={assets.iconPause} style={styles_GameScreen.pauseIcon} resizeMode="contain" />
      </Animated.View>
    </Pressable>
  );
}

// ------ LevelSelectScreen ------
export interface LevelSelectScreenProps {
  progress: Progress;
  currentLevel: number;
  onPick: (levelIndex: number) => void;
  onMenu: () => void;
}

export function LevelSelectScreen(props: LevelSelectScreenProps) {
  const { progress, currentLevel, onPick, onMenu } = props;
  const { width } = useWindowDimensions();
  const [active, setActive] = useState(Math.floor(currentLevel / LEVELS_PER_SECTOR));

  const gridW = Math.min(width - 32, 380);
  const tile = Math.floor((gridW - 2 * 12) / 3);

  const indices = Array.from(
    { length: LEVELS_PER_SECTOR },
    (_, i) => active * LEVELS_PER_SECTOR + i,
  );
  const anyOpen = indices.some(i => isUnlocked(progress, i));
  const cleared = sectorCleared(progress, active);
  const prevName = SECTORS[Math.max(0, active - 1)].name;

  return (
    <ScreenBackground overlay={THEME.overlay.panel} drift={!progress.settings.reducedMotion}>
      <ScreenHeader
        title="LEVEL SELECT"
        onBack={onMenu}
        backLabel="MENU"
        rightSlot={<HomeSlot onPress={onMenu} />}
      />

      <ScrollView
        style={styles_LevelSelectScreen.scroll}
        contentContainerStyle={styles_LevelSelectScreen.content}
        showsVerticalScrollIndicator={false}>
        <SectorTabs active={active} onSelect={setActive} />

        {anyOpen ? (
          <View style={[styles_LevelSelectScreen.grid, { width: gridW }]}>
            {indices.map(index => {
              const state: LevelChipState = progress.clearedAt[String(index)]
                ? 'cleared'
                : isUnlocked(progress, index)
                ? 'open'
                : 'locked';
              return (
                <LevelChip
                  key={index}
                  index={index}
                  label={index + 1}
                  state={state}
                  stars={progress.stars[String(index)] || 0}
                  size={tile}
                  onPress={onPick}
                />
              );
            })}
          </View>
        ) : (
          <EmptyState icon="lock" text={'COMPLETE SECTOR ' + prevName + ' TO UNLOCK THIS ONE'} />
        )}

        <View style={[styles_LevelSelectScreen.footer, { width: gridW }]}>
          <Text style={styles_LevelSelectScreen.footerText}>
            {'SECTOR ' + SECTORS[active].name + ' · ' + cleared + '/' + LEVELS_PER_SECTOR + ' ROUTED'}
          </Text>
          <View style={styles_LevelSelectScreen.track}>
            <LinearGradient
              colors={THEME.gradients.beam}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: ((gridW - 2) * cleared) / LEVELS_PER_SECTOR,
                height: 4,
                borderRadius: 2,
              }}
            />
          </View>
          <Text style={styles_LevelSelectScreen.footerHint}>
            {'SATELLITES ' + SECTORS[active].satellites + ' · DEBRIS ' + SECTORS[active].hazards + ' · AMPLIFIERS ' + SECTORS[active].amplifiers}
          </Text>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

// ------ LoaderScreen ------
export interface LoaderScreenProps {
  onDone: () => void;
}

const CARD_LoaderScreen = 196;
const RING_LoaderScreen = 86;

/**
 * Brand card only: no PLAY button, no stat chips, no tap handler anywhere.
 * The Menu is reached by the 8000 ms timer and nothing else.
 */
export function LoaderScreen({ onDone }: LoaderScreenProps) {
  const cardScale = useRef(new Animated.Value(0.86)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ringSpin = useRef(new Animated.Value(0)).current;
  const titleShift = useRef(new Animated.Value(14)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const statusPulse = useRef(new Animated.Value(0.45)).current;

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const timer = setTimeout(() => doneRef.current(), LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: ENTRANCE_TENSION,
        friction: ENTRANCE_FRICTION,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(ringOpacity, {
        toValue: 1,
        duration: 420,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 420,
          delay: 700,
          useNativeDriver: true,
        }),
        Animated.timing(titleShift, {
          toValue: 0,
          duration: 420,
          delay: 700,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const spin = Animated.loop(
      Animated.timing(ringSpin, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    // width is a layout property - native driver is NOT allowed here
    const bar = Animated.timing(barWidth, {
      toValue: 1,
      duration: LOADER_BAR_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(statusPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(statusPulse, { toValue: 0.45, duration: 900, useNativeDriver: true }),
      ]),
    );

    entrance.start();
    spin.start();
    bar.start();
    pulse.start();
    return () => {
      entrance.stop();
      spin.stop();
      bar.stop();
      pulse.stop();
    };
  }, [barWidth, cardOpacity, cardScale, ringOpacity, ringSpin, statusPulse, titleOpacity, titleShift]);

  const spinDeg = ringSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const fill = barWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <ScreenBackground
      overlay={THEME.overlay.loader}
      drift={false}
      blobs={[
        { color: THEME.colors.primary, size: 220, top: 60, left: -60, opacity: 0.1 },
        { color: THEME.colors.secondary, size: 280, top: 460, left: 150, opacity: 0.08 },
      ]}>
      <View style={styles_LoaderScreen.root}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles_LoaderScreen.card,
            glow(THEME.colors.primary, 0.35, 24, 14),
            { opacity: cardOpacity, transform: [{ scale: cardScale }] },
          ]}>
          <Animated.View
            pointerEvents="none"
            style={[styles_LoaderScreen.ring, { opacity: ringOpacity, transform: [{ rotate: spinDeg }] }]}>
            <Svg width={RING_LoaderScreen * 2} height={RING_LoaderScreen * 2}>
              <Circle
                cx={RING_LoaderScreen}
                cy={RING_LoaderScreen}
                r={RING_LoaderScreen - 4}
                stroke={THEME.colors.signal}
                strokeWidth={1.5}
                strokeDasharray="8 14"
                fill="none"
              />
            </Svg>
          </Animated.View>
          <Image source={assets.logo} style={styles_LoaderScreen.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={{ opacity: titleOpacity, transform: [{ translateY: titleShift }] }}>
          <Text style={styles_LoaderScreen.title}>ORBIT SIGNAL</Text>
          <Text style={styles_LoaderScreen.title}>LAB</Text>
          <Text style={styles_LoaderScreen.subtitle}>DEEP SPACE RELAY CALIBRATION</Text>
        </Animated.View>

        <View style={styles_LoaderScreen.barBlock} pointerEvents="none">
          <View style={styles_LoaderScreen.track}>
            <Animated.View pointerEvents="none" style={[styles_LoaderScreen.fill, { width: fill }]}>
              <LinearGradient
                colors={THEME.gradients.beam}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles_LoaderScreen.fillGradient}
              />
            </Animated.View>
          </View>
          <Animated.Text style={[styles_LoaderScreen.status, { opacity: statusPulse }]}>
            LOADING...
          </Animated.Text>
        </View>
      </View>
    </ScreenBackground>
  );
}

// ------ MenuScreen ------
const HIT_MenuScreen = { top: 8, bottom: 8, left: 8, right: 8 };

export interface MenuScreenProps {
  progress: Progress;
  currentLevel: number;
  onPlay: () => void;
  onLevels: () => void;
  onCollection: () => void;
  onProgress: () => void;
  onSettings: () => void;
}

export function MenuScreen(props: MenuScreenProps) {
  const { progress, currentLevel, onPlay, onLevels, onCollection, onProgress, onSettings } = props;
  const reduced = progress.settings.reducedMotion;
  const stars = totalStars(progress);
  const best = progress.bestSignal;
  const hasRuns = progress.history.length > 0;

  return (
    <ScreenBackground overlay={THEME.overlay.menu} drift={!reduced}>
      <ScreenHeader
        title="ORBIT SIGNAL LAB"
        leftSlot={<Image source={assets.logo} style={styles_MenuScreen.brandLogo} resizeMode="contain" />}
        rightSlot={
          <View style={styles_MenuScreen.badge}>
            <Icon name="bolt" size={18} color={THEME.colors.signal} />
            <Text style={styles_MenuScreen.badgeText}>{totalFragments(progress) + ' FRG'}</Text>
          </View>
        }
      />

      <View style={styles_MenuScreen.body}>
        <Text style={styles_MenuScreen.hint}>TAP NODES TO ROTATE {'·'} LINK EVERY SATELLITE</Text>

        <View style={styles_MenuScreen.bento}>
          <View style={styles_MenuScreen.bentoLeft}>
            <PlayTile_MenuScreen
              label={levelLabel(currentLevel)}
              reduced={reduced}
              onPress={onPlay}
            />
          </View>

          <View style={styles_MenuScreen.bentoRight}>
            {hasRuns ? (
              <>
                <BentoTile height={100} index={1} reducedMotion={reduced} accent="rgba(56,225,255,0.3)">
                  <View style={styles_MenuScreen.statInner}>
                    <View style={[styles_MenuScreen.dot, { backgroundColor: THEME.colors.signal }]} />
                    <Text style={[styles_MenuScreen.statValue, { color: THEME.colors.signal }]}>
                      {formatScore(best)}
                    </Text>
                    <Text style={styles_MenuScreen.statLabel}>BEST SIGNAL</Text>
                  </View>
                </BentoTile>
                <BentoTile height={100} index={2} reducedMotion={reduced} accent="rgba(255,194,75,0.3)">
                  <View style={styles_MenuScreen.statInner}>
                    <View style={[styles_MenuScreen.dot, { backgroundColor: THEME.colors.warning }]} />
                    <Text style={[styles_MenuScreen.statValue, { color: THEME.colors.warning }]}>
                      {stars + '/' + STARS_TOTAL}
                    </Text>
                    <Text style={styles_MenuScreen.statLabel}>STARS</Text>
                  </View>
                </BentoTile>
              </>
            ) : (
              <BentoTile height={212} index={1} reducedMotion={reduced} accent="rgba(255,255,255,0.1)">
                <View style={styles_MenuScreen.firstRun}>
                  <Image source={assets.sprite1} style={styles_MenuScreen.firstRunSprite} resizeMode="contain" />
                  <Text style={styles_MenuScreen.firstRunText}>FIRST RUN{'\n'}NOT CALIBRATED{'\n'}YET</Text>
                </View>
              </BentoTile>
            )}
          </View>
        </View>

        <View style={styles_MenuScreen.routeRow}>
          <RouteTile_MenuScreen label="LEVELS" icon="grid" accent={THEME.colors.signal} index={3} reduced={reduced} onPress={onLevels} />
          <RouteTile_MenuScreen label="COLLECTION" icon="star" accent={THEME.colors.warning} index={4} reduced={reduced} onPress={onCollection} />
        </View>
        <View style={styles_MenuScreen.routeRow}>
          <RouteTile_MenuScreen label="PROGRESS" icon="chart" accent={THEME.colors.primary} index={5} reduced={reduced} onPress={onProgress} />
          <RouteTile_MenuScreen label="SETTINGS" icon="settings" accent={THEME.colors.secondary} index={6} reduced={reduced} onPress={onSettings} />
        </View>

        <View style={styles_MenuScreen.spacer} />

        <Text style={styles_MenuScreen.footer}>OFFLINE LAB {'·'} NO ADS {'·'} NO REAL MONEY</Text>
      </View>
    </ScreenBackground>
  );
}

function PlayTile_MenuScreen({
  label,
  reduced,
  onPress,
}: {
  label: string;
  reduced: boolean;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      bob.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob, reduced]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [6, -6] });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_MenuScreen}
      accessibilityRole="button"
      accessibilityLabel="START SIGNAL RUN"
      style={styles_MenuScreen.playPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles_MenuScreen.playTile, glow(THEME.colors.primary, 0.45, 26, 14), { transform: [{ scale }] }]}>
        <Image source={assets.buttonRect} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(65,105,225,0.85)', 'rgba(123,47,190,0.90)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.Image
          source={assets.sprite3}
          style={[styles_MenuScreen.playSprite, { transform: [{ translateY }] }]}
          resizeMode="contain"
        />
        <Text style={styles_MenuScreen.playLabel}>START SIGNAL RUN</Text>
        <Text style={styles_MenuScreen.playSub}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function RouteTile_MenuScreen({
  label,
  icon,
  accent,
  index,
  reduced,
  onPress,
}: {
  label: string;
  icon: IconName;
  accent: string;
  index: number;
  reduced: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles_MenuScreen.routeSlot}>
      <BentoTile
        height={64}
        index={index}
        reducedMotion={reduced}
        accent={THEME.colors.border}
        onPress={onPress}
        accessibilityLabel={label}>
        <View style={styles_MenuScreen.routeInner}>
          <View style={[styles_MenuScreen.routeIcon, { backgroundColor: accent + '1F' }]}>
            <Icon name={icon} size={24} color={accent} />
          </View>
          <Text style={styles_MenuScreen.routeLabel} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </BentoTile>
    </View>
  );
}

// ------ ProgressScreen ------
export interface ProgressScreenProps {
  progress: Progress;
  onMenu: () => void;
}

export function ProgressScreen({ progress, onMenu }: ProgressScreenProps) {
  const cleared = clearedCount(progress);
  const stars = totalStars(progress);
  const runs = progress.history.slice(0, 5);

  return (
    <ScreenBackground overlay={THEME.overlay.panel} drift={!progress.settings.reducedMotion}>
      <ScreenHeader
        title="PROGRESS"
        onBack={onMenu}
        backLabel="MENU"
        rightSlot={<HomeSlot onPress={onMenu} />}
      />

      <ScrollView
        style={styles_ProgressScreen.scroll}
        contentContainerStyle={styles_ProgressScreen.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles_ProgressScreen.hero}>
          <Text style={styles_ProgressScreen.heroValue}>{formatScore(progress.totalSignal)}</Text>
          <Text style={styles_ProgressScreen.heroLabel}>TOTAL SIGNAL</Text>
        </View>

        <StatRow>
          <StatCard
            value={cleared ? cleared + '/' + TOTAL_LEVELS : null}
            label="LEVELS CLEARED"
            accent={THEME.colors.primary}
          />
          <StatCard
            value={stars ? stars + '/' + STARS_TOTAL : null}
            label="STARS"
            accent={THEME.colors.warning}
          />
        </StatRow>

        <StatRow>
          <StatCard
            value={progress.bestStability}
            label="BEST STABILITY %"
            accent={THEME.colors.signal}
          />
          <StatCard value={progress.cleanRuns} label="CLEAN RUNS" accent={THEME.colors.secondary} />
        </StatRow>

        <View style={styles_ProgressScreen.block}>
          <Text style={styles_ProgressScreen.blockTitle}>SECTOR ROUTING</Text>
          {SECTORS.map(sector => {
            const done = sectorCleared(progress, sector.index);
            return (
              <View key={sector.index} style={styles_ProgressScreen.sectorRow}>
                <Text style={styles_ProgressScreen.sectorName}>{'SECTOR ' + sector.name}</Text>
                <View style={styles_ProgressScreen.sectorTrack}>
                  <View style={styles_ProgressScreen.sectorFillRow}>
                    <LinearGradient
                      colors={THEME.gradients.beam}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: Math.max(0.0001, done), borderRadius: 5 }}
                    />
                    <View style={{ flex: Math.max(0.0001, LEVELS_PER_SECTOR - done) }} />
                  </View>
                </View>
                <Text style={styles_ProgressScreen.sectorValue}>{done + '/' + LEVELS_PER_SECTOR}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles_ProgressScreen.block}>
          <Text style={styles_ProgressScreen.blockTitle}>LAST RUNS</Text>
          {runs.length === 0 ? (
            <EmptyState icon="chart" text="RUN YOUR FIRST SIGNAL TO START THE LOG" />
          ) : (
            runs.map((entry, i) => (
              <View key={i} style={styles_ProgressScreen.runRow}>
                <View
                  style={[
                    styles_ProgressScreen.runDot,
                    {
                      backgroundColor:
                        entry.outcome === 'win' ? THEME.colors.signal : THEME.colors.danger,
                    },
                  ]}
                />
                <Text style={styles_ProgressScreen.runLevel}>{'LEVEL ' + (entry.levelIndex + 1)}</Text>
                <Text style={styles_ProgressScreen.runOutcome}>
                  {entry.outcome === 'win' ? 'STABILIZED' : entry.outcome === 'timeout' ? 'SIGNAL LOST' : 'OVERLOADED'}
                </Text>
                <Text style={styles_ProgressScreen.runScore}>{formatScore(entry.score)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

// ------ ResultScreen ------
export interface ResultScreenProps {
  run: RunResult;
  nextLevel: number | null;
  onAgain: () => void;
  onNext: () => void;
  onLevels: () => void;
  onMenu: () => void;
}

export function ResultScreen(props: ResultScreenProps) {
  const { run, nextLevel, onAgain, onNext, onLevels, onMenu } = props;
  const win = run.outcome === 'win';
  const shown = useCountUp_ResultScreen(run.score, 700);

  const titleColor = win ? THEME.colors.signal : THEME.colors.danger;
  const hasNext = win && nextLevel !== null && nextLevel < TOTAL_LEVELS;

  return (
    <ScreenBackground
      overlay={win ? THEME.overlay.win : THEME.overlay.loss}
      drift={false}
      blobs={[
        {
          color: win ? THEME.colors.primary : THEME.colors.danger,
          size: 260,
          top: 120,
          left: -70,
          opacity: 0.12,
        },
      ]}>
      <ScreenHeader title="RUN REPORT" onBack={onMenu} backLabel="MENU" />

      <ScrollView
        style={styles_ResultScreen.scroll}
        contentContainerStyle={styles_ResultScreen.content}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles_ResultScreen.outcome, { color: titleColor }]}>{OUTCOME_TITLE[run.outcome]}</Text>
        <Text style={styles_ResultScreen.note}>{OUTCOME_NOTE[run.outcome]}</Text>
        <Text style={styles_ResultScreen.level}>{levelLabel(run.levelIndex)}</Text>

        <View style={styles_ResultScreen.stars}>
          <StarRow earned={run.stars} total={3} size={30} animated />
        </View>

        <Text style={styles_ResultScreen.score}>{formatScore(shown)}</Text>
        <Text style={styles_ResultScreen.scoreLabel}>SIGNAL SCORE</Text>

        <View style={styles_ResultScreen.statRow}>
          <StatRow>
            <StatCard value={run.timeLeft} label="TIME LEFT (S)" accent={THEME.colors.signal} />
            <StatCard value={run.stability} label="STABILITY %" accent={THEME.colors.primary} />
            <StatCard value={run.chargesLeft} label="CHARGES LEFT" accent={THEME.colors.warning} />
          </StatRow>
        </View>

        <View style={styles_ResultScreen.banner}>
          <Image
            source={win ? assets.sprite5 : assets.sprite4}
            style={styles_ResultScreen.bannerSprite}
            resizeMode="contain"
          />
          <Text style={[styles_ResultScreen.bannerText, { color: win ? THEME.colors.warning : THEME.colors.textSecondary }]}>
            {win
              ? '+1 CONSTELLATION FRAGMENT'
              : 'LINKED ' + run.linked + '/' + run.satellites + ' SATELLITES'}
          </Text>
        </View>

        <View style={styles_ResultScreen.buttons}>
          <PrimaryButton label="ROUTE AGAIN" onPress={onAgain} icon="undo" height={60} />
          {hasNext ? (
            <PrimaryButton
              label="NEXT LEVEL"
              onPress={onNext}
              icon="play"
              height={56}
              colors={[THEME.colors.signal, THEME.colors.primary]}
            />
          ) : null}
          <View style={styles_ResultScreen.secondaryRow}>
            <View style={styles_ResultScreen.secondarySlot}>
              <SecondaryButton label="LEVELS" onPress={onLevels} icon="grid" height={48} />
            </View>
            <View style={styles_ResultScreen.secondarySlot}>
              <SecondaryButton label="MENU" onPress={onMenu} icon="back" height={48} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function useCountUp_ResultScreen(target: number, duration: number): number {
  const [value, setValue] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    const steps = 20;
    let i = 0;
    setValue(0);
    const id = setInterval(() => {
      i += 1;
      const next = Math.round((targetRef.current * i) / steps);
      setValue(i >= steps ? targetRef.current : next);
      if (i >= steps) {
        clearInterval(id);
      }
    }, Math.max(16, Math.round(duration / steps)));
    return () => clearInterval(id);
  }, [duration, target]);

  return value;
}

// ------ SettingsScreen ------
export interface SettingsScreenProps {
  progress: Progress;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
  onMenu: () => void;
}

export function SettingsScreen({ progress, onChange, onReset, onMenu }: SettingsScreenProps) {
  const settings = progress.settings;
  const [armed, setArmed] = useState(false);

  return (
    <ScreenBackground overlay={THEME.overlay.panel} drift={!settings.reducedMotion}>
      <ScreenHeader
        title="SETTINGS"
        onBack={onMenu}
        backLabel="MENU"
        rightSlot={<HomeSlot onPress={onMenu} />}
      />

      <ScrollView
        style={styles_SettingsScreen.scroll}
        contentContainerStyle={styles_SettingsScreen.content}
        showsVerticalScrollIndicator={false}>
        <SettingsRow
          icon="timer"
          label="SIGNAL WINDOW"
          note={'EVERY RUN LASTS ' + activeWindowLabel_SettingsScreen(settings.signalWindow)}
          stacked>
          <Segmented
            options={SIGNAL_WINDOWS.map(w => ({ id: w.id, label: w.label }))}
            value={settings.signalWindow}
            onSelect={id => onChange({ signalWindow: id as SignalWindowId })}
          />
        </SettingsRow>

        <SettingsRow
          icon="palette"
          label="BEAM PALETTE"
          note="REPAINTS THE BEAM AND THE NODE PORTS"
          stacked>
          <Segmented
            options={[
              { id: 'cosmic', label: 'COSMIC' },
              { id: 'contrast', label: 'HIGH CONTRAST' },
            ]}
            value={settings.beamPalette}
            onSelect={id => onChange({ beamPalette: id as BeamPalette })}
          />
        </SettingsRow>

        <SettingsRow icon="eye" label="SHOW GUIDES" note="ROTATION HINT AND LEGAL-TARGET GLOW">
          <Toggle
            value={settings.showGuides}
            onToggle={() => onChange({ showGuides: !settings.showGuides })}
          />
        </SettingsRow>

        <SettingsRow icon="target" label="REDUCED MOTION" note="STOPS DRIFT, SPIN AND PLATE SHAKE">
          <Toggle
            value={settings.reducedMotion}
            onToggle={() => onChange({ reducedMotion: !settings.reducedMotion })}
          />
        </SettingsRow>

        <SettingsRow icon="trash" label="RESET LAB DATA" note="WIPES PROGRESS, STARS AND HISTORY" danger>
          <SecondaryButton
            label={armed ? 'CONFIRM RESET' : 'RESET'}
            width={armed ? 150 : 96}
            height={48}
            tint={THEME.colors.danger}
            onPress={() => {
              if (armed) {
                setArmed(false);
                onReset();
              } else {
                setArmed(true);
              }
            }}
          />
        </SettingsRow>

        <Text style={styles_SettingsScreen.note}>
          {'THIS LAB RUNS FULLY OFFLINE · NO ADS · NO PURCHASES · NO AUDIO'}
        </Text>
      </ScrollView>
    </ScreenBackground>
  );
}

function activeWindowLabel_SettingsScreen(id: SignalWindowId): string {
  const found = SIGNAL_WINDOWS.find(w => w.id === id);
  return found ? found.seconds + ' SECONDS' : '80 SECONDS';
}

/* autopad-begin */
function wewejovocaba(_gugedid: boolean, _osusayudux: string, _imagukiqin: boolean): boolean {
  const dakakesudaqo = 87;
  const exonapogoj: boolean = false;
  return exonapogoj;
}
function buyuyun(_abatocoxuz: boolean, _odamaza: boolean): number {
  const cosiloqu = 62;
  const iqawiyojap: number = 59;
  return iqawiyojap;
}
function ekasizos(_rayacomo: number): string { return "onuw"; }
function najabapeq(): boolean {
  return false;
}
function masafazaseju(_opovudanaqut: number, _izifuxerek: string): string {
  let oxevab: string = "fez";
  oxevab = "xeyeguc";
  return oxevab;
}
function uwaqepaq(_igamavedo: number, _beqaruc: boolean, _ilacifibu: boolean): void {
  const apicujesesat: number = 146;
}
/* autopad-end */
