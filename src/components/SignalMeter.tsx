import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '../constants/theme';
import { clamp } from '../utils/format';

export interface SignalMeterProps {
  stability: number;
  width?: number;
}

export function SignalMeter({ stability, width = 86 }: SignalMeterProps) {
  const value = clamp(stability, 0, 100);
  const danger = value <= 34;
  return (
    <View style={styles.root}>
      <View style={[styles.track, { width }]}>
        <LinearGradient
          colors={danger ? THEME.gradients.danger : THEME.gradients.beam}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: (width * value) / 100, height: 8, borderRadius: 4 }}
        />
      </View>
      <Text style={[styles.label, danger ? { color: THEME.colors.danger } : null]}>
        {'STAB ' + Math.round(value) + '%'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'flex-start', gap: 4 },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.surfaceElevated,
    overflow: 'hidden',
  },
  label: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    fontVariant: ['tabular-nums'],
  },
});
