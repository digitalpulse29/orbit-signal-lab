import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SECTORS } from '../constants/levels';
import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface SectorTabsProps {
  active: number;
  onSelect: (index: number) => void;
}

export function SectorTabs({ active, onSelect }: SectorTabsProps) {
  return (
    <View style={styles.row}>
      {SECTORS.map(sector => (
        <Tab
          key={sector.index}
          label={sector.name}
          active={sector.index === active}
          onPress={() => onSelect(sector.index)}
        />
      ))}
    </View>
  );
}

function Tab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.chip,
          {
            borderColor: active ? THEME.colors.signal : THEME.colors.border,
            backgroundColor: active ? 'rgba(56,225,255,0.12)' : THEME.colors.glass,
            transform: [{ scale }],
          },
        ]}>
        <Text
          style={[
            styles.label,
            { color: active ? THEME.colors.signal : THEME.colors.textSecondary },
          ]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  press: { flex: 1, height: 48, justifyContent: 'center' },
  chip: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 12, lineHeight: 18, fontWeight: '800', letterSpacing: 1.4 },
});
