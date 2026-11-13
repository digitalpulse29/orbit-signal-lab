import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { BentoTile } from '../components/BentoTile';
import { Icon, type IconName } from '../components/Icon';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { STARS_TOTAL } from '../constants/config';
import { levelLabel } from '../constants/levels';
import { THEME, glow } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import type { Progress } from '../game/progression';
import { totalFragments, totalStars } from '../game/progression';
import { formatScore } from '../utils/format';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface MenuScreenProps {
  progress: Progress;
  currentLevel: number;
  onPlay: () => void;
  onLevels: () => void;
  onCollection: () => void;
  onProgress: () => void;
  onSettings: () => void;
}

export function MenuScreen(props: MenuScreenProps) {
  const { progress, currentLevel, onPlay, onLevels, onCollection, onProgress, onSettings } = props;
  const reduced = progress.settings.reducedMotion;
  const stars = totalStars(progress);
  const best = progress.bestSignal;
  const hasRuns = progress.history.length > 0;

  return (
    <ScreenBackground overlay={THEME.overlay.menu} drift={!reduced}>
      <ScreenHeader
        title="ORBIT SIGNAL LAB"
        leftSlot={<Image source={assets.logo} style={styles.brandLogo} resizeMode="contain" />}
        rightSlot={
          <View style={styles.badge}>
            <Icon name="bolt" size={18} color={THEME.colors.signal} />
            <Text style={styles.badgeText}>{totalFragments(progress) + ' FRG'}</Text>
          </View>
        }
      />

      <View style={styles.body}>
        <Text style={styles.hint}>TAP NODES TO ROTATE {'·'} LINK EVERY SATELLITE</Text>

        <View style={styles.bento}>
          <View style={styles.bentoLeft}>
            <PlayTile
              label={levelLabel(currentLevel)}
              reduced={reduced}
              onPress={onPlay}
            />
          </View>

          <View style={styles.bentoRight}>
            {hasRuns ? (
              <>
                <BentoTile height={100} index={1} reducedMotion={reduced} accent="rgba(56,225,255,0.3)">
                  <View style={styles.statInner}>
                    <View style={[styles.dot, { backgroundColor: THEME.colors.signal }]} />
                    <Text style={[styles.statValue, { color: THEME.colors.signal }]}>
                      {formatScore(best)}
                    </Text>
                    <Text style={styles.statLabel}>BEST SIGNAL</Text>
                  </View>
                </BentoTile>
                <BentoTile height={100} index={2} reducedMotion={reduced} accent="rgba(255,194,75,0.3)">
                  <View style={styles.statInner}>
                    <View style={[styles.dot, { backgroundColor: THEME.colors.warning }]} />
                    <Text style={[styles.statValue, { color: THEME.colors.warning }]}>
                      {stars + '/' + STARS_TOTAL}
                    </Text>
                    <Text style={styles.statLabel}>STARS</Text>
                  </View>
                </BentoTile>
              </>
            ) : (
              <BentoTile height={212} index={1} reducedMotion={reduced} accent="rgba(255,255,255,0.1)">
                <View style={styles.firstRun}>
                  <Image source={assets.sprite1} style={styles.firstRunSprite} resizeMode="contain" />
                  <Text style={styles.firstRunText}>FIRST RUN{'\n'}NOT CALIBRATED{'\n'}YET</Text>
                </View>
              </BentoTile>
            )}
          </View>
        </View>

        <View style={styles.routeRow}>
          <RouteTile label="LEVELS" icon="grid" accent={THEME.colors.signal} index={3} reduced={reduced} onPress={onLevels} />
          <RouteTile label="COLLECTION" icon="star" accent={THEME.colors.warning} index={4} reduced={reduced} onPress={onCollection} />
        </View>
        <View style={styles.routeRow}>
          <RouteTile label="PROGRESS" icon="chart" accent={THEME.colors.primary} index={5} reduced={reduced} onPress={onProgress} />
          <RouteTile label="SETTINGS" icon="settings" accent={THEME.colors.secondary} index={6} reduced={reduced} onPress={onSettings} />
        </View>

        <View style={styles.spacer} />

        <Text style={styles.footer}>OFFLINE LAB {'·'} NO ADS {'·'} NO REAL MONEY</Text>
      </View>
    </ScreenBackground>
  );
}

function PlayTile({
  label,
  reduced,
  onPress,
}: {
  label: string;
  reduced: boolean;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      bob.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob, reduced]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [6, -6] });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel="START SIGNAL RUN"
      style={styles.playPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.playTile, glow(THEME.colors.primary, 0.45, 26, 14), { transform: [{ scale }] }]}>
        <Image source={assets.buttonRect} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(65,105,225,0.85)', 'rgba(123,47,190,0.90)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.Image
          source={assets.sprite3}
          style={[styles.playSprite, { transform: [{ translateY }] }]}
          resizeMode="contain"
        />
        <Text style={styles.playLabel}>START SIGNAL RUN</Text>
        <Text style={styles.playSub}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function RouteTile({
  label,
  icon,
  accent,
  index,
  reduced,
  onPress,
}: {
  label: string;
  icon: IconName;
  accent: string;
  index: number;
  reduced: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.routeSlot}>
      <BentoTile
        height={64}
        index={index}
        reducedMotion={reduced}
        accent={THEME.colors.border}
        onPress={onPress}
        accessibilityLabel={label}>
        <View style={styles.routeInner}>
          <View style={[styles.routeIcon, { backgroundColor: accent + '1F' }]}>
            <Icon name={icon} size={24} color={accent} />
          </View>
          <Text style={styles.routeLabel} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </BentoTile>
    </View>
  );
}

const styles = StyleSheet.create({
  brandLogo: { width: 34, height: 34 },
  badge: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(65,105,225,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  badgeText: {
    color: THEME.colors.signal,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  body: { flex: 1, paddingHorizontal: 16 },
  hint: {
    color: THEME.colors.textSecondary,
    fontSize: 10.5,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
    marginBottom: 14,
  },
  bento: { flexDirection: 'row', gap: 12 },
  bentoLeft: { flex: 58 },
  bentoRight: { flex: 42, gap: 12 },
  playPress: { width: '100%', height: 212 },
  playTile: {
    width: '100%',
    height: 212,
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(56,225,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 12,
  },
  playSprite: { width: 72, height: 72, marginBottom: 12 },
  playLabel: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  playSub: {
    marginTop: 6,
    color: '#D8E2FF',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  statInner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  statValue: { fontSize: 24, lineHeight: 30, fontWeight: '900', fontVariant: ['tabular-nums'] },
  statLabel: {
    marginTop: 4,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  firstRun: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  firstRunSprite: { width: 56, height: 56, marginBottom: 12, opacity: 0.8 },
  firstRunText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  routeRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  routeSlot: { flex: 1 },
  routeInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  routeIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLabel: {
    flexShrink: 1,
    color: THEME.colors.textPrimary,
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  spacer: { flex: 1, minHeight: 12 },
  footer: {
    color: THEME.colors.textTertiary,
    fontSize: 9.5,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginBottom: 18,
  },
});
