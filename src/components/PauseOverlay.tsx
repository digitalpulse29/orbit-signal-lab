import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

export interface PauseOverlayProps {
  onResume: () => void;
  onMenu: () => void;
  linked: number;
  satellites: number;
}

export function PauseOverlay({ onResume, onMenu, linked, satellites }: PauseOverlayProps) {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.title}>SIGNAL PAUSED</Text>
        <Text style={styles.note}>
          {'THE SIGNAL WINDOW AND THE FLARE SCHEDULE ARE HELD'}
        </Text>
        <Text style={styles.linked}>{'LINKED ' + linked + '/' + satellites}</Text>
        <View style={styles.buttons}>
          <PrimaryButton label="RESUME" onPress={onResume} icon="play" height={56} />
          <SecondaryButton label="MENU" onPress={onMenu} icon="back" height={48} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,5,16,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: THEME.radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.35)',
    backgroundColor: THEME.colors.surface,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  note: {
    marginTop: 8,
    color: THEME.colors.textTertiary,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  linked: {
    marginTop: 14,
    color: THEME.colors.signal,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontVariant: ['tabular-nums'],
  },
  buttons: { width: '100%', marginTop: 20, gap: 12 },
});
