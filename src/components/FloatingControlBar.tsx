import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { THEME, glow } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { Icon, type IconName } from './Icon';
import { RoundActionButton } from './RoundActionButton';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

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
    <View style={styles.wrap} pointerEvents="box-none">
      <Text style={styles.charges}>
        {'CHARGES '}
        <Text style={charges === 0 ? styles.chargesEmpty : styles.chargesValue}>
          {charges + '/' + budget}
        </Text>
      </Text>

      <View style={styles.bar}>
        <SideButton
          label="UNDO"
          icon="undo"
          onPress={onUndo}
          disabled={undosLeft <= 0}
          tint={THEME.colors.textPrimary}
          badge={undosLeft}
        />

        <View style={styles.center}>
          <RoundActionButton label="GO" onPress={onGo} />
          <Text style={styles.caption}>SEND SIGNAL</Text>
        </View>

        <SideButton
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

function SideButton({
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
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.sidePress, { opacity: disabled ? 0.4 : 1 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.sideShell,
          {
            borderColor: disabled ? 'rgba(255,255,255,0.06)' : THEME.colors.border,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.sideRow}>
          <Icon name={icon} size={24} color={tint} />
          <Text style={[styles.sideLabel, { color: tint }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
        <Text style={styles.sideBadge}>{badge}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  charges: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  chargesValue: { color: THEME.colors.signal, fontVariant: ['tabular-nums'] },
  chargesEmpty: { color: THEME.colors.danger, fontVariant: ['tabular-nums'] },
  bar: {
    width: '100%',
    height: 88,
    borderRadius: THEME.radius.xxl,
    backgroundColor: 'rgba(10,10,32,0.90)',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    ...glow('#050510', 0.7, 22, 16),
  },
  center: { width: 86, alignItems: 'center', justifyContent: 'center' },
  caption: {
    marginTop: 2,
    color: THEME.colors.textSecondary,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  sidePress: { width: 86, height: 64, justifyContent: 'center' },
  sideShell: {
    width: 86,
    height: 64,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    backgroundColor: THEME.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  sideRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  sideLabel: { fontSize: 11, lineHeight: 24, fontWeight: '800', letterSpacing: 1 },
  sideBadge: {
    color: THEME.colors.textTertiary,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
});
