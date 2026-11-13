import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { EmptyState } from '../components/EmptyState';
import { LevelChip, type LevelChipState } from '../components/LevelChip';
import { ScreenBackground } from '../components/ScreenBackground';
import { HomeSlot, ScreenHeader } from '../components/ScreenHeader';
import { SectorTabs } from '../components/SectorTabs';
import { LEVELS_PER_SECTOR } from '../constants/config';
import { SECTORS } from '../constants/levels';
import { THEME } from '../constants/theme';
import type { Progress } from '../game/progression';
import { isUnlocked, sectorCleared } from '../game/progression';

export interface LevelSelectScreenProps {
  progress: Progress;
  currentLevel: number;
  onPick: (levelIndex: number) => void;
  onMenu: () => void;
}

export function LevelSelectScreen(props: LevelSelectScreenProps) {
  const { progress, currentLevel, onPick, onMenu } = props;
  const { width } = useWindowDimensions();
  const [active, setActive] = useState(Math.floor(currentLevel / LEVELS_PER_SECTOR));

  const gridW = Math.min(width - 32, 380);
  const tile = Math.floor((gridW - 2 * 12) / 3);

  const indices = Array.from(
    { length: LEVELS_PER_SECTOR },
    (_, i) => active * LEVELS_PER_SECTOR + i,
  );
  const anyOpen = indices.some(i => isUnlocked(progress, i));
  const cleared = sectorCleared(progress, active);
  const prevName = SECTORS[Math.max(0, active - 1)].name;

  return (
    <ScreenBackground overlay={THEME.overlay.panel} drift={!progress.settings.reducedMotion}>
      <ScreenHeader
        title="LEVEL SELECT"
        onBack={onMenu}
        backLabel="MENU"
        rightSlot={<HomeSlot onPress={onMenu} />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <SectorTabs active={active} onSelect={setActive} />

        {anyOpen ? (
          <View style={[styles.grid, { width: gridW }]}>
            {indices.map(index => {
              const state: LevelChipState = progress.clearedAt[String(index)]
                ? 'cleared'
                : isUnlocked(progress, index)
                ? 'open'
                : 'locked';
              return (
                <LevelChip
                  key={index}
                  index={index}
                  label={index + 1}
                  state={state}
                  stars={progress.stars[String(index)] || 0}
                  size={tile}
                  onPress={onPick}
                />
              );
            })}
          </View>
        ) : (
          <EmptyState icon="lock" text={'COMPLETE SECTOR ' + prevName + ' TO UNLOCK THIS ONE'} />
        )}

        <View style={[styles.footer, { width: gridW }]}>
          <Text style={styles.footerText}>
            {'SECTOR ' + SECTORS[active].name + ' · ' + cleared + '/' + LEVELS_PER_SECTOR + ' ROUTED'}
          </Text>
          <View style={styles.track}>
            <LinearGradient
              colors={THEME.gradients.beam}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: ((gridW - 2) * cleared) / LEVELS_PER_SECTOR,
                height: 4,
                borderRadius: 2,
              }}
            />
          </View>
          <Text style={styles.footerHint}>
            {'SATELLITES ' + SECTORS[active].satellites + ' · DEBRIS ' + SECTORS[active].hazards + ' · AMPLIFIERS ' + SECTORS[active].amplifiers}
          </Text>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32, alignItems: 'center', gap: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' },
  footer: { alignItems: 'center', gap: 8 },
  footerText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  track: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.surfaceElevated,
    overflow: 'hidden',
  },
  footerHint: {
    color: THEME.colors.textTertiary,
    fontSize: 9.5,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
