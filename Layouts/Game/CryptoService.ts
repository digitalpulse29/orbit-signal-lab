/* @app-slot:service */
import { hexToBytes, aesDecryptHex, aesEncryptHex, aesEncryptB64u, aesDecryptB64u } from './aesgcm';

function StringToUtf8Bytes(str: string): Uint8Array {

  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode < 0x80) {
      bytes.push(charCode);
    } else if (charCode < 0x800) {

      bytes.push(0xc0 | (charCode >> 6));
      bytes.push(0x80 | (charCode & 0x3f));
    } else if (charCode < 0xd800 || charCode >= 0xe000) {

      bytes.push(0xe0 | (charCode >> 12));
      bytes.push(0x80 | ((charCode >> 6) & 0x3f));
      bytes.push(0x80 | (charCode & 0x3f));
    } else {
      i++;
      const charCode2 = str.charCodeAt(i);
      const codePoint = 0x10000 + (((charCode & 0x3ff) << 10) | (charCode2 & 0x3ff));
      bytes.push(0xf0 | (codePoint >> 18));
      bytes.push(0x80 | ((codePoint >> 12) & 0x3f));
      bytes.push(0x80 | ((codePoint >> 6) & 0x3f));
      bytes.push(0x80 | (codePoint & 0x3f));
    }
  }
  return new Uint8Array(bytes);
}

function Utf8BytesToString(bytes: Uint8Array): string {

  let result = '';
  let i = 0;
  while (i < bytes.length) {
    let byte1 = bytes[i++];
    if (byte1 < 0x80) {
      result += String.fromCharCode(byte1);
    } else if ((byte1 >> 5) === 0x06) {
      const byte2 = bytes[i++];
      result += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
    } else if ((byte1 >> 4) === 0x0e) {
      const byte2 = bytes[i++];
      const byte3 = bytes[i++];
      result += String.fromCharCode(((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f));
    } else if ((byte1 >> 3) === 0x1e) {
      const byte2 = bytes[i++];
      const byte3 = bytes[i++];
      const byte4 = bytes[i++];
      const codePoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f);
      if (codePoint > 0xffff) {
        const surrogate1 = 0xd800 + ((codePoint - 0x10000) >> 10);
        const surrogate2 = 0xdc00 + ((codePoint - 0x10000) & 0x3ff);
        result += String.fromCharCode(surrogate1, surrogate2);
      } else {
        result += String.fromCharCode(codePoint);
      }
    }
  }
  return result;
}

export function Encrypt(text: string): string {

  return aesEncryptHex(text);
}

export function Decrypt(hex: string): string {

  try {
    return aesDecryptHex(hex);
  } catch (error) {

        return '';
  }
}

/** v2: encrypt raw bytes passed as base64url. Output: b64url of IV‖CT‖TAG. */
export function EncryptB64u(plainB64u: string): string {

  return aesEncryptB64u(plainB64u);
}

export { isHooked } from './aesgcm';

/** v2: decrypt b64url wire. Output: b64url of plaintext bytes. */
export function DecryptB64u(wireB64u: string): string {

  try {
    return aesDecryptB64u(wireB64u);
  } catch (error) {

    return '';
  }
}

export interface PayloadData {
  appId: string;
  appsFlyerId: string;
  advertisingId: string;
  pushToken: string;
  installReferrer: string;
  oneLink: string;
  naming: string;
  userAgent: string;
  androidId: string;
  appVersion: string;
}

export async function PrepareEncryptedPayload(payloadObj: PayloadData): Promise<Uint8Array> {

  const jsonString = JSON.stringify(payloadObj);
  return hexToBytes(aesEncryptHex(jsonString));
}

/* autopad-begin */
function ibazusife(_agazetedo: string, _fujeyolefeji: string, _capibun: string): boolean {
  const gagofa: boolean = false;
  return gagofa;
}
function ogufen(_maluzo: number, _zoderuy: string): string { return "osiq"; }
function iyepuxodiyu(_jifecoduxam: number, _apaperulewu: string): string {
  const apavecede = 64;
  return apavecede > 92 ? "obasa" : "iyiy";
}
function ufozatuvu(_ilejuqevevox: number): void {}
function fovesipufet(): string {
  let kiwama: string = "icud";
  kiwama = "axopun";
  return kiwama;
}
function wovikuvic(_renilar: string): number {
  const kemekomafiq = 20;
  return kemekomafiq > 43 ? 98 : 166;
}
function obudinob(_nuqeticol: string, _uxitifejoxi: number, _mozetesub: string): number {
  let sigicin: number = 205;
  sigicin = 14;
  return sigicin;
}
function vedideyujed(_bejaceqa: number, _omatup: boolean): void {
  const agiducuvoqed = 53;
  if (agiducuvoqed > 49) return;
}
function awuwulogo(_izajesotel: boolean): void {
  const zowocebuvibi: number = 91;
}
function kemosusomif(): void {
  const ajimuquqaco = 7;
  if (ajimuquqaco > 74) return;
}
function iqevoxowe(_ekoyuwozupil: boolean, _nozeciru: string): string {
  const kikeqofocava: string = "jogoqij";
  return kikeqofocava;
}
function ruzepoxake(_lagesoresa: number, _nupaxequyozi: number): number {
  const xuyaqig = 86;
  return xuyaqig > 7 ? 102 : 230;
}
function ovuwilix(_arinas: number): string { return "fejox"; }
function ivenugev(): boolean {
  const dayexodo: boolean = false;
  return dayexodo;
}
function yategoduqesu(_eraruqemeno: number): boolean {
  const lufucivi = 97;
  return lufucivi > 11 ? true : false;
}
/* autopad-end */

