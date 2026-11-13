import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

/** Deterministic star positions - the same sky on every launch. */
const STARS: Array<[number, number, number, number]> = [
  [4, 6, 1.4, 0.6], [12, 18, 0.9, 0.35], [21, 9, 1.8, 0.75], [30, 22, 1.1, 0.4],
  [38, 5, 2.0, 0.8], [46, 16, 0.8, 0.3], [55, 11, 1.5, 0.55], [63, 25, 1.0, 0.35],
  [71, 7, 1.9, 0.7], [80, 20, 1.2, 0.45], [88, 13, 0.9, 0.3], [95, 27, 1.6, 0.6],
  [7, 34, 1.3, 0.5], [16, 45, 0.8, 0.28], [25, 38, 2.2, 0.8], [34, 50, 1.0, 0.35],
  [43, 41, 1.4, 0.5], [52, 54, 0.9, 0.3], [60, 36, 1.7, 0.65], [69, 48, 1.1, 0.4],
  [77, 43, 0.8, 0.26], [86, 56, 1.5, 0.55], [93, 39, 1.2, 0.45], [3, 62, 1.0, 0.33],
  [14, 71, 1.8, 0.7], [23, 66, 0.9, 0.3], [33, 79, 1.3, 0.48], [41, 68, 2.0, 0.75],
  [50, 83, 1.1, 0.38], [59, 74, 0.8, 0.25], [68, 88, 1.6, 0.6], [76, 70, 1.2, 0.42],
  [85, 85, 0.9, 0.3], [94, 77, 1.9, 0.72],
];

export interface StarFieldProps {
  color?: string;
  drift?: boolean;
  width: number;
  height: number;
}

export function StarField({ color = '#FFF8DC', drift = true, width, height }: StarFieldProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!drift) {
      translateY.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { transform: [{ translateY }] }]}>
      <Svg width={width} height={height}>
        {STARS.map((star, i) => (
          <Circle
            key={i}
            cx={(star[0] / 100) * width}
            cy={(star[1] / 100) * height}
            r={star[2]}
            fill={color}
            opacity={star[3]}
          />
        ))}
      </Svg>
    </Animated.View>
  );
}
