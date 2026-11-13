/* @app-slot:game */
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Pressable, StyleSheet, Text, View, type DimensionValue, type ViewStyle, useWindowDimensions } from 'react-native';
import Svg, { Circle, Ellipse, Line } from 'react-native-svg';
import type { BeamEdge, ConstellationState, Grid, NodeKind, Outcome, Routing, RunResult } from './GameLogic';
import { AMPLIFY_FREEZE_MS, CHARGE_BONUS, ENTRANCE_FRICTION, ENTRANCE_TENSION, FRAGMENTS_PER_CONSTELLATION, GO_FAIL_COST, OVERRIDE_COST, PRESS_FRICTION, PRESS_TENSION, ROTATE_FRICTION, ROTATE_TENSION, SECTORS, STABILITY_START, SURGE_COST, SURGE_REVERT_MS, THEME, UNDO_LIMIT, beamColors, glow, type BeamPalette } from './AppResources';
import * as Lucide from 'lucide-react-native';
import { E, N, NODE_SPRITE, S, W, advanceFlare, allLinked, applyRun, assets, buildResult, flareBreaches, generateLevel, initialFlare, litAmplifiers, loadProgress, resetProgress, saveProgress, solveRouting, startRotations, type FlareState, type Progress, type Settings } from './GameLogic';
import LinearGradient from 'react-native-linear-gradient';
import { styles_BentoTile, styles_ConstellationCard, styles_EmptyState, styles_FloatingControlBar, styles_HintChip, styles_LevelChip, styles_NodeTile, styles_OrbitBoard, styles_PauseOverlay, styles_PrimaryButton, styles_RoundActionButton, styles_ScreenBackground, styles_ScreenHeader, styles_SecondaryButton, styles_SectorTabs, styles_SettingsRow, styles_SignalMeter, styles_StarRow, styles_StatCard, styles_TimerRing } from './AppUI.styles';

// ------ BeamLayer ------
export interface BeamLayerProps {
  edges: BeamEdge[];
  cols: number;
  tile: number;
  frame: number;
  width: number;
  height: number;
  beam: string;
  under: string;
  beaconId: number;
  pulseKey: number;
  reducedMotion: boolean;
}

/** The lit route, drawn as one SVG overlay on top of the tiles. */
export function BeamLayer(props: BeamLayerProps) {
  const {
    edges,
    cols,
    tile,
    frame,
    width,
    height,
    beam,
    under,
    beaconId,
    pulseKey,
    reducedMotion,
  } = props;

  const sweep = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reducedMotion) {
      sweep.setValue(1);
      return;
    }
    sweep.setValue(0.25);
    const anim = Animated.timing(sweep, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [pulseKey, reducedMotion, sweep]);

  const center = (id: number) => ({
    x: frame + (id % cols) * tile + tile / 2,
    y: frame + Math.floor(id / cols) * tile + tile / 2,
  });

  const beacon = center(beaconId);

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { opacity: sweep }]}>
      <Svg width={width} height={height}>
        {edges.map((edge, i) => {
          const a = center(edge.a);
          const b = center(edge.b);
          return (
            <Line
              key={'u' + i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={under}
              strokeOpacity={0.35}
              strokeWidth={10}
              strokeLinecap="round"
            />
          );
        })}
        {edges.map((edge, i) => {
          const a = center(edge.a);
          const b = center(edge.b);
          return (
            <Line
              key={'b' + i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={beam}
              strokeWidth={5}
              strokeLinecap="round"
            />
          );
        })}
        <Circle cx={beacon.x} cy={beacon.y} r={tile * 0.42} fill={beam} fillOpacity={0.12} />
      </Svg>
    </Animated.View>
  );
}

// ------ BentoTile ------
const HIT_BentoTile = { top: 8, bottom: 8, left: 8, right: 8 };

export interface BentoTileProps {
  height: number;
  onPress?: () => void;
  accent?: string;
  style?: ViewStyle;
  index?: number;
  reducedMotion?: boolean;
  children: React.ReactNode;
  accessibilityLabel?: string;
}

/** One cell of the Menu bento grid. Tiles stagger in on mount. */
export function BentoTile({
  height,
  onPress,
  accent = THEME.colors.border,
  style,
  index = 0,
  reducedMotion = false,
  children,
  accessibilityLabel,
}: BentoTileProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(!!onPress);
  const enter = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reducedMotion) {
      enter.setValue(1);
      return;
    }
    const anim = Animated.timing(enter, {
      toValue: 1,
      duration: 320,
      delay: index * 70,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [enter, index, reducedMotion]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  const body = (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles_BentoTile.tile,
        { height, borderColor: accent },
        style,
        { opacity: enter, transform: [{ translateY }, { scale }] },
      ]}>
      {children}
    </Animated.View>
  );

  if (!onPress) {
    return <View style={{ height }}>{body}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_BentoTile}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={{ width: '100%', height }}>
      {body}
    </Pressable>
  );
}

// ------ ConstellationCard ------
const HIT_ConstellationCard = { top: 6, bottom: 6, left: 6, right: 6 };

/** Deterministic star patterns, one per card id. */
const PATTERNS_ConstellationCard: Record<string, Array<[number, number]>> = {
  orion: [[20, 18], [46, 10], [70, 26], [38, 46], [58, 62], [26, 72]],
  lyra: [[30, 14], [62, 22], [48, 44], [22, 56], [68, 66]],
  vela: [[16, 30], [40, 16], [66, 28], [78, 54], [50, 68], [24, 62]],
  pyxis: [[34, 20], [62, 34], [44, 52], [70, 70], [20, 48]],
  carina: [[18, 22], [44, 12], [72, 24], [60, 48], [34, 58], [16, 70], [76, 66]],
  dorado: [[26, 16], [54, 26], [38, 48], [66, 58], [28, 70]],
  tucana: [[22, 26], [50, 14], [74, 34], [56, 56], [30, 64], [46, 78]],
  phoenix: [[20, 16], [48, 28], [74, 18], [60, 50], [34, 46], [50, 72], [24, 68]],
};

export interface ConstellationCardProps {
  card: ConstellationState;
  expanded: boolean;
  width: number;
  clearedLabel?: string | null;
  bestLabel?: string | null;
  onPress: (id: string) => void;
}

