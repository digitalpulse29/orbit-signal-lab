/* @app-slot:game */
import { StyleSheet } from 'react-native';
import { THEME } from './AppResources';

// ------ CollectionScreen ------
export const styles_CollectionScreen = StyleSheet.create({
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

// ------ GameScreen ------
const HUD_H_GameScreen = 46;
const HINT_H_GameScreen = 44;
const BAR_BLOCK_H_GameScreen = 88 + 22 + 24;
export const styles_GameScreen = StyleSheet.create({
  hud: {
    height: HUD_H_GameScreen,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hudRight: { alignItems: 'flex-end' },
  linked: {
    color: THEME.colors.signal,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
    fontVariant: ['tabular-nums'],
  },
  level: {
    color: THEME.colors.textTertiary,
    fontSize: 9.5,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  hintRow: { height: HINT_H_GameScreen, justifyContent: 'center' },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: BAR_BLOCK_H_GameScreen,
  },
  barWrap: { position: 'absolute', left: 16, right: 16, bottom: 24 },
  pausePress: { width: 48, height: 48, alignItems: 'flex-end', justifyContent: 'center' },
  pauseShell: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIcon: { width: 28, height: 28 },
});

// ------ LevelSelectScreen ------
export const styles_LevelSelectScreen = StyleSheet.create({
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

// ------ LoaderScreen ------
const CARD_LoaderScreen = 196;
const RING_LoaderScreen = 86;
export const styles_LoaderScreen = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: {
    width: CARD_LoaderScreen,
    height: CARD_LoaderScreen,
    borderRadius: THEME.radius.xxl,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  ring: { position: 'absolute', width: RING_LoaderScreen * 2, height: RING_LoaderScreen * 2 },
  logo: { width: 132, height: 132 },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
    textShadowColor: THEME.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitle: {
    marginTop: 12,
    color: THEME.colors.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
  },
  barBlock: { marginTop: 44, alignItems: 'center' },
  track: {
    width: 212,
    height: 5,
    borderRadius: 3,
    backgroundColor: THEME.colors.surfaceElevated,
    overflow: 'hidden',
  },
  fill: { height: 5, borderRadius: 3, overflow: 'hidden' },
  fillGradient: { flex: 1, borderRadius: 3 },
  status: {
    marginTop: 14,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 4,
  },
});

// ------ MenuScreen ------
export const styles_MenuScreen = StyleSheet.create({
  brandLogo: { width: 34, height: 34 },
  badge: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(65,105,225,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  badgeText: {
    color: THEME.colors.signal,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  body: { flex: 1, paddingHorizontal: 16 },
  hint: {
    color: THEME.colors.textSecondary,
    fontSize: 10.5,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
    marginBottom: 14,
  },
  bento: { flexDirection: 'row', gap: 12 },
  bentoLeft: { flex: 58 },
  bentoRight: { flex: 42, gap: 12 },
  playPress: { width: '100%', height: 212 },
  playTile: {
    width: '100%',
    height: 212,
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(56,225,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 12,
  },
  playSprite: { width: 72, height: 72, marginBottom: 12 },
  playLabel: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  playSub: {
    marginTop: 6,
    color: '#D8E2FF',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  statInner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  statValue: { fontSize: 24, lineHeight: 30, fontWeight: '900', fontVariant: ['tabular-nums'] },
  statLabel: {
    marginTop: 4,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  firstRun: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  firstRunSprite: { width: 56, height: 56, marginBottom: 12, opacity: 0.8 },
  firstRunText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  routeRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  routeSlot: { flex: 1 },
  routeInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  routeIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLabel: {
    flexShrink: 1,
    color: THEME.colors.textPrimary,
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  spacer: { flex: 1, minHeight: 12 },
  footer: {
    color: THEME.colors.textTertiary,
    fontSize: 9.5,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginBottom: 18,
  },
});

// ------ ProgressScreen ------
export const styles_ProgressScreen = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32, gap: 14 },
  hero: { alignItems: 'center', marginBottom: 4 },
  heroValue: {
    color: THEME.colors.signal,
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '900',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  heroLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  block: {
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.glass,
    padding: 14,
    gap: 10,
  },
  blockTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  sectorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectorName: {
    width: 104,
    color: THEME.colors.textSecondary,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  sectorTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.surfaceElevated,
    overflow: 'hidden',
  },
  sectorFillRow: { flex: 1, flexDirection: 'row' },
  sectorValue: {
    width: 34,
    textAlign: 'right',
    color: THEME.colors.textPrimary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  runRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  runDot: { width: 8, height: 8, borderRadius: 4 },
  runLevel: {
    width: 70,
    color: THEME.colors.textPrimary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  runOutcome: {
    flex: 1,
    color: THEME.colors.textTertiary,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  runScore: {
    color: THEME.colors.signal,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
});

// ------ ResultScreen ------
export const styles_ResultScreen = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32, alignItems: 'center' },
  outcome: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  note: {
    marginTop: 6,
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  level: {
    marginTop: 4,
    color: THEME.colors.textTertiary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  stars: { marginTop: 18 },
  score: {
    marginTop: 16,
    color: THEME.colors.textPrimary,
    fontSize: 46,
    lineHeight: 54,
    fontWeight: '900',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  scoreLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  statRow: { width: '100%', marginTop: 20 },
  banner: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  bannerSprite: { width: 40, height: 40 },
  bannerText: { fontSize: 13, lineHeight: 20, fontWeight: '800', letterSpacing: 1.2 },
  buttons: { width: '100%', marginTop: 22, gap: 12 },
  secondaryRow: { flexDirection: 'row', gap: 12 },
  secondarySlot: { flex: 1 },
});

// ------ SettingsScreen ------
export const styles_SettingsScreen = StyleSheet.create({
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

/* autopad-begin */
function toseyecuxod(): void {
  const ebujure = 75;
  if (ebujure > 34) return;
}
function yoxacoma(): string { return "wotopid"; }
function mubefonetoke(_elezeg: boolean): number {
  const imazoni: number = 65;
  return imazoni;
}
function maqadidus(_opababase: string, _ucewigate: number): boolean { return true; }
function gemogeb(_ekakiwig: string): number {
  const afucigiri = 10;
  return afucigiri > 24 ? 181 : 110;
}
function musuxufi(_tiqebupeb: string, _lodamezolay: string, _uwufifob: boolean): string {
  const biyukivuwiy = 53;
  return biyukivuwiy > 56 ? "jenolofi" : "fariwuyi";
}
function uzomucoqew(_wajoqegomeba: number): boolean { return true; }
function xolutuv(_besunuse: boolean, _ijixad: number, _avaxer: string): number {
  return 64;
}
function wabekubifis(_erijizujuxa: string, _neneyaj: boolean): void {
  const omexuvonuqoj: boolean = true;
}
function ducisaje(_iquxeyu: number, _acofequgazas: boolean, _xufoku: boolean): string {
  return "ibizezak";
}
function ovagadeku(_benuwizod: string, _jeqavopule: string): number {
  let kovota: number = 123;
  kovota = 203;
  return kovota;
}
function ediruqolopu(_seyekijadi: string, _qexaveweqeju: number): number {
  return 234;
}
function ogapuqozi(): string {
  const rebutil = 96;
  const yanojoxajas: string = "kukoz";
  return yanojoxajas;
}
function maduneqobe(_mudulokegog: string, _zipugo: boolean, _ujubidiwuy: number): boolean {
  const lotiruza = 65;
  const kovapalubug: boolean = true;
  return kovapalubug;
}
function yezipe(_utarabi: number, _ibilaju: number, _luriqadubo: boolean): boolean {
  const usilobuwiva = 49;
  const lidusayaf: boolean = false;
  return lidusayaf;
}
function joyiqotub(_citijatul: string, _guribanem: number, _uxutafaye: string): string {
  let qekunowo: string = "kilulof";
  qekunowo = "dinayisi";
  return qekunowo;
}
function ulemeyid(): string {
  const kesixucos = 97;
  return kesixucos > 48 ? "cebamona" : "icuda";
}
function dudebolowexo(_yewudizil: string): string {
  const obasejanifed: string = "ototirof";
  return obasejanifed;
}
/* autopad-end */
