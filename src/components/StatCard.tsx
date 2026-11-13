import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '../constants/theme';
import { Icon } from './Icon';

export interface StatCardProps {
  value?: number | string | null;
  label: string;
  accent: string;
  /** hide the card entirely when the value is empty or zero */
  hideWhenEmpty?: boolean;
}

/**
 * ONE icon shape for every pill in a row - the pills are told apart by their
 * accent colour, their number and their label, never by a different sprite.
 * Renders null instead of an empty rounded box.
 */
export function StatCard({ value, label, accent, hideWhenEmpty = true }: StatCardProps) {
  const empty =
    value === null ||
    value === undefined ||
    value === '' ||
    (typeof value === 'number' && value === 0);
  if (empty && hideWhenEmpty) {
    return null;
  }

  return (
    <View style={[styles.card, { borderColor: accent + '44' }]}>
      <View style={[styles.iconWrap, { backgroundColor: accent + '22' }]}>
        <Icon name="bolt" size={28} color={accent} />
      </View>
      <Text style={[styles.value, { color: accent }]} numberOfLines={1}>
        {String(value)}
      </Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

/** Renders the row only when at least two pills survive the empty check. */
export function StatRow({ children }: { children: React.ReactNode }) {
  const visible = React.Children.toArray(children).filter(Boolean);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {visible.map((child, i) => (
        <View key={i} style={styles.slot}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  slot: { flex: 1 },
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    backgroundColor: THEME.colors.glass,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
});