export function ConstellationCard(props: ConstellationCardProps) {
  const { card, expanded, width, clearedLabel, bestLabel, onPress } = props;
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  const points = PATTERNS_ConstellationCard[card.id] || PATTERNS_ConstellationCard.lyra;
  const art = width - 24;
  const height = expanded ? 236 : 196;
  const color = card.unlocked ? THEME.colors.signal : THEME.colors.textTertiary;

  return (
    <Pressable
      onPress={() => onPress(card.id)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_ConstellationCard}
      accessibilityRole="button"
      accessibilityLabel={card.name}
      style={{ width, height }}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_ConstellationCard.card,
          {
            height,
            borderColor: card.unlocked ? 'rgba(56,225,255,0.45)' : THEME.colors.border,
            transform: [{ scale }],
          },
          card.unlocked ? glow(THEME.colors.primary, 0.35, 18, 10) : null,
        ]}>
        <View style={[styles_ConstellationCard.art, { width: art, height: 96 }]}>
          <Svg width={art} height={96}>
            {card.unlocked
              ? points.map((p, i) => {
                  if (i === 0) {
                    return null;
                  }
                  const prev = points[i - 1];
                  return (
                    <Line
                      key={'l' + i}
                      x1={(prev[0] / 100) * art}
                      y1={(prev[1] / 100) * 96}
                      x2={(p[0] / 100) * art}
                      y2={(p[1] / 100) * 96}
                      stroke={THEME.colors.signal}
                      strokeOpacity={0.7}
                      strokeWidth={1.5}
                    />
                  );
                })
              : null}
            {points.map((p, i) => (
              <Circle
                key={'c' + i}
                cx={(p[0] / 100) * art}
                cy={(p[1] / 100) * 96}
                r={card.unlocked ? 3 : 2}
                fill={card.unlocked ? THEME.colors.signal : THEME.colors.textTertiary}
                opacity={card.unlocked ? 1 : 0.14}
              />
            ))}
          </Svg>
          {card.unlocked ? null : (
            <Image source={assets.sprite5} style={styles_ConstellationCard.lockedSprite} resizeMode="contain" />
          )}
        </View>

        <Text style={[styles_ConstellationCard.name, { color: card.unlocked ? THEME.colors.textPrimary : color }]}>
          {card.name}
        </Text>

        {card.unlocked ? (
          <Text style={styles_ConstellationCard.flavour}>{card.flavour}</Text>
        ) : (
          <Text style={styles_ConstellationCard.flavour}>
            {card.owned + '/' + FRAGMENTS_PER_CONSTELLATION + ' FRAGMENTS'}
          </Text>
        )}

        <View style={styles_ConstellationCard.dots}>
          {Array.from({ length: FRAGMENTS_PER_CONSTELLATION }, (_, i) => (
            <View
              key={i}
              style={[
                styles_ConstellationCard.dot,
                { backgroundColor: i < card.owned ? THEME.colors.warning : THEME.colors.starEmpty },
              ]}
            />
          ))}
        </View>

        {expanded ? (
          <View style={styles_ConstellationCard.details}>
            <Text style={styles_ConstellationCard.detailLine}>{clearedLabel || 'NOT CLEARED YET'}</Text>
            <Text style={styles_ConstellationCard.detailLine}>{bestLabel || 'NO BEST SIGNAL YET'}</Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

// ------ EmptyState ------
export interface EmptyStateProps {
  text: string;
  icon?: IconName;
}

/** Themed centred message - never a blank area. */
export function EmptyState({ text, icon = 'radio' }: EmptyStateProps) {
  return (
    <View style={styles_EmptyState.root}>
      <View style={styles_EmptyState.iconWrap}>
        <Icon name={icon} size={28} color={THEME.colors.textTertiary} />
      </View>
      <Text style={styles_EmptyState.text}>{text}</Text>
    </View>
  );
}

// ------ FloatingControlBar ------
const HIT_FloatingControlBar = { top: 8, bottom: 8, left: 8, right: 8 };

export interface FloatingControlBarProps {
  charges: number;
  budget: number;
  undosLeft: number;
  ampCharges: number;
  frozen: boolean;
  onUndo: () => void;
  onGo: () => void;
  onAmplify: () => void;
}

export function FloatingControlBar(props: FloatingControlBarProps) {
  const { charges, budget, undosLeft, ampCharges, frozen, onUndo, onGo, onAmplify } = props;

  return (
    <View style={styles_FloatingControlBar.wrap} pointerEvents="box-none">
      <Text style={styles_FloatingControlBar.charges}>
        {'CHARGES '}
        <Text style={charges === 0 ? styles_FloatingControlBar.chargesEmpty : styles_FloatingControlBar.chargesValue}>
          {charges + '/' + budget}
        </Text>
      </Text>

      <View style={styles_FloatingControlBar.bar}>
        <SideButton_FloatingControlBar
          label="UNDO"
          icon="undo"
          onPress={onUndo}
          disabled={undosLeft <= 0}
          tint={THEME.colors.textPrimary}
          badge={undosLeft}
        />

        <View style={styles_FloatingControlBar.center}>
          <RoundActionButton label="GO" onPress={onGo} />
          <Text style={styles_FloatingControlBar.caption}>SEND SIGNAL</Text>
        </View>

        <SideButton_FloatingControlBar
          label="AMPLIFY"
          icon="bolt"
          onPress={onAmplify}
          disabled={ampCharges <= 0}
          tint={frozen ? THEME.colors.signal : THEME.colors.warning}
          badge={ampCharges}
        />
      </View>
    </View>
  );
}

function SideButton_FloatingControlBar({
  label,
  icon,
  onPress,
  disabled,
  tint,
  badge,
}: {
  label: string;
  icon: IconName;
  onPress: () => void;
  disabled: boolean;
  tint: string;
  badge: number;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(!disabled);
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_FloatingControlBar}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles_FloatingControlBar.sidePress, { opacity: disabled ? 0.4 : 1 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_FloatingControlBar.sideShell,
          {
            borderColor: disabled ? 'rgba(255,255,255,0.06)' : THEME.colors.border,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles_FloatingControlBar.sideRow}>
          <Icon name={icon} size={24} color={tint} />
          <Text style={[styles_FloatingControlBar.sideLabel, { color: tint }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
        <Text style={styles_FloatingControlBar.sideBadge}>{badge}</Text>
      </Animated.View>
    </Pressable>
  );
}

// ------ HintChip ------
export interface HintChipProps {
  text: string;
  visible: boolean;
}

/** Explains the GESTURE and its RESULT, long enough to land in a review frame. */
export function HintChip({ text, visible }: HintChipProps) {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    const anim = Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 320,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [opacity, visible]);

  return (
    <Animated.View pointerEvents="none" style={[styles_HintChip.chip, { opacity }]}>
      <Text style={styles_HintChip.text} numberOfLines={1}>
        {text}
      </Text>
    </Animated.View>
  );
}

// ------ Icon ------
export type IconName =
  | 'bolt'
  | 'star'
  | 'grid'
  | 'chart'
  | 'settings'
  | 'back'
  | 'lock'
  | 'undo'
  | 'play'
  | 'pause'
  | 'timer'
  | 'eye'
  | 'palette'
  | 'trash'
  | 'target'
  | 'radio';

const L_Icon = Lucide as unknown as Record<string, React.ComponentType<any>>;

const MAP_Icon: Record<IconName, React.ComponentType<any> | undefined> = {
  bolt: L_Icon.Zap,
  star: L_Icon.Star,
  grid: L_Icon.LayoutGrid,
  chart: L_Icon.BarChart3,
  settings: L_Icon.Settings,
  back: L_Icon.ArrowLeft,
  lock: L_Icon.Lock,
  undo: L_Icon.RotateCcw,
  play: L_Icon.Play,
  pause: L_Icon.Pause,
  timer: L_Icon.Timer,
  eye: L_Icon.Eye,
  palette: L_Icon.Palette,
  trash: L_Icon.Trash2,
  target: L_Icon.Target,
  radio: L_Icon.Radio,
};

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, color = '#F2F5FF', strokeWidth = 2 }: IconProps) {
  const Component = MAP_Icon[name];
  if (!Component) {
    return <View style={{ width: size, height: size }} />;
  }
  return <Component size={size} color={color} strokeWidth={strokeWidth} />;
}

// ------ LevelChip ------
const HIT_LevelChip = { top: 6, bottom: 6, left: 6, right: 6 };

export type LevelChipState = 'locked' | 'open' | 'cleared';

export interface LevelChipProps {
  index: number;
  label: number;
  state: LevelChipState;
  stars: number;
  size: number;
  onPress: (index: number) => void;
}

export function LevelChip({ index, label, state, stars, size, onPress }: LevelChipProps) {
  const locked = state === 'locked';
  const { scale, onPressIn, onPressOut } = usePressScale(!locked);

  const body = (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles_LevelChip.chip,
        {
          width: size,
          height: size,
          borderColor:
            state === 'cleared'
              ? 'rgba(56,225,255,0.45)'
              : locked
              ? 'rgba(255,255,255,0.06)'
              : THEME.colors.border,
          backgroundColor: locked ? THEME.colors.surface : THEME.colors.glass,
          transform: [{ scale }],
        },
      ]}>
      {locked ? null : (
        <Image source={assets.sprite2} style={styles_LevelChip.watermark} resizeMode="contain" />
      )}
      {locked ? (
        <Icon name="lock" size={24} color={THEME.colors.textTertiary} />
      ) : (
        <Text style={styles_LevelChip.number}>{label}</Text>
      )}
      {state === 'cleared' ? (
        <View style={styles_LevelChip.stars}>
          <StarRow earned={stars} total={3} size={12} />
        </View>
      ) : null}
    </Animated.View>
  );

  if (locked) {
    return <View style={{ width: size, height: size }}>{body}</View>;
  }

  return (
    <Pressable
      onPress={() => onPress(index)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_LevelChip}
      accessibilityRole="button"
      accessibilityLabel={'LEVEL ' + label}
      style={{ width: size, height: size }}>
      {body}
    </Pressable>
  );
}

