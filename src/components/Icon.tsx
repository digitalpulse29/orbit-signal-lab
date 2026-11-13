import React from 'react';
import { View } from 'react-native';
import * as Lucide from 'lucide-react-native';

/**
 * ONE icon library for the whole project (lucide-react-native).
 * The lookup is defensive: a missing export renders a blank box of the same
 * size instead of crashing the screen.
 */
export type IconName =
  | 'bolt'
  | 'star'
  | 'grid'
  | 'chart'
  | 'settings'
  | 'back'
  | 'lock'
  | 'undo'
  | 'play'
  | 'pause'
  | 'timer'
  | 'eye'
  | 'palette'
  | 'trash'
  | 'target'
  | 'radio';

const L = Lucide as unknown as Record<string, React.ComponentType<any>>;

const MAP: Record<IconName, React.ComponentType<any> | undefined> = {
  bolt: L.Zap,
  star: L.Star,
  grid: L.LayoutGrid,
  chart: L.BarChart3,
  settings: L.Settings,
  back: L.ArrowLeft,
  lock: L.Lock,
  undo: L.RotateCcw,
  play: L.Play,
  pause: L.Pause,
  timer: L.Timer,
  eye: L.Eye,
  palette: L.Palette,
  trash: L.Trash2,
  target: L.Target,
  radio: L.Radio,
};

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, color = '#F2F5FF', strokeWidth = 2 }: IconProps) {
  const Component = MAP[name];
  if (!Component) {
    return <View style={{ width: size, height: size }} />;
  }
  return <Component size={size} color={color} strokeWidth={strokeWidth} />;
}
