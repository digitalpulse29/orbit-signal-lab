import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { Icon, type IconName } from './Icon';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface SettingsRowProps {
  icon: IconName;
  label: string;
  note?: string;
  danger?: boolean;
  /** puts the control on its own line under the label (wide segmented controls) */
  stacked?: boolean;
  children: React.ReactNode;
}

export function SettingsRow({ icon, label, note, danger, stacked, children }: SettingsRowProps) {
  return (
    <View
      style={[
        styles.row,
        stacked ? styles.rowStacked : null,
        danger ? { borderColor: 'rgba(255,59,92,0.4)' } : null,
      ]}>
      <View style={[styles.left, stacked ? styles.leftStacked : null]}>
        <View style={styles.iconWrap}>
          <Icon
            name={icon}
            size={24}
            color={danger ? THEME.colors.danger : THEME.colors.signal}
          />
        </View>
        <View style={styles.texts}>
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
          {note ? (
            <Text style={styles.note} numberOfLines={2}>
              {note}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={[styles.control, stacked ? styles.controlStacked : null]}>{children}</View>
    </View>
  );
}

export interface SegmentedProps {
  options: Array<{ id: string; label: string }>;
  value: string;
  onSelect: (id: string) => void;
}

export function Segmented({ options, value, onSelect }: SegmentedProps) {
  return (
    <View style={styles.segments}>
      {options.map(option => (
        <Segment
          key={option.id}
          label={option.label}
          active={option.id === value}
          onPress={() => onSelect(option.id)}
        />
      ))}
    </View>
  );
}

function Segment({
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
      style={styles.segmentPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.segment,
          {
            borderColor: active ? THEME.colors.signal : THEME.colors.border,
            backgroundColor: active ? 'rgba(56,225,255,0.12)' : 'transparent',
            transform: [{ scale }],
          },
        ]}>
        <Text
          style={[
            styles.segmentLabel,
            { color: active ? THEME.colors.signal : THEME.colors.textSecondary },
          ]}
          numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export interface ToggleProps {
  value: boolean;
  onToggle: () => void;
  labelOn?: string;
  labelOff?: string;
}

export function Toggle({ value, onToggle, labelOn = 'ON', labelOff = 'OFF' }: ToggleProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(true);
  return (
    <Pressable
      onPress={onToggle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={value ? labelOn : labelOff}
      style={styles.togglePress}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.toggle,
          {
            borderColor: value ? THEME.colors.signal : THEME.colors.border,
            backgroundColor: value ? 'rgba(56,225,255,0.14)' : THEME.colors.glass,
            transform: [{ scale }],
          },
        ]}>
        <Text
          style={[
            styles.toggleLabel,
            { color: value ? THEME.colors.signal : THEME.colors.textTertiary },
          ]}>
          {value ? labelOn : labelOff}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.glass,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rowStacked: { flexDirection: 'column', alignItems: 'stretch', gap: 12 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  leftStacked: { flexShrink: 0 },
  controlStacked: { alignItems: 'flex-start' },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(56,225,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flexShrink: 1 },
  label: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  note: {
    color: THEME.colors.textTertiary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  control: { alignItems: 'flex-end' },
  segments: { flexDirection: 'row', gap: 6 },
  segmentPress: { height: 40, justifyContent: 'center' },
  segment: {
    height: 32,
    minWidth: 54,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentLabel: { fontSize: 10, lineHeight: 14, fontWeight: '800', letterSpacing: 0.8 },
  togglePress: { width: 72, height: 44, alignItems: 'flex-end', justifyContent: 'center' },
  toggle: {
    width: 72,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: { fontSize: 11, lineHeight: 16, fontWeight: '900', letterSpacing: 1.4 },
});