// ------ NodeTile ------
const HIT_NodeTile = { top: 2, bottom: 2, left: 2, right: 2 };
const PORT_W_NodeTile = 4;

export interface NodeTileProps {
  id: number;
  kind: NodeKind;
  baseMask: number;
  rotation: number;
  tile: number;
  energised: boolean;
  flaring: boolean;
  rotatable: boolean;
  guide: boolean;
  portColor: string;
  portDarkColor: string;
  reducedMotion: boolean;
  onPress: (id: number) => void;
}

function NodeTileBase_NodeTile(props: NodeTileProps) {
  const {
    id,
    kind,
    baseMask,
    rotation,
    tile,
    energised,
    flaring,
    rotatable,
    guide,
    portColor,
    portDarkColor,
    reducedMotion,
    onPress,
  } = props;

  const inner = tile - 6;
  const half = inner / 2;
  const spin = useRef(new Animated.Value(rotation * 90)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.spring(spin, {
      toValue: rotation * 90,
      tension: ROTATE_TENSION,
      friction: ROTATE_FRICTION,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [rotation, spin]);

  useEffect(() => {
    const shouldPulse = (kind === 'beacon' || flaring) && !reducedMotion;
    if (!shouldPulse) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: flaring ? 1.12 : 1.06,
          duration: flaring ? 420 : 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: flaring ? 420 : 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [flaring, kind, pulse, reducedMotion]);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      tension: PRESS_TENSION,
      friction: PRESS_FRICTION,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      tension: PRESS_TENSION,
      friction: PRESS_FRICTION,
      useNativeDriver: true,
    }).start();
  };

  const deg = spin.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
  const stroke = energised ? portColor : portDarkColor;
  const spriteSize = Math.round(inner * (kind === 'relay' ? 0.62 : 0.56));

  const borderColor = flaring
    ? THEME.colors.danger
    : kind === 'hazard'
    ? 'rgba(255,59,92,0.35)'
    : energised
    ? portColor + '88'
    : guide && rotatable
    ? 'rgba(56,225,255,0.28)'
    : THEME.colors.hairline;

  const body = (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles_NodeTile.inner,
        {
          width: inner,
          height: inner,
          borderColor,
          backgroundColor:
            kind === 'hazard'
              ? 'rgba(255,59,92,0.08)'
              : energised
              ? 'rgba(56,225,255,0.10)'
              : THEME.colors.surfaceElevated,
          transform: [{ scale: Animated.multiply(scale, pulse) }],
        },
      ]}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { transform: [{ rotate: deg }] }]}>
        {(baseMask & N) !== 0 ? (
          <View
            style={[
              styles_NodeTile.port,
              { left: half - PORT_W_NodeTile / 2, top: 0, width: PORT_W_NodeTile, height: half, backgroundColor: stroke },
            ]}
          />
        ) : null}
        {(baseMask & S) !== 0 ? (
          <View
            style={[
              styles_NodeTile.port,
              { left: half - PORT_W_NodeTile / 2, top: half, width: PORT_W_NodeTile, height: half, backgroundColor: stroke },
            ]}
          />
        ) : null}
        {(baseMask & W) !== 0 ? (
          <View
            style={[
              styles_NodeTile.port,
              { top: half - PORT_W_NodeTile / 2, left: 0, height: PORT_W_NodeTile, width: half, backgroundColor: stroke },
            ]}
          />
        ) : null}
        {(baseMask & E) !== 0 ? (
          <View
            style={[
              styles_NodeTile.port,
              { top: half - PORT_W_NodeTile / 2, left: half, height: PORT_W_NodeTile, width: half, backgroundColor: stroke },
            ]}
          />
        ) : null}
      </Animated.View>

      <View
        style={[
          styles_NodeTile.hub,
          {
            width: spriteSize + 8,
            height: spriteSize + 8,
            borderRadius: (spriteSize + 8) / 2,
            backgroundColor: energised ? portColor + '22' : 'rgba(5,5,16,0.75)',
          },
        ]}>
        <Image
          source={NODE_SPRITE[kind]}
          style={{
            width: spriteSize,
            height: spriteSize,
            opacity: kind === 'satellite' && !energised ? 0.45 : 1,
          }}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );

  if (!rotatable) {
    return (
      <View style={[styles_NodeTile.cell, { width: tile, height: tile }]} pointerEvents="none">
        {body}
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => onPress(id)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_NodeTile}
      accessibilityRole="button"
      accessibilityLabel={'ROTATE NODE ' + (id + 1)}
      style={[styles_NodeTile.cell, { width: tile, height: tile }]}>
      {body}
    </Pressable>
  );
}


export const NodeTile = memo(NodeTileBase_NodeTile);

// ------ OrbitBoard ------
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;

