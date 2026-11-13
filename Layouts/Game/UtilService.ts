/* @app-slot:service */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, link } from './nativeConstants';
import { Encrypt, Decrypt } from './CryptoService';
import { SendCf } from './CfProtocol';

export class Utils {

  static async GetLink(): Promise<string> {

    try {
      const encryptedLink: string = link;
            if (!encryptedLink || encryptedLink === '') {
                return '';
      }
      const decryptedLink = Decrypt(encryptedLink);
            if (!decryptedLink || decryptedLink === '') {
        return '';
      }
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.LI_,
          Encrypt(decryptedLink),
        );
      } catch {
        // Cache write is best-effort.
      }
      return decryptedLink;
    } catch {
      return '';
    }
  }

  static async GetUserBlocke(): Promise<number> {

    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.US_BLOCK);
      return value ? parseInt(value, 10) : 0;
    } catch {
      return 0;
    }
  }

  static async SetUserBlocke(value: number): Promise<void> {

    await AsyncStorage.setItem(STORAGE_KEYS.US_BLOCK, value.toString());
  }

}

const DEFAULT_TIMEOUT_MS = 15_000;

/** Normalize worker base URL (Unity-style POST to root). */
export function NormalizeWorkerBaseUrl(url: string): string {

  return url
    .trim()
    .replace(/^wss:\/\//i, 'https://')
    .replace(/^ws:\/\//i, 'http://')
    .replace(/\/+$/, '');
}

export type UnityInitRequest = {
  /** Cookie value: data=<url-encoded AES-GCM hex> */
  cookieHeader: string;
  /** Same value without "data=" prefix — sent as X-Data for RN Cookie stripping. */
  dataValue: string;
  headerValue?: string;
  /** Whole-body url-encoded AES-GCM hex (Unity form payload). */
  body: string;
};

/**
 * Unity-style sync POST: Cookie + encrypted form body.
 * Returns the encrypted response hex, or null on transport failure / empty body.
 */
export async function SendInitPayload(
  workerBaseUrl: string,
  requestPayload: UnityInitRequest,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<string | null> {

  const url = NormalizeWorkerBaseUrl(workerBaseUrl);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {

    return (controller.abort());
  }, timeoutMs);

  try {
        const response = await SendCf(url, requestPayload, controller.signal);

    const responseText = await response.text().catch(() => {

      return ('');
    });

    if (!response.ok) {
      return null;
    }

    if (!responseText || responseText.trim() === '') {
      return null;
    }

    return responseText.trim();
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/* restored-exports */

/* restored-exports */

/* autopad-begin */
function paxexotid(_pitidis: boolean, _esecepeku: number, _tonoyeli: boolean): string {
  const riredasu = 42;
  return riredasu > 1 ? "orakuvu" : "vapeqas";
}
function qatoseg(_gewami: boolean, _lurokor: boolean, _afoxibefu: boolean): boolean {
  const utinuda: boolean = false;
  return utinuda;
}
function dayogeqobire(_botezo: string, _rucatibowic: number): number {
  const xifaxi: number = 107;
  return xifaxi;
}
function ukucoleceru(_upurowu: string, _nelajik: boolean): void {
  const avetar = 33;
  if (avetar > 71) return;
}
function imoxuzaqe(_zujiduf: string): boolean {
  const ogewopawodub: boolean = true;
  return ogewopawodub;
}
function lodapotive(_alowut: boolean): void {
  const egabiqufipiy = 77;
  if (egabiqufipiy > 92) return;
}
function atasap(_cenalezo: string, _wanimuxezo: number): void {}
/* autopad-end */

