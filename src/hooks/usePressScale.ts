import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { PRESS_FRICTION, PRESS_TENSION } from '../constants/config';

/**
 * Press feedback the safe way on this stack: the Pressable stays the PARENT
 * and drives an Animated.View CHILD. transform/scale only, native driver.
 */
export function usePressScale(enabled = true, pressed = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    if (!enabled) {
      return;
    }
    Animated.spring(scale, {
      toValue: pressed,
      tension: PRESS_TENSION,
      friction: PRESS_FRICTION,
      useNativeDriver: true,
    }).start();
  }, [enabled, pressed, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: PRESS_TENSION,
      friction: PRESS_FRICTION,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