export function boardTileSize(maxWidth: number, availableHeight: number, cols: number, rows: number) {
  const byWidth = Math.floor((maxWidth - 2 * BOARD_FRAME) / cols);
  const byHeight = Math.floor((availableHeight - 2 * BOARD_FRAME) / rows);
  return Math.max(36, Math.min(byWidth, byHeight));
}

export interface OrbitBoardProps {
  grid: Grid;
  rotations: number[];
  routing: Routing;
  tile: number;
  palette: BeamPalette;
  flaringId: number;
  surgeNonce: number;
  showGuides: boolean;
  reducedMotion: boolean;
  onRotate: (id: number) => void;
}

/** Layered plate: starfield blobs -> plate surface -> tiles -> beam overlay. */
export function OrbitBoard(props: OrbitBoardProps) {
  const {
    grid,
    rotations,
    routing,
    tile,
    palette,
    flaringId,
    surgeNonce,
    showGuides,
    reducedMotion,
    onRotate,
  } = props;

  const colors = beamColors(palette);
  const width = tile * grid.cols + 2 * BOARD_FRAME;
  const height = tile * grid.rows + 2 * BOARD_FRAME;

  const shake = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (surgeNonce === 0) {
      return;
    }
    const seq = Animated.parallel([
      Animated.sequence([
        Animated.timing(flash, { toValue: 1, duration: 90, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 0, duration: 190, useNativeDriver: true }),
      ]),
      reducedMotion
        ? Animated.delay(0)
        : Animated.sequence([
            Animated.timing(shake, { toValue: 1, duration: 45, useNativeDriver: true }),
            Animated.timing(shake, { toValue: -1, duration: 45, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 1, duration: 45, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 0, duration: 45, useNativeDriver: true }),
          ]),
    ]);
    seq.start();
    return () => seq.stop();
  }, [flash, reducedMotion, shake, surgeNonce]);

  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-4, 4] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles_OrbitBoard.plate,
        { width, height, padding: BOARD_PAD, transform: [{ translateX }] },
        glow('#050510', 0.6, 18, 14),
      ]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <Svg width={width} height={height}>
          <Ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width * 0.42}
            ry={height * 0.34}
            stroke={THEME.colors.primary}
            strokeOpacity={0.18}
            strokeWidth={1.5}
            strokeDasharray="8 14"
            fill="none"
          />
          <Ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width * 0.28}
            ry={height * 0.46}
            stroke={THEME.colors.secondary}
            strokeOpacity={0.14}
            strokeWidth={1.5}
            strokeDasharray="6 12"
            fill="none"
          />
        </Svg>
      </View>

      <View style={styles_OrbitBoard.rows} pointerEvents="box-none">
        {Array.from({ length: grid.rows }, (_, row) => (
          <View key={row} style={styles_OrbitBoard.row} pointerEvents="box-none">
            {Array.from({ length: grid.cols }, (_, col) => {
              const id = row * grid.cols + col;
              const cell = grid.cells[id];
              return (
                <NodeTile
                  key={id}
                  id={id}
                  kind={cell.kind}
                  baseMask={cell.baseMask}
                  rotation={rotations[id]}
                  tile={tile}
                  energised={routing.energised[id]}
                  flaring={flaringId === id}
                  rotatable={cell.rotatable}
                  guide={showGuides}
                  portColor={colors.port}
                  portDarkColor={colors.portDark}
                  reducedMotion={reducedMotion}
                  onPress={onRotate}
                />
              );
            })}
          </View>
        ))}
      </View>

      <BeamLayer
        edges={routing.edges}
        cols={grid.cols}
        tile={tile}
        frame={BOARD_FRAME}
        width={width}
        height={height}
        beam={colors.beam}
        under={colors.under}
        beaconId={grid.beaconId}
        pulseKey={routing.edges.length * 31 + routing.linked.length}
        reducedMotion={reducedMotion}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          styles_OrbitBoard.flash,
          { opacity: flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.9] }) },
        ]}
      />
    </Animated.View>
  );
}

// ------ PauseOverlay ------
export interface PauseOverlayProps {
  onResume: () => void;
  onMenu: () => void;
  linked: number;
  satellites: number;
}

export function PauseOverlay({ onResume, onMenu, linked, satellites }: PauseOverlayProps) {
  return (
    <View style={styles_PauseOverlay.root}>
      <View style={styles_PauseOverlay.card}>
        <Text style={styles_PauseOverlay.title}>SIGNAL PAUSED</Text>
        <Text style={styles_PauseOverlay.note}>
          {'THE SIGNAL WINDOW AND THE FLARE SCHEDULE ARE HELD'}
        </Text>
        <Text style={styles_PauseOverlay.linked}>{'LINKED ' + linked + '/' + satellites}</Text>
        <View style={styles_PauseOverlay.buttons}>
          <PrimaryButton label="RESUME" onPress={onResume} icon="play" height={56} />
          <SecondaryButton label="MENU" onPress={onMenu} icon="back" height={48} />
        </View>
      </View>
    </View>
  );
}

// ------ PrimaryButton ------
export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: IconName;
  height?: number;
  width?: DimensionValue;
  colors?: string[];
  disabled?: boolean;
  accessibilityLabel?: string;
}

const HIT_PrimaryButton = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * Pressable is the PARENT, the Animated.View is the CHILD - the only press
 * pattern that keeps onPress alive in an Android release build.
 */
export function PrimaryButton({
  label,
  onPress,
  icon,
  height = 56,
  width = '100%',
  colors,
  disabled = false,
  accessibilityLabel,
}: PrimaryButtonProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(!disabled);
  const palette = colors || THEME.gradients.primary;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_PrimaryButton}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={[styles_PrimaryButton.press, { width, height, opacity: disabled ? 0.45 : 1 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_PrimaryButton.shell,
          { height, borderRadius: THEME.radius.lg, transform: [{ scale }] },
          glow(palette[0], disabled ? 0 : 0.45, 22, disabled ? 0 : 12),
        ]}>
        <Image
          source={assets.buttonRect}
          style={[StyleSheet.absoluteFillObject, { borderRadius: THEME.radius.lg }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={palette}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: THEME.radius.lg, opacity: 0.92 }]}
        />
        <View style={styles_PrimaryButton.row}>
          {icon ? <Icon name={icon} size={24} color="#FFFFFF" /> : null}
          <Text style={styles_PrimaryButton.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ------ RoundActionButton ------
const HIT_RoundActionButton = { top: 8, bottom: 8, left: 8, right: 8 };
const SIZE_RoundActionButton = 72;

export interface RoundActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

/** The GO button: plain uppercase text, never an icon-only primary action. */
export function RoundActionButton({ label, onPress, disabled = false }: RoundActionButtonProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(!disabled);
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_RoundActionButton}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles_RoundActionButton.press, { opacity: disabled ? 0.45 : 1 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles_RoundActionButton.shell, { transform: [{ scale }] }, glow(THEME.colors.primary, 0.5, 22, 14)]}>
        <Image source={assets.buttonRound} style={styles_RoundActionButton.plate} resizeMode="contain" />
        <LinearGradient
          colors={THEME.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles_RoundActionButton.tint}
        />
        <Text style={styles_RoundActionButton.label}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

