import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { Icon } from './Icon';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  backLabel?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  /** replaces the centred title (used by the Game screen timer ring) */
  centerSlot?: React.ReactNode;
  /** adds the bottom hairline + surface used on the Game screen */
  framed?: boolean;
}

/** ONE header for every screen (Menu, Levels, Game, Result, Collection, Progress, Settings). */
export function ScreenHeader({
  title,
  onBack,
  backLabel = 'MENU',
  leftSlot,
  rightSlot,
  centerSlot,
  framed = false,
}: ScreenHeaderProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);

  return (
    <View style={[styles.root, framed ? styles.framed : null]}>
      <View style={styles.side}>
        {leftSlot ? (
          leftSlot
        ) : onBack ? (
          <Pressable
            onPress={onBack}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            style={styles.backPress}>
            <Animated.View pointerEvents="box-none" style={[styles.backShell, { transform: [{ scale }] }]}>
              <View style={styles.row}>
                <Icon name="back" size={24} color={THEME.colors.signal} />
                <Text style={styles.backLabel}>{backLabel}</Text>
              </View>
            </Animated.View>
          </Pressable>
        ) : null}
      </View>

      {centerSlot ? (
        <View style={styles.center}>{centerSlot}</View>
      ) : (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}

      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

/** The standard right slot: a home glyph that goes back to Menu. */
export function HomeSlot({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel="HOME"
      style={styles.homePress}>
      <Animated.View pointerEvents="box-none" style={[styles.homeShell, { transform: [{ scale }] }]}>
        <Image source={assets.iconHome} style={styles.homeIcon} resizeMode="contain" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 44,
    height: 116,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  framed: {
    backgroundColor: 'rgba(10,10,32,0.72)',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.hairline,
  },
  side: { width: 104, height: 48, justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  title: {
    flex: 1,
    textAlign: 'center',
    color: THEME.colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 2,
  },
  backPress: { width: 104, height: 48, justifyContent: 'center' },
  backShell: {
    width: 104,
    height: 48,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  backLabel: {
    color: THEME.colors.signal,
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  homePress: { width: 48, height: 48, alignItems: 'flex-end', justifyContent: 'center' },
  homeShell: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIcon: { width: 28, height: 28 },
});
