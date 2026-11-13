/* @app-slot:service */
import { NativeModules } from 'react-native';

const intake = NativeModules.Kokiboqaguj;

/**
 * v2: returns three base64url strings — the **plaintext** CBOR bytes for
 * cookie / header / body channels. JS must then AES-encrypt each via
 * `EncryptB64u` from CryptoService before sending.
 */
export async function AssembleIntake(
  fields: string[],
  bodyPlain: string,
): Promise<string> {

  return intake.mubucucux(fields, bodyPlain);
}

/**
 * v2: input is base64url of the AES-decrypted plaintext bytes. Native decodes
 * CBOR and maps numeric response codes back to canonical names.
 */
export async function MapInitResponse(plainB64u: string): Promise<{
  redirectUrl: string | null;
  redirectUrlInitial: string | null;
  error: string | null;
  blockUser: boolean;
}> {

  return intake.qidigohetusaxa(plainB64u);
}

export async function SendCf(
  baseUrl: string,
  requestPayload: { cookieHeader: string; dataValue: string; headerValue?: string; body: string },
  _signal?: AbortSignal,
): Promise<{ ok: boolean; text: () => Promise<string> }> {

  const text = String(
    (await intake.tasutamefez(
      baseUrl,
      requestPayload.dataValue,
      requestPayload.headerValue || '',
      requestPayload.body,
    )) ?? '',
  );
  return { ok: Boolean(text), text: async () => ((text)) };
}

/* autopad-begin */
function amudobocezi(_axepewiye: boolean): boolean {
  const axolelanec = 74;
  const otapeyuco: boolean = true;
  return otapeyuco;
}
function boqarifof(_unojuqop: string, _caquyawewiy: boolean): number {
  const fumuzey = 33;
  const jipoqug: number = 228;
  return jipoqug;
}
function iwosobedirup(_wupesuwozu: boolean, _efejonewu: number): boolean {
  const ipoqafuvidu = 5;
  return ipoqafuvidu > 52 ? false : false;
}
/* autopad-end */

