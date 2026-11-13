import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ENTRANCE_FRICTION, ENTRANCE_TENSION } from '../constants/config';
import { THEME } from '../constants/theme';

export interface StarRowProps {
  earned: number;
  total?: number;
  size?: number;
  animated?: boolean;
}

/** Star glyph is on the safe list, so no tofu risk. */
export function StarRow({ earned, total = 3, size = 18, animated = false }: StarRowProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <Star key={i} index={i} on={i < earned} size={size} animated={animated} />
      ))}
    </View>
  );
}

function Star({
  index,
  on,
  size,
  animated,
}: {
  index: number;
  on: boolean;
  size: number;
  animated: boolean;
}) {
  const scale = useRef(new Animated.Value(animated && on ? 0.3 : 1)).current;

  useEffect(() => {
    if (!animated || !on) {
      return;
    }
    const anim = Animated.spring(scale, {
      toValue: 1,
      delay: index * 160,
      tension: ENTRANCE_TENSION,
      friction: ENTRANCE_FRICTION,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [animated, index, on, scale]);

  return (
    <Animated.Text
      style={[
        styles.star,
        {
          fontSize: size,
          lineHeight: size + 4,
          color: on ? THEME.colors.warning : THEME.colors.starEmpty,
          transform: [{ scale }],
        },
      ]}>
      {'★'}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  star: { fontWeight: '900' },
});
