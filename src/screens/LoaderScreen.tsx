import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { assets } from '../assets';
import { ENTRANCE_FRICTION, ENTRANCE_TENSION, LOADER_BAR_MS, LOADER_DURATION_MS } from '../constants/config';
import { THEME, glow } from '../constants/theme';
import { ScreenBackground } from '../components/ScreenBackground';

export interface LoaderScreenProps {
  onDone: () => void;
}

const CARD = 196;
const RING = 86;

/**
 * Brand card only: no PLAY button, no stat chips, no tap handler anywhere.
 * The Menu is reached by the 8000 ms timer and nothing else.
 */
export function LoaderScreen({ onDone }: LoaderScreenProps) {
  const cardScale = useRef(new Animated.Value(0.86)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ringSpin = useRef(new Animated.Value(0)).current;
  const titleShift = useRef(new Animated.Value(14)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const statusPulse = useRef(new Animated.Value(0.45)).current;

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const timer = setTimeout(() => doneRef.current(), LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: ENTRANCE_TENSION,
        friction: ENTRANCE_FRICTION,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(ringOpacity, {
        toValue: 1,
        duration: 420,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 420,
          delay: 700,
          useNativeDriver: true,
        }),
        Animated.timing(titleShift, {
          toValue: 0,
          duration: 420,
          delay: 700,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const spin = Animated.loop(
      Animated.timing(ringSpin, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    // width is a layout property - native driver is NOT allowed here
    const bar = Animated.timing(barWidth, {
      toValue: 1,
      duration: LOADER_BAR_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(statusPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(statusPulse, { toValue: 0.45, duration: 900, useNativeDriver: true }),
      ]),
    );

    entrance.start();
    spin.start();
    bar.start();
    pulse.start();
    return () => {
      entrance.stop();
      spin.stop();
      bar.stop();
      pulse.stop();
    };
  }, [barWidth, cardOpacity, cardScale, ringOpacity, ringSpin, statusPulse, titleOpacity, titleShift]);

  const spinDeg = ringSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const fill = barWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <ScreenBackground
      overlay={THEME.overlay.loader}
      drift={false}
      blobs={[
        { color: THEME.colors.primary, size: 220, top: 60, left: -60, opacity: 0.1 },
        { color: THEME.colors.secondary, size: 280, top: 460, left: 150, opacity: 0.08 },
      ]}>
      <View style={styles.root}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.card,
            glow(THEME.colors.primary, 0.35, 24, 14),
            { opacity: cardOpacity, transform: [{ scale: cardScale }] },
          ]}>
          <Animated.View
            pointerEvents="none"
            style={[styles.ring, { opacity: ringOpacity, transform: [{ rotate: spinDeg }] }]}>
            <Svg width={RING * 2} height={RING * 2}>
              <Circle
                cx={RING}
                cy={RING}
                r={RING - 4}
                stroke={THEME.colors.signal}
                strokeWidth={1.5}
                strokeDasharray="8 14"
                fill="none"
              />
            </Svg>
          </Animated.View>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={{ opacity: titleOpacity, transform: [{ translateY: titleShift }] }}>
          <Text style={styles.title}>ORBIT SIGNAL</Text>
          <Text style={styles.title}>LAB</Text>
          <Text style={styles.subtitle}>DEEP SPACE RELAY CALIBRATION</Text>
        </Animated.View>

        <View style={styles.barBlock} pointerEvents="none">
          <View style={styles.track}>
            <Animated.View pointerEvents="none" style={[styles.fill, { width: fill }]}>
              <LinearGradient
                colors={THEME.gradients.beam}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fillGradient}
              />
            </Animated.View>
          </View>
          <Animated.Text style={[styles.status, { opacity: statusPulse }]}>
            LOADING...
          </Animated.Text>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: {
    width: CARD,
    height: CARD,
    borderRadius: THEME.radius.xxl,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  ring: { position: 'absolute', width: RING * 2, height: RING * 2 },
  logo: { width: 132, height: 132 },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
    textShadowColor: THEME.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitle: {
    marginTop: 12,
    color: THEME.colors.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
  },
  barBlock: { marginTop: 44, alignItems: 'center' },
  track: {
    width: 212,
    height: 5,
    borderRadius: 3,
    backgroundColor: THEME.colors.surfaceElevated,
    overflow: 'hidden',
  },
  fill: { height: 5, borderRadius: 3, overflow: 'hidden' },
  fillGradient: { flex: 1, borderRadius: 3 },
  status: {
    marginTop: 14,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 4,
  },
});
