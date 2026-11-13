import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ConstellationCard } from '../components/ConstellationCard';
import { EmptyState } from '../components/EmptyState';
import { ScreenBackground } from '../components/ScreenBackground';
import { HomeSlot, ScreenHeader } from '../components/ScreenHeader';
import { LEVELS_PER_SECTOR } from '../constants/config';
import { THEME } from '../constants/theme';
import type { Progress } from '../game/progression';
import { constellationStates, totalFragments } from '../game/progression';
import { formatScore } from '../utils/format';

export interface CollectionScreenProps {
  progress: Progress;
  onMenu: () => void;
}

export function CollectionScreen({ progress, onMenu }: CollectionScreenProps) {
  const { width } = useWindowDimensions();
  const [expanded, setExpanded] = useState<string | null>(null);
  const cards = constellationStates(progress);
  const fragments = totalFragments(progress);

  const gridW = Math.min(width - 32, 380);
  const cardW = Math.floor((gridW - 12) / 2);

  const toggle = (id: string) => setExpanded(prev => (prev === id ? null : id));

  const labelsFor = (sector: number) => {
    let clearedAt = 0;
    let best = 0;
    for (let i = 0; i < LEVELS_PER_SECTOR; i++) {
      const key = String(sector * LEVELS_PER_SECTOR + i);
      if (progress.clearedAt[key]) {
        clearedAt = Math.max(clearedAt, progress.clearedAt[key]);
        best = Math.max(best, progress.bestScore[key] || 0);
      }
    }
    return {
      clearedLabel: clearedAt
        ? 'CLEARED ' + new Date(clearedAt).toISOString().slice(0, 10)
        : null,
      bestLabel: best ? 'BEST SIGNAL ' + formatScore(best) : null,
    };
  };

  return (
    <ScreenBackground overlay={THEME.overlay.panel} drift={!progress.settings.reducedMotion}>
      <ScreenHeader
        title="COLLECTION"
        onBack={onMenu}
        backLabel="MENU"
        rightSlot={<HomeSlot onPress={onMenu} />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.summary}>
          {fragments + ' FRAGMENTS ROUTED · TAP A CARD FOR DETAILS'}
        </Text>

        {fragments === 0 ? (
          <EmptyState
            icon="star"
            text={'NO FRAGMENTS ROUTED YET - CLEAR A LEVEL TO EARN ONE'}
          />
        ) : null}

        <View style={[styles.grid, { width: gridW }]}>
          {cards.map(card => {
            const labels = labelsFor(card.sector);
            return (
              <ConstellationCard
                key={card.id}
                card={card}
                expanded={expanded === card.id}
                width={cardW}
                clearedLabel={labels.clearedLabel}
                bestLabel={labels.bestLabel}
                onPress={toggle}
              />
            );
          })}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32, alignItems: 'center', gap: 14 },
  summary: {
    color: THEME.colors.textSecondary,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' },
});
