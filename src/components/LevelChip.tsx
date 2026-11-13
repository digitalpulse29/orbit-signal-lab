import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { Icon } from './Icon';
import { StarRow } from './StarRow';

const HIT = { top: 6, bottom: 6, left: 6, right: 6 };

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
        styles.chip,
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
        <Image source={assets.sprite2} style={styles.watermark} resizeMode="contain" />
      )}
      {locked ? (
        <Icon name="lock" size={24} color={THEME.colors.textTertiary} />
      ) : (
        <Text style={styles.number}>{label}</Text>
      )}
      {state === 'cleared' ? (
        <View style={styles.stars}>
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
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={'LEVEL ' + label}
      style={{ width: size, height: size }}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 26,
    height: 26,
    opacity: 0.18,
  },
  number: {
    color: THEME.colors.textPrimary,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  stars: { position: 'absolute', bottom: 8, left: 0, right: 0, alignItems: 'center' },
});
