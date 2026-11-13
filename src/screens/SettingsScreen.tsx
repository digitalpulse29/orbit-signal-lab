import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ScreenBackground } from '../components/ScreenBackground';
import { HomeSlot, ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { Segmented, SettingsRow, Toggle } from '../components/SettingsRow';
import { SIGNAL_WINDOWS, type SignalWindowId } from '../constants/config';
import { THEME, type BeamPalette } from '../constants/theme';
import type { Progress, Settings } from '../game/progression';

export interface SettingsScreenProps {
  progress: Progress;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
  onMenu: () => void;
}

export function SettingsScreen({ progress, onChange, onReset, onMenu }: SettingsScreenProps) {
  const settings = progress.settings;
  const [armed, setArmed] = useState(false);

  return (
    <ScreenBackground overlay={THEME.overlay.panel} drift={!settings.reducedMotion}>
      <ScreenHeader
        title="SETTINGS"
        onBack={onMenu}
        backLabel="MENU"
        rightSlot={<HomeSlot onPress={onMenu} />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <SettingsRow
          icon="timer"
          label="SIGNAL WINDOW"
          note={'EVERY RUN LASTS ' + activeWindowLabel(settings.signalWindow)}
          stacked>
          <Segmented
            options={SIGNAL_WINDOWS.map(w => ({ id: w.id, label: w.label }))}
            value={settings.signalWindow}
            onSelect={id => onChange({ signalWindow: id as SignalWindowId })}
          />
        </SettingsRow>

        <SettingsRow
          icon="palette"
          label="BEAM PALETTE"
          note="REPAINTS THE BEAM AND THE NODE PORTS"
          stacked>
          <Segmented
            options={[
              { id: 'cosmic', label: 'COSMIC' },
              { id: 'contrast', label: 'HIGH CONTRAST' },
            ]}
            value={settings.beamPalette}
            onSelect={id => onChange({ beamPalette: id as BeamPalette })}
          />
        </SettingsRow>

        <SettingsRow icon="eye" label="SHOW GUIDES" note="ROTATION HINT AND LEGAL-TARGET GLOW">
          <Toggle
            value={settings.showGuides}
            onToggle={() => onChange({ showGuides: !settings.showGuides })}
          />
        </SettingsRow>

        <SettingsRow icon="target" label="REDUCED MOTION" note="STOPS DRIFT, SPIN AND PLATE SHAKE">
          <Toggle
            value={settings.reducedMotion}
            onToggle={() => onChange({ reducedMotion: !settings.reducedMotion })}
          />
        </SettingsRow>

        <SettingsRow icon="trash" label="RESET LAB DATA" note="WIPES PROGRESS, STARS AND HISTORY" danger>
          <SecondaryButton
            label={armed ? 'CONFIRM RESET' : 'RESET'}
            width={armed ? 150 : 96}
            height={48}
            tint={THEME.colors.danger}
            onPress={() => {
              if (armed) {
                setArmed(false);
                onReset();
              } else {
                setArmed(true);
              }
            }}
          />
        </SettingsRow>

        <Text style={styles.note}>
          {'THIS LAB RUNS FULLY OFFLINE · NO ADS · NO PURCHASES · NO AUDIO'}
        </Text>
      </ScrollView>
    </ScreenBackground>
  );
}

function activeWindowLabel(id: SignalWindowId): string {
  const found = SIGNAL_WINDOWS.find(w => w.id === id);
  return found ? found.seconds + ' SECONDS' : '80 SECONDS';
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  note: {
    marginTop: 6,
    color: THEME.colors.textTertiary,
    fontSize: 9.5,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
});
