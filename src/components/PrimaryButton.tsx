import React from 'react';
import {
  Animated,
  type DimensionValue,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { THEME, glow } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { Icon, type IconName } from './Icon';

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

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

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
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={[styles.press, { width, height, opacity: disabled ? 0.45 : 1 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
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
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={24} color="#FFFFFF" /> : null}
          <Text style={styles.label} numberOfLines={1}>
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56,225,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 18,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
