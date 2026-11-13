import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import { THEME, beamColors, glow, type BeamPalette } from '../constants/theme';
import type { Grid, Routing } from '../game/types';
import { BeamLayer } from './BeamLayer';
import { NodeTile } from './NodeTile';

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
        styles.plate,
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

      <View style={styles.rows} pointerEvents="box-none">
        {Array.from({ length: grid.rows }, (_, row) => (
          <View key={row} style={styles.row} pointerEvents="box-none">
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
          styles.flash,
          { opacity: flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.9] }) },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  plate: {
    borderRadius: THEME.radius.xl,
    borderWidth: BOARD_BORDER,
    borderColor: 'rgba(65,105,225,0.35)',
    backgroundColor: THEME.colors.surface,
    overflow: 'hidden',
  },
  rows: { flexDirection: 'column' },
  row: { flexDirection: 'row' },
  flash: {
    borderRadius: THEME.radius.xl,
    borderWidth: 2,
    borderColor: THEME.colors.danger,
    backgroundColor: 'rgba(255,59,92,0.10)',
  },
});
