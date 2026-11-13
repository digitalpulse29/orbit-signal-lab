import React, { memo, useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import { NODE_SPRITE } from '../assets';
import {
  PRESS_FRICTION,
  PRESS_TENSION,
  ROTATE_FRICTION,
  ROTATE_TENSION,
} from '../constants/config';
import { THEME } from '../constants/theme';
import { E, N, S, W } from '../game/ports';
import type { NodeKind } from '../game/types';

const HIT = { top: 2, bottom: 2, left: 2, right: 2 };
const PORT_W = 4;

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

function NodeTileBase(props: NodeTileProps) {
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
        styles.inner,
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
              styles.port,
              { left: half - PORT_W / 2, top: 0, width: PORT_W, height: half, backgroundColor: stroke },
            ]}
          />
        ) : null}
        {(baseMask & S) !== 0 ? (
          <View
            style={[
              styles.port,
              { left: half - PORT_W / 2, top: half, width: PORT_W, height: half, backgroundColor: stroke },
            ]}
          />
        ) : null}
        {(baseMask & W) !== 0 ? (
          <View
            style={[
              styles.port,
              { top: half - PORT_W / 2, left: 0, height: PORT_W, width: half, backgroundColor: stroke },
            ]}
          />
        ) : null}
        {(baseMask & E) !== 0 ? (
          <View
            style={[
              styles.port,
              { top: half - PORT_W / 2, left: half, height: PORT_W, width: half, backgroundColor: stroke },
            ]}
          />
        ) : null}
      </Animated.View>

      <View
        style={[
          styles.hub,
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
      <View style={[styles.cell, { width: tile, height: tile }]} pointerEvents="none">
        {body}
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => onPress(id)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={'ROTATE NODE ' + (id + 1)}
      style={[styles.cell, { width: tile, height: tile }]}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { alignItems: 'center', justifyContent: 'center' },
  inner: {
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  port: { position: 'absolute', borderRadius: 2 },
  hub: { alignItems: 'center', justifyContent: 'center' },
});

export const NodeTile = memo(NodeTileBase);
