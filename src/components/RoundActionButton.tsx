import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { THEME, glow } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const SIZE = 72;

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
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { opacity: disabled ? 0.45 : 1 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.shell, { transform: [{ scale }] }, glow(THEME.colors.primary, 0.5, 22, 14)]}>
        <Image source={assets.buttonRound} style={styles.plate} resizeMode="contain" />
        <LinearGradient
          colors={THEME.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tint}
        />
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  shell: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(56,225,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: THEME.colors.surface,
  },
  plate: { ...StyleSheet.absoluteFillObject, width: SIZE, height: SIZE },
  tint: { ...StyleSheet.absoluteFillObject, opacity: 0.82 },
  label: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
