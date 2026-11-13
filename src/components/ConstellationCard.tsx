import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { assets } from '../assets';
import { FRAGMENTS_PER_CONSTELLATION } from '../constants/config';
import { THEME, glow } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import type { ConstellationState } from '../game/progression';

const HIT = { top: 6, bottom: 6, left: 6, right: 6 };

/** Deterministic star patterns, one per card id. */
const PATTERNS: Record<string, Array<[number, number]>> = {
  orion: [[20, 18], [46, 10], [70, 26], [38, 46], [58, 62], [26, 72]],
  lyra: [[30, 14], [62, 22], [48, 44], [22, 56], [68, 66]],
  vela: [[16, 30], [40, 16], [66, 28], [78, 54], [50, 68], [24, 62]],
  pyxis: [[34, 20], [62, 34], [44, 52], [70, 70], [20, 48]],
  carina: [[18, 22], [44, 12], [72, 24], [60, 48], [34, 58], [16, 70], [76, 66]],
  dorado: [[26, 16], [54, 26], [38, 48], [66, 58], [28, 70]],
  tucana: [[22, 26], [50, 14], [74, 34], [56, 56], [30, 64], [46, 78]],
  phoenix: [[20, 16], [48, 28], [74, 18], [60, 50], [34, 46], [50, 72], [24, 68]],
};

export interface ConstellationCardProps {
  card: ConstellationState;
  expanded: boolean;
  width: number;
  clearedLabel?: string | null;
  bestLabel?: string | null;
  onPress: (id: string) => void;
}

export function ConstellationCard(props: ConstellationCardProps) {
  const { card, expanded, width, clearedLabel, bestLabel, onPress } = props;
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  const points = PATTERNS[card.id] || PATTERNS.lyra;
  const art = width - 24;
  const height = expanded ? 236 : 196;
  const color = card.unlocked ? THEME.colors.signal : THEME.colors.textTertiary;

  return (
    <Pressable
      onPress={() => onPress(card.id)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={card.name}
      style={{ width, height }}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          {
            height,
            borderColor: card.unlocked ? 'rgba(56,225,255,0.45)' : THEME.colors.border,
            transform: [{ scale }],
          },
          card.unlocked ? glow(THEME.colors.primary, 0.35, 18, 10) : null,
        ]}>
        <View style={[styles.art, { width: art, height: 96 }]}>
          <Svg width={art} height={96}>
            {card.unlocked
              ? points.map((p, i) => {
                  if (i === 0) {
                    return null;
                  }
                  const prev = points[i - 1];
                  return (
                    <Line
                      key={'l' + i}
                      x1={(prev[0] / 100) * art}
                      y1={(prev[1] / 100) * 96}
                      x2={(p[0] / 100) * art}
                      y2={(p[1] / 100) * 96}
                      stroke={THEME.colors.signal}
                      strokeOpacity={0.7}
                      strokeWidth={1.5}
                    />
                  );
                })
              : null}
            {points.map((p, i) => (
              <Circle
                key={'c' + i}
                cx={(p[0] / 100) * art}
                cy={(p[1] / 100) * 96}
                r={card.unlocked ? 3 : 2}
                fill={card.unlocked ? THEME.colors.signal : THEME.colors.textTertiary}
                opacity={card.unlocked ? 1 : 0.14}
              />
            ))}
          </Svg>
          {card.unlocked ? null : (
            <Image source={assets.sprite5} style={styles.lockedSprite} resizeMode="contain" />
          )}
        </View>

        <Text style={[styles.name, { color: card.unlocked ? THEME.colors.textPrimary : color }]}>
          {card.name}
        </Text>

        {card.unlocked ? (
          <Text style={styles.flavour}>{card.flavour}</Text>
        ) : (
          <Text style={styles.flavour}>
            {card.owned + '/' + FRAGMENTS_PER_CONSTELLATION + ' FRAGMENTS'}
          </Text>
        )}

        <View style={styles.dots}>
          {Array.from({ length: FRAGMENTS_PER_CONSTELLATION }, (_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i < card.owned ? THEME.colors.warning : THEME.colors.starEmpty },
              ]}
            />
          ))}
        </View>

        {expanded ? (
          <View style={styles.details}>
            <Text style={styles.detailLine}>{clearedLabel || 'NOT CLEARED YET'}</Text>
            <Text style={styles.detailLine}>{bestLabel || 'NO BEST SIGNAL YET'}</Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    backgroundColor: THEME.colors.glass,
    padding: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  art: { alignItems: 'center', justifyContent: 'center' },
  lockedSprite: { position: 'absolute', right: 8, bottom: 8, width: 28, height: 28, opacity: 0.3 },
  name: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  flavour: {
    marginTop: 4,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  dots: { flexDirection: 'row', gap: 6, marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  details: { marginTop: 10, alignItems: 'center' },
  detailLine: {
    color: THEME.colors.textTertiary,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
