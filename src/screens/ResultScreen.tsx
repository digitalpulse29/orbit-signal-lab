import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard, StatRow } from '../components/StatCard';
import { StarRow } from '../components/StarRow';
import { TOTAL_LEVELS } from '../constants/config';
import { levelLabel } from '../constants/levels';
import { THEME } from '../constants/theme';
import { OUTCOME_NOTE, OUTCOME_TITLE } from '../game/scoring';
import type { RunResult } from '../game/types';
import { formatScore } from '../utils/format';

export interface ResultScreenProps {
  run: RunResult;
  nextLevel: number | null;
  onAgain: () => void;
  onNext: () => void;
  onLevels: () => void;
  onMenu: () => void;
}

export function ResultScreen(props: ResultScreenProps) {
  const { run, nextLevel, onAgain, onNext, onLevels, onMenu } = props;
  const win = run.outcome === 'win';
  const shown = useCountUp(run.score, 700);

  const titleColor = win ? THEME.colors.signal : THEME.colors.danger;
  const hasNext = win && nextLevel !== null && nextLevel < TOTAL_LEVELS;

  return (
    <ScreenBackground
      overlay={win ? THEME.overlay.win : THEME.overlay.loss}
      drift={false}
      blobs={[
        {
          color: win ? THEME.colors.primary : THEME.colors.danger,
          size: 260,
          top: 120,
          left: -70,
          opacity: 0.12,
        },
      ]}>
      <ScreenHeader title="RUN REPORT" onBack={onMenu} backLabel="MENU" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.outcome, { color: titleColor }]}>{OUTCOME_TITLE[run.outcome]}</Text>
        <Text style={styles.note}>{OUTCOME_NOTE[run.outcome]}</Text>
        <Text style={styles.level}>{levelLabel(run.levelIndex)}</Text>

        <View style={styles.stars}>
          <StarRow earned={run.stars} total={3} size={30} animated />
        </View>

        <Text style={styles.score}>{formatScore(shown)}</Text>
        <Text style={styles.scoreLabel}>SIGNAL SCORE</Text>

        <View style={styles.statRow}>
          <StatRow>
            <StatCard value={run.timeLeft} label="TIME LEFT (S)" accent={THEME.colors.signal} />
            <StatCard value={run.stability} label="STABILITY %" accent={THEME.colors.primary} />
            <StatCard value={run.chargesLeft} label="CHARGES LEFT" accent={THEME.colors.warning} />
          </StatRow>
        </View>

        <View style={styles.banner}>
          <Image
            source={win ? assets.sprite5 : assets.sprite4}
            style={styles.bannerSprite}
            resizeMode="contain"
          />
          <Text style={[styles.bannerText, { color: win ? THEME.colors.warning : THEME.colors.textSecondary }]}>
            {win
              ? '+1 CONSTELLATION FRAGMENT'
              : 'LINKED ' + run.linked + '/' + run.satellites + ' SATELLITES'}
          </Text>
        </View>

        <View style={styles.buttons}>
          <PrimaryButton label="ROUTE AGAIN" onPress={onAgain} icon="undo" height={60} />
          {hasNext ? (
            <PrimaryButton
              label="NEXT LEVEL"
              onPress={onNext}
              icon="play"
              height={56}
              colors={[THEME.colors.signal, THEME.colors.primary]}
            />
          ) : null}
          <View style={styles.secondaryRow}>
            <View style={styles.secondarySlot}>
              <SecondaryButton label="LEVELS" onPress={onLevels} icon="grid" height={48} />
            </View>
            <View style={styles.secondarySlot}>
              <SecondaryButton label="MENU" onPress={onMenu} icon="back" height={48} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function useCountUp(target: number, duration: number): number {
  const [value, setValue] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    const steps = 20;
    let i = 0;
    setValue(0);
    const id = setInterval(() => {
      i += 1;
      const next = Math.round((targetRef.current * i) / steps);
      setValue(i >= steps ? targetRef.current : next);
      if (i >= steps) {
        clearInterval(id);
      }
    }, Math.max(16, Math.round(duration / steps)));
    return () => clearInterval(id);
  }, [duration, target]);

  return value;
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32, alignItems: 'center' },
  outcome: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  note: {
    marginTop: 6,
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  level: {
    marginTop: 4,
    color: THEME.colors.textTertiary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  stars: { marginTop: 18 },
  score: {
    marginTop: 16,
    color: THEME.colors.textPrimary,
    fontSize: 46,
    lineHeight: 54,
    fontWeight: '900',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  scoreLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  statRow: { width: '100%', marginTop: 20 },
  banner: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  bannerSprite: { width: 40, height: 40 },
  bannerText: { fontSize: 13, lineHeight: 20, fontWeight: '800', letterSpacing: 1.2 },
  buttons: { width: '100%', marginTop: 22, gap: 12 },
  secondaryRow: { flexDirection: 'row', gap: 12 },
  secondarySlot: { flex: 1 },
});
