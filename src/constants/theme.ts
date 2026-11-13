/** SPACE_COSMOS preset, tuned for ORBIT SIGNAL LAB (DIMENSIONAL_LAYERING). */
export const THEME = {
  name: 'SPACE_COSMOS',
  colors: {
    bg: '#050510',
    surface: '#0A0A20',
    surfaceElevated: '#10103A',
    surfaceAlt: '#0A1628',
    primary: '#4169E1',
    secondary: '#7B2FBE',
    signal: '#38E1FF',
    warning: '#FFC24B',
    danger: '#FF3B5C',
    textPrimary: '#F2F5FF',
    textSecondary: '#9AA6D8',
    textTertiary: '#5C6793',
    hairline: 'rgba(255,255,255,0.08)',
    glass: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.10)',
    portDark: '#3A4170',
    starEmpty: '#2A2E4A',
  },
  overlay: {
    loader: ['rgba(5,5,16,0.94)', 'rgba(10,10,32,0.92)', 'rgba(5,5,16,0.97)'],
    menu: ['rgba(10,10,32,0.55)', 'rgba(5,5,16,0.86)'],
    board: ['rgba(5,5,16,0.76)', 'rgba(10,10,32,0.90)'],
    panel: ['rgba(10,10,32,0.68)', 'rgba(5,5,16,0.90)'],
    win: ['rgba(65,105,225,0.55)', 'rgba(5,5,16,0.92)'],
    loss: ['rgba(255,59,92,0.35)', 'rgba(5,5,16,0.94)'],
  },
  gradients: {
    primary: ['#4169E1', '#7B2FBE'],
    beam: ['#38E1FF', '#4169E1'],
    amber: ['#FFC24B', '#E8893F'],
    danger: ['#FF3B5C', '#7B2FBE'],
  },
  radius: { sm: 10, md: 14, lg: 18, xl: 22, xxl: 28, pill: 100 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  tabular: { fontVariant: ['tabular-nums' as const] },
};

export function glow(color: string, opacity = 0.4, radius = 20, elevation = 12) {
  return {
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: 6 },
    elevation,
  };
}

export type BeamPalette = 'cosmic' | 'contrast';

export function beamColors(palette: BeamPalette) {
  if (palette === 'contrast') {
    return {
      beam: '#FFC24B',
      under: '#FFFFFF',
      port: '#FFFFFF',
      portDark: '#5C6793',
    };
  }
  return {
    beam: '#38E1FF',
    under: '#4169E1',
    port: '#38E1FF',
    portDark: '#3A4170',
  };
}
