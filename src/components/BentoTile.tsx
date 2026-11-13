import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

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
        styles.tile,
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
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={{ width: '100%', height }}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    backgroundColor: THEME.colors.glass,
    overflow: 'hidden',
  },
});
