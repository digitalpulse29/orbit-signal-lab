import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { THEME } from '../constants/theme';

export interface TimerRingProps {
  secondsLeft: number;
  total: number;
  frozen?: boolean;
}

const SIZE = 44;
const R = 19;
const C = 2 * Math.PI * R;

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
    <View style={styles.root}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={THEME.colors.surfaceElevated}
          strokeWidth={4}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={color}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ratio)}
          transform={'rotate(-90 ' + SIZE / 2 + ' ' + SIZE / 2 + ')'}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.value, { color }]}>{Math.max(0, Math.ceil(secondsLeft))}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 13, lineHeight: 18, fontWeight: '900', fontVariant: ['tabular-nums'] },
});