// ------ ScreenBackground ------
export interface ScreenBackgroundProps {
  overlay: string[];
  drift?: boolean;
  stars?: boolean;
  blobs?: Array<{ color: string; size: number; top: number; left: number; opacity: number }>;
  children: React.ReactNode;
}

/**
 * bg_game is the ONLY background image in the app. Screens are told apart by
 * their gradient overlay (the loader runs at 0.9+ so it never reads as Menu).
 */
export function ScreenBackground({
  overlay,
  drift = true,
  stars = true,
  blobs,
  children,
}: ScreenBackgroundProps) {
  const { width, height } = useWindowDimensions();
  return (
    <ImageBackground source={assets.bgGame} style={styles_ScreenBackground.root} resizeMode="cover">
      <LinearGradient
        colors={overlay}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {blobs
        ? blobs.map((blob, i) => (
            <View
              key={i}
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: blob.top,
                left: blob.left,
                width: blob.size,
                height: blob.size,
                borderRadius: blob.size / 2,
                backgroundColor: blob.color,
                opacity: blob.opacity,
              }}
            />
          ))
        : null}
      {stars ? (
        <StarField width={width} height={height} drift={drift} color={THEME.colors.textPrimary} />
      ) : null}
      <View style={styles_ScreenBackground.content}>{children}</View>
    </ImageBackground>
  );
}

// ------ ScreenHeader ------
const HIT_ScreenHeader = { top: 8, bottom: 8, left: 8, right: 8 };

export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  backLabel?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  /** replaces the centred title (used by the Game screen timer ring) */
  centerSlot?: React.ReactNode;
  /** adds the bottom hairline + surface used on the Game screen */
  framed?: boolean;
}

/** ONE header for every screen (Menu, Levels, Game, Result, Collection, Progress, Settings). */
export function ScreenHeader({
  title,
  onBack,
  backLabel = 'MENU',
  leftSlot,
  rightSlot,
  centerSlot,
  framed = false,
}: ScreenHeaderProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);

  return (
    <View style={[styles_ScreenHeader.root, framed ? styles_ScreenHeader.framed : null]}>
      <View style={styles_ScreenHeader.side}>
        {leftSlot ? (
          leftSlot
        ) : onBack ? (
          <Pressable
            onPress={onBack}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            hitSlop={HIT_ScreenHeader}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            style={styles_ScreenHeader.backPress}>
            <Animated.View pointerEvents="box-none" style={[styles_ScreenHeader.backShell, { transform: [{ scale }] }]}>
              <View style={styles_ScreenHeader.row}>
                <Icon name="back" size={24} color={THEME.colors.signal} />
                <Text style={styles_ScreenHeader.backLabel}>{backLabel}</Text>
              </View>
            </Animated.View>
          </Pressable>
        ) : null}
      </View>

      {centerSlot ? (
        <View style={styles_ScreenHeader.center}>{centerSlot}</View>
      ) : (
        <Text style={styles_ScreenHeader.title} numberOfLines={1}>
          {title}
        </Text>
      )}

      <View style={[styles_ScreenHeader.side, styles_ScreenHeader.sideRight]}>{rightSlot}</View>
    </View>
  );
}

/** The standard right slot: a home glyph that goes back to Menu. */
export function HomeSlot({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_ScreenHeader}
      accessibilityRole="button"
      accessibilityLabel="HOME"
      style={styles_ScreenHeader.homePress}>
      <Animated.View pointerEvents="box-none" style={[styles_ScreenHeader.homeShell, { transform: [{ scale }] }]}>
        <Image source={assets.iconHome} style={styles_ScreenHeader.homeIcon} resizeMode="contain" />
      </Animated.View>
    </Pressable>
  );
}

// ------ SecondaryButton ------
export interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: IconName;
  height?: number;
  width?: DimensionValue;
  tint?: string;
  disabled?: boolean;
}

const HIT_SecondaryButton = { top: 8, bottom: 8, left: 8, right: 8 };

