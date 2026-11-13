import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { EmptyState } from '../components/EmptyState';
import { ScreenBackground } from '../components/ScreenBackground';
import { HomeSlot, ScreenHeader } from '../components/ScreenHeader';
import { StatCard, StatRow } from '../components/StatCard';
import { LEVELS_PER_SECTOR, STARS_TOTAL, TOTAL_LEVELS } from '../constants/config';
import { SECTORS } from '../constants/levels';
import { THEME } from '../constants/theme';
import type { Progress } from '../game/progression';
import { clearedCount, sectorCleared, totalStars } from '../game/progression';
import { formatScore } from '../utils/format';

export interface ProgressScreenProps {
  progress: Progress;
  onMenu: () => void;
}

export function ProgressScreen({ progress, onMenu }: ProgressScreenProps) {
  const cleared = clearedCount(progress);
  const stars = totalStars(progress);
  const runs = progress.history.slice(0, 5);

  return (
    <ScreenBackground overlay={THEME.overlay.panel} drift={!progress.settings.reducedMotion}>
      <ScreenHeader
        title="PROGRESS"
        onBack={onMenu}
        backLabel="MENU"
        rightSlot={<HomeSlot onPress={onMenu} />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroValue}>{formatScore(progress.totalSignal)}</Text>
          <Text style={styles.heroLabel}>TOTAL SIGNAL</Text>
        </View>

        <StatRow>
          <StatCard
            value={cleared ? cleared + '/' + TOTAL_LEVELS : null}
            label="LEVELS CLEARED"
            accent={THEME.colors.primary}
          />
          <StatCard
            value={stars ? stars + '/' + STARS_TOTAL : null}
            label="STARS"
            accent={THEME.colors.warning}
          />
        </StatRow>

        <StatRow>
          <StatCard
            value={progress.bestStability}
            label="BEST STABILITY %"
            accent={THEME.colors.signal}
          />
          <StatCard value={progress.cleanRuns} label="CLEAN RUNS" accent={THEME.colors.secondary} />
        </StatRow>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>SECTOR ROUTING</Text>
          {SECTORS.map(sector => {
            const done = sectorCleared(progress, sector.index);
            return (
              <View key={sector.index} style={styles.sectorRow}>
                <Text style={styles.sectorName}>{'SECTOR ' + sector.name}</Text>
                <View style={styles.sectorTrack}>
                  <View style={styles.sectorFillRow}>
                    <LinearGradient
                      colors={THEME.gradients.beam}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: Math.max(0.0001, done), borderRadius: 5 }}
                    />
                    <View style={{ flex: Math.max(0.0001, LEVELS_PER_SECTOR - done) }} />
                  </View>
                </View>
                <Text style={styles.sectorValue}>{done + '/' + LEVELS_PER_SECTOR}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>LAST RUNS</Text>
          {runs.length === 0 ? (
            <EmptyState icon="chart" text="RUN YOUR FIRST SIGNAL TO START THE LOG" />
          ) : (
            runs.map((entry, i) => (
              <View key={i} style={styles.runRow}>
                <View
                  style={[
                    styles.runDot,
                    {
                      backgroundColor:
                        entry.outcome === 'win' ? THEME.colors.signal : THEME.colors.danger,
                    },
                  ]}
                />
                <Text style={styles.runLevel}>{'LEVEL ' + (entry.levelIndex + 1)}</Text>
                <Text style={styles.runOutcome}>
                  {entry.outcome === 'win' ? 'STABILIZED' : entry.outcome === 'timeout' ? 'SIGNAL LOST' : 'OVERLOADED'}
                </Text>
                <Text style={styles.runScore}>{formatScore(entry.score)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32, gap: 14 },
  hero: { alignItems: 'center', marginBottom: 4 },
  heroValue: {
    color: THEME.colors.signal,
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '900',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  heroLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  block: {
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.glass,
    padding: 14,
    gap: 10,
  },
  blockTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  sectorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectorName: {
    width: 104,
    color: THEME.colors.textSecondary,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  sectorTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.surfaceElevated,
    overflow: 'hidden',
  },
  sectorFillRow: { flex: 1, flexDirection: 'row' },
  sectorValue: {
    width: 34,
    textAlign: 'right',
    color: THEME.colors.textPrimary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  runRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  runDot: { width: 8, height: 8, borderRadius: 4 },
  runLevel: {
    width: 70,
    color: THEME.colors.textPrimary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  runOutcome: {
    flex: 1,
    color: THEME.colors.textTertiary,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  runScore: {
    color: THEME.colors.signal,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
});
