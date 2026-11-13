import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { THEME } from '../constants/theme';

export interface HintChipProps {
  text: string;
  visible: boolean;
}

/** Explains the GESTURE and its RESULT, long enough to land in a review frame. */
export function HintChip({ text, visible }: HintChipProps) {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    const anim = Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 320,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [opacity, visible]);

  return (
    <Animated.View pointerEvents="none" style={[styles.chip, { opacity }]}>
      <Text style={styles.text} numberOfLines={1}>
        {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'center',
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(56,225,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56,225,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: THEME.colors.signal,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