export function SecondaryButton({
  label,
  onPress,
  icon,
  height = 48,
  width = '100%',
  tint = THEME.colors.textPrimary,
  disabled = false,
}: SecondaryButtonProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(!disabled);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_SecondaryButton}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles_SecondaryButton.press, { width, height, opacity: disabled ? 0.4 : 1 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_SecondaryButton.shell,
          {
            height,
            borderColor: disabled ? 'rgba(255,255,255,0.06)' : THEME.colors.border,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles_SecondaryButton.row}>
          {icon ? <Icon name={icon} size={24} color={tint} /> : null}
          <Text style={[styles_SecondaryButton.label, { color: tint }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ------ SectorTabs ------
const HIT_SectorTabs = { top: 8, bottom: 8, left: 8, right: 8 };

export interface SectorTabsProps {
  active: number;
  onSelect: (index: number) => void;
}

export function SectorTabs({ active, onSelect }: SectorTabsProps) {
  return (
    <View style={styles_SectorTabs.row}>
      {SECTORS.map(sector => (
        <Tab_SectorTabs
          key={sector.index}
          label={sector.name}
          active={sector.index === active}
          onPress={() => onSelect(sector.index)}
        />
      ))}
    </View>
  );
}

function Tab_SectorTabs({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SectorTabs}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles_SectorTabs.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_SectorTabs.chip,
          {
            borderColor: active ? THEME.colors.signal : THEME.colors.border,
            backgroundColor: active ? 'rgba(56,225,255,0.12)' : THEME.colors.glass,
            transform: [{ scale }],
          },
        ]}>
        <Text
          style={[
            styles_SectorTabs.label,
            { color: active ? THEME.colors.signal : THEME.colors.textSecondary },
          ]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ------ SettingsRow ------
const HIT_SettingsRow = { top: 8, bottom: 8, left: 8, right: 8 };

export interface SettingsRowProps {
  icon: IconName;
  label: string;
  note?: string;
  danger?: boolean;
  /** puts the control on its own line under the label (wide segmented controls) */
  stacked?: boolean;
  children: React.ReactNode;
}

export function SettingsRow({ icon, label, note, danger, stacked, children }: SettingsRowProps) {
  return (
    <View
      style={[
        styles_SettingsRow.row,
        stacked ? styles_SettingsRow.rowStacked : null,
        danger ? { borderColor: 'rgba(255,59,92,0.4)' } : null,
      ]}>
      <View style={[styles_SettingsRow.left, stacked ? styles_SettingsRow.leftStacked : null]}>
        <View style={styles_SettingsRow.iconWrap}>
          <Icon
            name={icon}
            size={24}
            color={danger ? THEME.colors.danger : THEME.colors.signal}
          />
        </View>
        <View style={styles_SettingsRow.texts}>
          <Text style={styles_SettingsRow.label} numberOfLines={1}>
            {label}
          </Text>
          {note ? (
            <Text style={styles_SettingsRow.note} numberOfLines={2}>
              {note}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={[styles_SettingsRow.control, stacked ? styles_SettingsRow.controlStacked : null]}>{children}</View>
    </View>
  );
}

export interface SegmentedProps {
  options: Array<{ id: string; label: string }>;
  value: string;
  onSelect: (id: string) => void;
}

export function Segmented({ options, value, onSelect }: SegmentedProps) {
  return (
    <View style={styles_SettingsRow.segments}>
      {options.map(option => (
        <Segment_SettingsRow
          key={option.id}
          label={option.label}
          active={option.id === value}
          onPress={() => onSelect(option.id)}
        />
      ))}
    </View>
  );
}

function Segment_SettingsRow({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SettingsRow}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles_SettingsRow.segmentPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_SettingsRow.segment,
          {
            borderColor: active ? THEME.colors.signal : THEME.colors.border,
            backgroundColor: active ? 'rgba(56,225,255,0.12)' : 'transparent',
            transform: [{ scale }],
          },
        ]}>
        <Text
          style={[
            styles_SettingsRow.segmentLabel,
            { color: active ? THEME.colors.signal : THEME.colors.textSecondary },
          ]}
          numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export interface ToggleProps {
  value: boolean;
  onToggle: () => void;
  labelOn?: string;
  labelOff?: string;
}

export function Toggle({ value, onToggle, labelOn = 'ON', labelOff = 'OFF' }: ToggleProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  return (
    <Pressable
      onPress={onToggle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SettingsRow}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={value ? labelOn : labelOff}
      style={styles_SettingsRow.togglePress}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_SettingsRow.toggle,
          {
            borderColor: value ? THEME.colors.signal : THEME.colors.border,
            backgroundColor: value ? 'rgba(56,225,255,0.14)' : THEME.colors.glass,
            transform: [{ scale }],
          },
        ]}>
        <Text
          style={[
            styles_SettingsRow.toggleLabel,
            { color: value ? THEME.colors.signal : THEME.colors.textTertiary },
          ]}>
          {value ? labelOn : labelOff}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ------ SignalMeter ------
export interface SignalMeterProps {
  stability: number;
  width?: number;
}

export function SignalMeter({ stability, width = 86 }: SignalMeterProps) {
  const value = clamp(stability, 0, 100);
  const danger = value <= 34;
  return (
    <View style={styles_SignalMeter.root}>
      <View style={[styles_SignalMeter.track, { width }]}>
        <LinearGradient
          colors={danger ? THEME.gradients.danger : THEME.gradients.beam}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: (width * value) / 100, height: 8, borderRadius: 4 }}
        />
      </View>
      <Text style={[styles_SignalMeter.label, danger ? { color: THEME.colors.danger } : null]}>
        {'STAB ' + Math.round(value) + '%'}
      </Text>
    </View>
  );
}

// ------ StarField ------
const STARS_StarField: Array<[number, number, number, number]> = [
  [4, 6, 1.4, 0.6], [12, 18, 0.9, 0.35], [21, 9, 1.8, 0.75], [30, 22, 1.1, 0.4],
  [38, 5, 2.0, 0.8], [46, 16, 0.8, 0.3], [55, 11, 1.5, 0.55], [63, 25, 1.0, 0.35],
  [71, 7, 1.9, 0.7], [80, 20, 1.2, 0.45], [88, 13, 0.9, 0.3], [95, 27, 1.6, 0.6],
  [7, 34, 1.3, 0.5], [16, 45, 0.8, 0.28], [25, 38, 2.2, 0.8], [34, 50, 1.0, 0.35],
  [43, 41, 1.4, 0.5], [52, 54, 0.9, 0.3], [60, 36, 1.7, 0.65], [69, 48, 1.1, 0.4],
  [77, 43, 0.8, 0.26], [86, 56, 1.5, 0.55], [93, 39, 1.2, 0.45], [3, 62, 1.0, 0.33],
  [14, 71, 1.8, 0.7], [23, 66, 0.9, 0.3], [33, 79, 1.3, 0.48], [41, 68, 2.0, 0.75],
  [50, 83, 1.1, 0.38], [59, 74, 0.8, 0.25], [68, 88, 1.6, 0.6], [76, 70, 1.2, 0.42],
  [85, 85, 0.9, 0.3], [94, 77, 1.9, 0.72],
];

export interface StarFieldProps {
  color?: string;
  drift?: boolean;
  width: number;
  height: number;
}

export function StarField({ color = '#FFF8DC', drift = true, width, height }: StarFieldProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!drift) {
      translateY.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { transform: [{ translateY }] }]}>
      <Svg width={width} height={height}>
        {STARS_StarField.map((star, i) => (
          <Circle
            key={i}
            cx={(star[0] / 100) * width}
            cy={(star[1] / 100) * height}
            r={star[2]}
            fill={color}
            opacity={star[3]}
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

// ------ StarRow ------
export interface StarRowProps {
  earned: number;
  total?: number;
  size?: number;
  animated?: boolean;
}

/** Star glyph is on the safe list, so no tofu risk. */
export function StarRow({ earned, total = 3, size = 18, animated = false }: StarRowProps) {
  return (
    <View style={styles_StarRow.row}>
      {Array.from({ length: total }, (_, i) => (
        <Star_StarRow key={i} index={i} on={i < earned} size={size} animated={animated} />
      ))}
    </View>
  );
}

function Star_StarRow({
  index,
  on,
  size,
  animated,
}: {
  index: number;
  on: boolean;
  size: number;
  animated: boolean;
}) {
  const scale = useRef(new Animated.Value(animated && on ? 0.3 : 1)).current;

  useEffect(() => {
    if (!animated || !on) {
      return;
    }
    const anim = Animated.spring(scale, {
      toValue: 1,
      delay: index * 160,
      tension: ENTRANCE_TENSION,
      friction: ENTRANCE_FRICTION,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [animated, index, on, scale]);

  return (
    <Animated.Text
      style={[
        styles_StarRow.star,
        {
          fontSize: size,
          lineHeight: size + 4,
          color: on ? THEME.colors.warning : THEME.colors.starEmpty,
          transform: [{ scale }],
        },
      ]}>
      {'★'}
    </Animated.Text>
  );
}

// ------ StatCard ------
export interface StatCardProps {
  value?: number | string | null;
  label: string;
  accent: string;
  /** hide the card entirely when the value is empty or zero */
  hideWhenEmpty?: boolean;
}

/**
 * ONE icon shape for every pill in a row - the pills are told apart by their
 * accent colour, their number and their label, never by a different sprite.
 * Renders null instead of an empty rounded box.
 */
export function StatCard({ value, label, accent, hideWhenEmpty = true }: StatCardProps) {
  const empty =
    value === null ||
    value === undefined ||
    value === '' ||
    (typeof value === 'number' && value === 0);
  if (empty && hideWhenEmpty) {
    return null;
  }

  return (
    <View style={[styles_StatCard.card, { borderColor: accent + '44' }]}>
      <View style={[styles_StatCard.iconWrap, { backgroundColor: accent + '22' }]}>
        <Icon name="bolt" size={28} color={accent} />
      </View>
      <Text style={[styles_StatCard.value, { color: accent }]} numberOfLines={1}>
        {String(value)}
      </Text>
      <Text style={styles_StatCard.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

/** Renders the row only when at least two pills survive the empty check. */
export function StatRow({ children }: { children: React.ReactNode }) {
  const visible = React.Children.toArray(children).filter(Boolean);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles_StatCard.row}>
      {visible.map((child, i) => (
        <View key={i} style={styles_StatCard.slot}>
          {child}
        </View>
      ))}
    </View>
  );
}

// ------ TimerRing ------
export interface TimerRingProps {
  secondsLeft: number;
  total: number;
  frozen?: boolean;
}

const SIZE_TimerRing = 44;
const R_TimerRing = 19;
const C_TimerRing = 2 * Math.PI * R_TimerRing;

export function TimerRing({ secondsLeft, total, frozen = false }: TimerRingProps) {
  const ratio = total > 0 ? Math.max(0, Math.min(1, secondsLeft / total)) : 0;
  const color = frozen
    ? THEME.colors.primary
    : ratio < 0.15
    ? THEME.colors.danger
    : ratio < 0.3
    ? THEME.colors.warning
    : THEME.colors.signal;

  return (
    <View style={styles_TimerRing.root}>
      <Svg width={SIZE_TimerRing} height={SIZE_TimerRing}>
        <Circle
          cx={SIZE_TimerRing / 2}
          cy={SIZE_TimerRing / 2}
          r={R_TimerRing}
          stroke={THEME.colors.surfaceElevated}
          strokeWidth={4}
          fill="none"
        />
        <Circle
          cx={SIZE_TimerRing / 2}
          cy={SIZE_TimerRing / 2}
          r={R_TimerRing}
          stroke={color}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={C_TimerRing}
          strokeDashoffset={C_TimerRing * (1 - ratio)}
          transform={'rotate(-90 ' + SIZE_TimerRing / 2 + ' ' + SIZE_TimerRing / 2 + ')'}
        />
      </Svg>
      <View style={styles_TimerRing.center} pointerEvents="none">
        <Text style={[styles_TimerRing.value, { color }]}>{Math.max(0, Math.ceil(secondsLeft))}</Text>
      </View>
    </View>
  );
}

// ------ useOrbitBoard ------
const TICK_MS_useOrbitBoard = 100;

export interface UseOrbitBoardOptions {
  levelIndex: number;
  /** attempt counter - shifts the generator seed so a retry looks different */
  attempt: number;
  seconds: number;
  onFinish: (run: RunResult) => void;
}

/**
 * Owns one round: the plate, the signal clock, the flare schedule and every
 * resource. Every timer is started from an effect and cleared on unmount, and
 * every callback reads live data from refs instead of a stale closure.
 */
export function useOrbitBoard(options: UseOrbitBoardOptions) {
  const { levelIndex, attempt, seconds, onFinish } = options;

  const grid = useMemo(() => generateLevel(levelIndex, attempt), [attempt, levelIndex]);
  const budget = grid.optimalRotations + CHARGE_BONUS;

  const [rotations, setRotations] = useState<number[]>(() => startRotations(grid));
  const [charges, setCharges] = useState(budget);
  const [undosLeft, setUndosLeft] = useState(UNDO_LIMIT);
  const [stability, setStability] = useState(STABILITY_START);
  const [surges, setSurges] = useState(0);
  const [ampCharges, setAmpCharges] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [surgeNonce, setSurgeNonce] = useState(0);
  const [flare, setFlare] = useState<FlareState>(() => initialFlare());
  const [over, setOver] = useState(false);

  const rotationsRef = useRef(rotations);
  rotationsRef.current = rotations;
  const stabilityRef = useRef(stability);
  stabilityRef.current = stability;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const overRef = useRef(over);
  overRef.current = over;
  const flareRef = useRef(flare);
  flareRef.current = flare;

  const remainingMsRef = useRef(seconds * 1000);
  const freezeUntilRef = useRef(0);
  const undoStackRef = useRef<number[]>([]);
  const collectedAmpsRef = useRef<number[]>([]);
  const surgesRef = useRef(0);
  const chargesRef = useRef(budget);
  chargesRef.current = charges;
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const finishedRef = useRef(false);

  const routing = useMemo(() => solveRouting(grid, rotations), [grid, rotations]);
  const linkedCount = routing.linked.length;
  const solved = allLinked(grid, routing);

  const finish = useCallback(
    (outcome: Outcome) => {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      setOver(true);
      overRef.current = true;
      const current = solveRouting(grid, rotationsRef.current);
      const run = buildResult({
        levelIndex,
        outcome,
        timeLeft: Math.max(0, remainingMsRef.current / 1000),
        stability: Math.max(0, stabilityRef.current),
        chargesLeft: Math.max(0, chargesRef.current),
        amplifiersLit: collectedAmpsRef.current.length,
        surges: surgesRef.current,
        linked: current.linked.length,
        satellites: grid.satelliteIds.length,
      });
      onFinish(run);
    },
    [grid, levelIndex, onFinish],
  );

  const spendStability = useCallback(
    (cost: number) => {
      const next = Math.max(0, stabilityRef.current - cost);
      stabilityRef.current = next;
      setStability(next);
      if (next <= 0) {
        finish('overload');
      }
      return next;
    },
    [finish],
  );

  const fireSurge = useCallback(
    (offenders: number[]) => {
      surgesRef.current += 1;
      setSurges(surgesRef.current);
      setSurgeNonce(n => n + 1);
      const target = offenders.length > 0 ? offenders[0] : -1;
      if (target >= 0 && grid.cells[target].rotatable) {
        const t = setTimeout(() => {
          setRotations(prev => {
            const next = prev.slice();
            next[target] = (next[target] + 3) % 4;
            rotationsRef.current = next;
            return next;
          });
        }, SURGE_REVERT_MS);
        timeoutsRef.current.push(t);
      }
      spendStability(SURGE_COST);
    },
    [grid, spendStability],
  );

  const collectAmplifiers = useCallback(
    (nextRotations: number[]) => {
      const lit = litAmplifiers(grid, solveRouting(grid, nextRotations));
      let gained = 0;
      for (let i = 0; i < lit.length; i++) {
        if (collectedAmpsRef.current.indexOf(lit[i]) === -1) {
          collectedAmpsRef.current.push(lit[i]);
          gained += 1;
        }
      }
      if (gained > 0) {
        setAmpCharges(c => c + gained);
      }
    },
    [grid],
  );

  const rotate = useCallback(
    (id: number) => {
      if (overRef.current || pausedRef.current) {
        return;
      }
      const cell = grid.cells[id];
      if (!cell || !cell.rotatable) {
        return;
      }
      const next = rotationsRef.current.slice();
      next[id] = (next[id] + 1) % 4;
      rotationsRef.current = next;
      undoStackRef.current.push(id);
      setRotations(next);

      if (chargesRef.current > 0) {
        chargesRef.current -= 1;
        setCharges(chargesRef.current);
      } else {
        spendStability(OVERRIDE_COST);
      }

      collectAmplifiers(next);

      const result = solveRouting(grid, next);
      if (result.breaches.length > 0) {
        fireSurge(result.breaches.indexOf(id) >= 0 ? [id] : result.breaches);
      }
    },
    [collectAmplifiers, fireSurge, grid, spendStability],
  );

  const undo = useCallback(() => {
    if (overRef.current || pausedRef.current || undosLeft <= 0) {
      return;
    }
    const id = undoStackRef.current.pop();
    if (id === undefined) {
      return;
    }
    const next = rotationsRef.current.slice();
    next[id] = (next[id] + 3) % 4;
    rotationsRef.current = next;
    setRotations(next);
    setUndosLeft(n => Math.max(0, n - 1));
    chargesRef.current += 1;
    setCharges(chargesRef.current);
  }, [undosLeft]);

  const go = useCallback(() => {
    if (overRef.current || pausedRef.current) {
      return;
    }
    const result = solveRouting(grid, rotationsRef.current);
    if (allLinked(grid, result)) {
      finish('win');
      return;
    }
    spendStability(GO_FAIL_COST);
  }, [finish, grid, spendStability]);

  const amplify = useCallback(() => {
    if (overRef.current || pausedRef.current || ampCharges <= 0) {
      return;
    }
    setAmpCharges(c => Math.max(0, c - 1));
    freezeUntilRef.current = Date.now() + AMPLIFY_FREEZE_MS;
    setFrozen(true);
  }, [ampCharges]);

  // one clock drives the countdown, the freeze window and the flare schedule
  useEffect(() => {
    const interval = setInterval(() => {
      if (overRef.current || pausedRef.current) {
        return;
      }
      const isFrozen = Date.now() < freezeUntilRef.current;
      if (!isFrozen) {
        remainingMsRef.current = Math.max(0, remainingMsRef.current - TICK_MS_useOrbitBoard);
      }
      setFrozen(prev => (prev === isFrozen ? prev : isFrozen));

      const whole = Math.ceil(remainingMsRef.current / 1000);
      setSecondsLeft(prev => (prev === whole ? prev : whole));

      const step = advanceFlare(grid, flareRef.current, TICK_MS_useOrbitBoard);
      if (step.next !== flareRef.current) {
        flareRef.current = step.next;
        setFlare(step.next);
      }
      if (step.ignited >= 0) {
        const current = solveRouting(grid, rotationsRef.current);
        const hit = flareBreaches(grid, current, step.ignited);
        if (hit.length > 0) {
          fireSurge(hit);
        }
      }

      if (remainingMsRef.current <= 0) {
        finish('timeout');
      }
    }, TICK_MS_useOrbitBoard);
    return () => clearInterval(interval);
  }, [finish, fireSurge, grid]);

  useEffect(() => {
    const pending = timeoutsRef.current;
    return () => {
      for (let i = 0; i < pending.length; i++) {
        clearTimeout(pending[i]);
      }
      pending.length = 0;
    };
  }, []);

  return {
    grid,
    rotations,
    routing,
    linkedCount,
    solved,
    charges,
    budget,
    undosLeft,
    stability,
    surges,
    ampCharges,
    secondsLeft,
    totalSeconds: seconds,
    paused,
    frozen,
    surgeNonce,
    flaringId: flare.activeId,
    over,
    rotate,
    undo,
    go,
    amplify,
    setPaused,
  };
}

// ------ usePersistentProgress ------
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

// ------ usePressScale ------
export function usePressScale(enabled = true, pressed = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    if (!enabled) {
      return;
    }
    Animated.spring(scale, {
      toValue: pressed,
      tension: PRESS_TENSION,
      friction: PRESS_FRICTION,
      useNativeDriver: true,
    }).start();
  }, [enabled, pressed, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: PRESS_TENSION,
      friction: PRESS_FRICTION,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

// ------ format ------
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return value < min ? min : value > max ? max : value;
}

/** 1740 -> "1,740" */
export function formatScore(value: number): string {
  const safe = Number.isFinite(value) ? Math.round(value) : 0;
  return String(safe).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 42.4 -> "42s" */
export function formatSeconds(value: number): string {
  return Math.max(0, Math.ceil(value)) + 's';
}

/** 83.2 -> "83%" */
export function formatPercent(value: number): string {
  return Math.round(clamp(value, 0, 100)) + '%';
}

/* autopad-begin */
function otimidu(_eweqayasuxak: boolean, _iruvawiyelis: string): void {
  const ojatulu: number = 214;
}
function ifatokeru(_ixedofomavi: number, _qodolejoqogu: string, _cukapamica: string): number {
  const javifoxot: number = 72;
  return javifoxot;
}
function jedediroti(_unayuluqeta: boolean, _ewonotifuye: boolean, _oxujecavilaw: number): boolean {
  const isamej = 78;
  return isamej > 35 ? true : true;
}
function ukewuyozak(_awezecimoni: string, _anakaxiyaw: string, _ajajinayete: number): boolean {
  return false;
}
function digasupe(_ibunijicezak: number): number {
  const cerexakiv: number = 29;
  return cerexakiv;
}
function eliwusu(_povetatageci: string, _rubigerotu: boolean): number { return 189; }
function pajocuc(_ikeraco: boolean, _xapire: number): boolean {
  const wojuvalev = 99;
  const toxuwaxa: boolean = false;
  return toxuwaxa;
}
function apofepozu(_ovegerot: number, _usawenucaquv: boolean, _kaderukiwedu: boolean): boolean {
  const dafokabamor = 54;
  return dafokabamor > 89 ? false : true;
}
function ekigexaremo(): string { return "ezaker"; }
function zonigu(_rofune: number, _avomubapa: string): number {
  const kinavamiqam = 95;
  const ucodoz: number = 138;
  return ucodoz;
}
function ijofukogat(_towukepu: boolean, _awajam: boolean, _legucuneve: number): void {
  const oliwoveli: number = 179;
}
function axagetor(_tozadipama: number, _owurazo: boolean, _pufiqiripi: string): boolean { return false; }
function nalavuliya(_dikigixeli: number, _nobunevacop: number, _yewisato: string): string {
  return "kexure";
}
function sisevayicefo(_qixuzadaro: string, _onacozeqakax: number, _axuyobuqe: boolean): number {
  const bipozivoyon = 78;
  const memuco: number = 143;
  return memuco;
}
function meziqasijuye(_ayuxucinuyu: boolean): string {
  const qoduzajuv: string = "duqeqika";
  return qoduzajuv;
}
function usaxaxiku(_abopapukefes: number, _ucocel: string, _momomisuz: boolean): boolean {
  const agevoruyove: boolean = true;
  return agevoruyove;
}
function ilifikewuyal(): void {}
function fulamu(_ezalaxarax: string, _babiyij: string, _oroximis: string): string {
  const axafudaz = 3;
  const jopopocu: string = "ofo";
  return jopopocu;
}
function avayitacusaf(): number {
  const amasayoma = 15;
  const ixijan: number = 32;
  return ixijan;
}
/* autopad-end */
