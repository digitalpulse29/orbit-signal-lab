import React from 'react';
import { Animated, type DimensionValue, Pressable, StyleSheet, Text, View } from 'react-native';
import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { Icon, type IconName } from './Icon';

export interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: IconName;
  height?: number;
  width?: DimensionValue;
  tint?: string;
  disabled?: boolean;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

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
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { width, height, opacity: disabled ? 0.4 : 1 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          {
            height,
            borderColor: disabled ? 'rgba(255,255,255,0.06)' : THEME.colors.border,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={24} color={tint} /> : null}
          <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { justifyContent: 'center' },
  shell: {
    width: '100%',
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    backgroundColor: THEME.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  label: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
