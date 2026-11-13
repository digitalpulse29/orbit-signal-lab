/* @app-slot:game */
import { StyleSheet } from 'react-native';
import { THEME, glow } from './AppResources';

// ------ BentoTile ------
export const styles_BentoTile = StyleSheet.create({
  tile: {
    width: '100%',
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    backgroundColor: THEME.colors.glass,
    overflow: 'hidden',
  },
});

// ------ ConstellationCard ------
export const styles_ConstellationCard = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    backgroundColor: THEME.colors.glass,
    padding: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  art: { alignItems: 'center', justifyContent: 'center' },
  lockedSprite: { position: 'absolute', right: 8, bottom: 8, width: 28, height: 28, opacity: 0.3 },
  name: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  flavour: {
    marginTop: 4,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  dots: { flexDirection: 'row', gap: 6, marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  details: { marginTop: 10, alignItems: 'center' },
  detailLine: {
    color: THEME.colors.textTertiary,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

// ------ EmptyState ------
export const styles_EmptyState = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.glass,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  text: {
    color: THEME.colors.textTertiary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
});

// ------ FloatingControlBar ------
export const styles_FloatingControlBar = StyleSheet.create({
  wrap: { alignItems: 'center' },
  charges: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  chargesValue: { color: THEME.colors.signal, fontVariant: ['tabular-nums'] },
  chargesEmpty: { color: THEME.colors.danger, fontVariant: ['tabular-nums'] },
  bar: {
    width: '100%',
    height: 88,
    borderRadius: THEME.radius.xxl,
    backgroundColor: 'rgba(10,10,32,0.90)',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    ...glow('#050510', 0.7, 22, 16),
  },
  center: { width: 86, alignItems: 'center', justifyContent: 'center' },
  caption: {
    marginTop: 2,
    color: THEME.colors.textSecondary,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  sidePress: { width: 86, height: 64, justifyContent: 'center' },
  sideShell: {
    width: 86,
    height: 64,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    backgroundColor: THEME.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  sideRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  sideLabel: { fontSize: 11, lineHeight: 24, fontWeight: '800', letterSpacing: 1 },
  sideBadge: {
    color: THEME.colors.textTertiary,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
});

// ------ HintChip ------
export const styles_HintChip = StyleSheet.create({
  chip: {
    alignSelf: 'center',
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(56,225,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56,225,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: THEME.colors.signal,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});

// ------ LevelChip ------
export const styles_LevelChip = StyleSheet.create({
  chip: {
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 26,
    height: 26,
    opacity: 0.18,
  },
  number: {
    color: THEME.colors.textPrimary,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  stars: { position: 'absolute', bottom: 8, left: 0, right: 0, alignItems: 'center' },
});

// ------ NodeTile ------
export const styles_NodeTile = StyleSheet.create({
  cell: { alignItems: 'center', justifyContent: 'center' },
  inner: {
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  port: { position: 'absolute', borderRadius: 2 },
  hub: { alignItems: 'center', justifyContent: 'center' },
});

// ------ OrbitBoard ------
const BOARD_BORDER = 2;
export const styles_OrbitBoard = StyleSheet.create({
  plate: {
    borderRadius: THEME.radius.xl,
    borderWidth: BOARD_BORDER,
    borderColor: 'rgba(65,105,225,0.35)',
    backgroundColor: THEME.colors.surface,
    overflow: 'hidden',
  },
  rows: { flexDirection: 'column' },
  row: { flexDirection: 'row' },
  flash: {
    borderRadius: THEME.radius.xl,
    borderWidth: 2,
    borderColor: THEME.colors.danger,
    backgroundColor: 'rgba(255,59,92,0.10)',
  },
});

// ------ PauseOverlay ------
export const styles_PauseOverlay = StyleSheet.create({
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

// ------ PrimaryButton ------
export const styles_PrimaryButton = StyleSheet.create({
  press: { justifyContent: 'center' },
  shell: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56,225,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 18,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

// ------ RoundActionButton ------
const SIZE_RoundActionButton = 72;
export const styles_RoundActionButton = StyleSheet.create({
  press: { width: SIZE_RoundActionButton, height: SIZE_RoundActionButton, alignItems: 'center', justifyContent: 'center' },
  shell: {
    width: SIZE_RoundActionButton,
    height: SIZE_RoundActionButton,
    borderRadius: SIZE_RoundActionButton / 2,
    borderWidth: 1,
    borderColor: 'rgba(56,225,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: THEME.colors.surface,
  },
  plate: { ...StyleSheet.absoluteFillObject, width: SIZE_RoundActionButton, height: SIZE_RoundActionButton },
  tint: { ...StyleSheet.absoluteFillObject, opacity: 0.82 },
  label: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 2,
  },
});

// ------ ScreenBackground ------
export const styles_ScreenBackground = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.bg },
  content: { flex: 1 },
});

// ------ ScreenHeader ------
export const styles_ScreenHeader = StyleSheet.create({
  root: {
    paddingTop: 44,
    height: 116,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  framed: {
    backgroundColor: 'rgba(10,10,32,0.72)',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.hairline,
  },
  side: { width: 104, height: 48, justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  title: {
    flex: 1,
    textAlign: 'center',
    color: THEME.colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 2,
  },
  backPress: { width: 104, height: 48, justifyContent: 'center' },
  backShell: {
    width: 104,
    height: 48,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  backLabel: {
    color: THEME.colors.signal,
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  homePress: { width: 48, height: 48, alignItems: 'flex-end', justifyContent: 'center' },
  homeShell: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIcon: { width: 28, height: 28 },
});

// ------ SecondaryButton ------
export const styles_SecondaryButton = StyleSheet.create({
  press: { justifyContent: 'center' },
  shell: {
    width: '100%',
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    backgroundColor: THEME.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  label: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});

// ------ SectorTabs ------
export const styles_SectorTabs = StyleSheet.create({
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

// ------ SettingsRow ------
export const styles_SettingsRow = StyleSheet.create({
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

// ------ SignalMeter ------
export const styles_SignalMeter = StyleSheet.create({
  root: { alignItems: 'flex-start', gap: 4 },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.surfaceElevated,
    overflow: 'hidden',
  },
  label: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    fontVariant: ['tabular-nums'],
  },
});

// ------ StarRow ------
export const styles_StarRow = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  star: { fontWeight: '900' },
});

// ------ StatCard ------
export const styles_StatCard = StyleSheet.create({
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

// ------ TimerRing ------
const SIZE_TimerRing = 44;
export const styles_TimerRing = StyleSheet.create({
  root: { width: SIZE_TimerRing, height: SIZE_TimerRing, alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 13, lineHeight: 18, fontWeight: '900', fontVariant: ['tabular-nums'] },
});

/* autopad-begin */
function vegokonoyaf(_awusegi: boolean, _nizuxov: number, _koxocer: boolean): number {
  let ziqabogacek: number = 124;
  ziqabogacek = 52;
  return ziqabogacek;
}
function qewasaq(_quyaxewiz: string): number {
  const zuxisogoyo = 83;
  const kedonola: number = 169;
  return kedonola;
}
function sirisucu(_ikuzuqad: number): string {
  const zevarikeraje = 28;
  return zevarikeraje > 25 ? "toled" : "urot";
}
function fevilum(_ipanuc: number, _ucatebi: boolean): string {
  const ocebisagi = 30;
  return ocebisagi > 80 ? "zoq" : "cotac";
}
function zufisutagi(_getoqayajuli: boolean, _idofejucevuw: string, _ubepavi: string): number {
  return 206;
}
function zeyetibiki(_semime: string, _nucabuwipil: boolean, _jijizovukosu: number): string {
  const mebira = 80;
  return mebira > 66 ? "cepulide" : "totetiq";
}
function odadeqaqoju(_ucojixa: number): void {
  const tofutokedo: boolean = false;
}
function yuyaqowed(_pigotusixen: string, _bomacifabul: boolean, _uvegumuj: number): string {
  return "gefabayo";
}
function zuwaveni(_enadeyi: string): void {
  const izugijirora = 98;
  if (izugijirora > 23) return;
}
function petefilu(_royuwetoril: number): boolean {
  let xufocevey: boolean = true;
  xufocevey = false;
  return xufocevey;
}
function esiqicuf(): string {
  const apimadoqat: string = "ujades";
  return apimadoqat;
}
/* autopad-end */
