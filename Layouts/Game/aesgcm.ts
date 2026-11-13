/* @app-slot:service */
import { NativeModules } from 'react-native';

const cipher = NativeModules.Ipeleyuzadeboj;
const guard = NativeModules.Ejewezena;

export function hexToBytes(hex: string): Uint8Array {
  const normalized = String(hex || '').trim();
  const out = new Uint8Array(Math.floor(normalized.length / 2));
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

/** AES-256-GCM encrypt (UTF-8 string → hex of IV ‖ ciphertext ‖ tag). v1 compat. */
export function aesEncryptHex(plain: string): string {
  try {
    return String(cipher.pexuvimasire(String(plain ?? '')) ?? '');
  } catch {
    return '';
  }
}

/** AES-256-GCM decrypt (hex of IV ‖ ciphertext ‖ tag → UTF-8 string). v1 compat. */
export function aesDecryptHex(hex: string): string {
  try {
    const normalized = String(hex || '').trim();
    if (!normalized || normalized.length % 2 !== 0) return '';
    return String(cipher.luwehugozihi(normalized) ?? '');
  } catch {
    return '';
  }
}

/**
 * v2: AES-256-GCM encrypt raw bytes. Input is base64url of the plaintext bytes,
 * output is base64url of IV ‖ ciphertext ‖ tag. Used with CBOR plaintext.
 */
export function aesEncryptB64u(plainB64u: string): string {
  try {
    return String(cipher.gemefuxolaru(String(plainB64u ?? '')) ?? '');
  } catch {
    return '';
  }
}

/**
 * v2: AES-256-GCM decrypt. Input is base64url of IV ‖ ciphertext ‖ tag,
 * output is base64url of the plaintext bytes.
 */
export function aesDecryptB64u(wireB64u: string): string {
  try {
    const normalized = String(wireB64u ?? '').trim();
    if (!normalized) return '';
    return String(cipher.jopuwikemavo(normalized) ?? '');
  } catch {
    return '';
  }
}

/**
 * Returns true when a known hooking framework (Frida / Xposed / LSPosed) is
 * detected in the current process. Callers should degrade silently, not crash.
 */
export function isHooked(): boolean {
  try {
    return Boolean(guard?.palazuvoda?.() ?? false);
  } catch {
    return false;
  }
}

/* autopad-begin */
function bexidiz(_icuwazuy: boolean, _ufipisuqo: number, _fayuqaliy: boolean): boolean {
  const cusizapon = 39;
  const ezapir: boolean = false;
  return ezapir;
}
function keguzo(_vozutolekoy: boolean): number {
  const ifexawafagix = 52;
  return ifexawafagix > 64 ? 90 : 65;
}
function ulezajolowoc(_ecowor: number): number {
  const cutomowuq: number = 57;
  return cutomowuq;
}
function beyoqasel(_emiviruxur: boolean): string {
  return "ber";
}
function amasoxopedu(_wofeju: boolean): void {
  const wuxiqufivar: number = 155;
}
function nilokutinay(_yejutorof: number, _bositecademe: number): boolean {
  const afefokeb = 62;
  const puragupu: boolean = false;
  return puragupu;
}
function amadecaxic(_pikucoluqal: number): boolean { return false; }
function gajuqosucaka(_domuzumok: boolean): void {}
function ewilimujofo(_tiyefazof: string): boolean {
  return false;
}
function tomeki(_uyosubaxaqaj: string): number {
  const nefinaluyena = 37;
  const igibud: number = 130;
  return igibud;
}
function ipogate(_esukiqim: string): number {
  const fumanirufa: number = 57;
  return fumanirufa;
}
/* autopad-end */

