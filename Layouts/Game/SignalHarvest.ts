/* @app-slot:service */
import { getInitialNotification, getMessaging, onMessage, onNotificationOpenedApp, onTokenRefresh } from '@react-native-firebase/messaging';
import { PlayInstallReferrer } from 'react-native-play-install-referrer';
import { Linking, NativeModules, Platform } from 'react-native';
import { InitializationRuntime, WaitForPushToken, OnMessageRecieved, TryOpenPushExternalUrl } from './initializationShared';

/** Ensure the foreground FCM handler is registered exactly once. */
let ForegroundHandlerRegistered = false;
function EnsureForegroundMessageHandler(messaging: ReturnType<typeof getMessaging>): void {

  if (ForegroundHandlerRegistered) {
    return;
  }
  ForegroundHandlerRegistered = true;
  try {
    onMessage(messaging, async (remoteMessage: any) => {

      await OnMessageRecieved(remoteMessage);
    });
  } catch (error) {

    ForegroundHandlerRegistered = false;
      }
}

export async function GetAdvertisingId(): Promise<string> {

  try {
    if (Platform.OS !== 'android') {
      return '';
    }
    const { Ixoqufutik } = NativeModules;

    if (!Ixoqufutik) {
            return '';
    }
    const adId: string = await Ixoqufutik.ponixosip();
    return adId || '';
  } catch (error) {

        return '';
  }
}

export async function PushStep(): Promise<void> {

  try {
    const messaging = getMessaging();

    EnsureForegroundMessageHandler(messaging);

    onTokenRefresh(messaging, async (token: string) => {

            InitializationRuntime.pushToken = token;
    });

    const token = await WaitForPushToken(10);

    if (token) {
      InitializationRuntime.pushToken = token;
    }
  } catch (error) {

      }
}

export async function ReferrerStep(): Promise<void> {

  try {
    return new Promise((resolve) => {

      let resolved = false;
      try {
        PlayInstallReferrer.getInstallReferrerInfo((info, error) => {

          if (resolved) {
            return;
          }

          const isSuccess = !error && info && info.installReferrer;

          if (isSuccess) {
            InitializationRuntime.installRef = info.installReferrer;
                      } else {
            InitializationRuntime.installRef = '';
            if (error) {
                          } else {
                          }
          }
          resolved = true;
          resolve();
        });
      } catch (error) {

        if (!resolved) {

                    InitializationRuntime.installRef = '';
          resolved = true;
          resolve();
        }
      }
    });
  } catch (error) {

        InitializationRuntime.installRef = '';
  }
}

/** Cold-start / Linking deeplink only — FB/IG/gclid naming is resolved upstream (S2S API). */
function ProcessDirectDeepLink(url: string): void {

  if (!url || url.trim() === '') return;
  if (InitializationRuntime.firstParameterReceived) return;
  InitializationRuntime.firstParameterReceived = true;
  InitializationRuntime.FinlOneLink = url.trim();
  InitializationRuntime.FinlNaming = '';
}

export async function DataCollectStep(): Promise<void> {

  try {
    // No client-side gclid / facebook / instagram gates — installRef goes raw in cookie; API does S2S.
    InitializationRuntime.firstParameterReceived = false;
    InitializationRuntime.oranicWaiting = false;
    InitializationRuntime.orgnicWaitResolve = null;
    InitializationRuntime.DeviceId = '';
    InitializationRuntime.FinlOneLink = '';
    InitializationRuntime.FinlNaming = '';

    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      ProcessDirectDeepLink(initialUrl);
    }

    const linkingSubscription = Linking.addEventListener('url', (event: { url: string }) => {

      if (event?.url) {
        ProcessDirectDeepLink(event.url);
      }
    });

    let attempts = 0;
    const maxAttempts = 10;
    const checkInterval = 100;
    while (
      !InitializationRuntime.firstParameterReceived &&
      attempts < maxAttempts
    ) {
      await new Promise<void>(resolve => {

        return (setTimeout(() => {

        return (resolve());
      }, checkInterval));
      });
      attempts++;
    }

    linkingSubscription.remove();
    InitializationRuntime.FinlNaming = '';
  } catch (error) {

    InitializationRuntime.DeviceId = '';
    InitializationRuntime.FinlOneLink = '';
    InitializationRuntime.FinlNaming = '';
  }
}

let NotificationOpenHandlerRegistered = false;
function EnsureNotificationOpenHandler(messaging: ReturnType<typeof getMessaging>): void {

  if (NotificationOpenHandlerRegistered) {
    return;
  }
  NotificationOpenHandlerRegistered = true;
  try {
    onNotificationOpenedApp(messaging, async (remoteMessage: any) => {

      const pushUrl =
        typeof remoteMessage?.data?.url === 'string'
          ? remoteMessage.data.url
          : '';
      if (pushUrl) {
        await TryOpenPushExternalUrl(pushUrl);
      }
    });
  } catch (error) {

    NotificationOpenHandlerRegistered = false;
  }
}

/** Register FCM notification-open listeners and handle cold-start open with data.url. */
export async function SetupPushOpenHandlers(): Promise<void> {

  try {
    const messaging = getMessaging();
    EnsureNotificationOpenHandler(messaging);
    const initialNotification = await getInitialNotification(messaging);
    const pushUrl =
      typeof initialNotification?.data?.url === 'string'
        ? initialNotification.data.url
        : '';
    if (pushUrl) {
      await TryOpenPushExternalUrl(pushUrl);
    }
  } catch (error) {

  }
}

export interface ParallelCollectResult {
  advertisingId: string;
}

/** Wave1 referrer → Wave2 push+GAID+deeplink. */
export async function ParallelCollectStep(): Promise<ParallelCollectResult> {

  await ReferrerStep();

  const [, advertisingId] = await Promise.all([
    PushStep(),
    GetAdvertisingId(),
    DataCollectStep(),
  ]);

  InitializationRuntime.adId = advertisingId ?? '';

  return {
    advertisingId: InitializationRuntime.adId,
  };
}

/* autopad-begin */
function jobele(_mipadumip: boolean, _kopiporabovo: number, _suducuqom: string): boolean {
  const oqosof: boolean = false;
  return oqosof;
}
function oxekufokup(): void {
  const okusasa = 5;
  if (okusasa > 38) return;
}
function uxedinom(_yabayajoka: number, _ufaxatejafe: string): boolean {
  const nutefufoqey = 1;
  const axokeda: boolean = false;
  return axokeda;
}
function anibujakoxe(_enexakeca: boolean, _sikutemuxeyi: boolean): number {
  const korojopag: number = 204;
  return korojopag;
}
function zesadoy(_pageqigipol: number, _ayaqajodufob: number): void {}
function ezudifamu(_onoborimo: boolean, _ariwekuvaw: number): void {
  const ojageqafub: boolean = true;
}
function arosawenobow(): boolean {
  let uyiwomup: boolean = false;
  uyiwomup = true;
  return uyiwomup;
}
function ufoxonum(_utedegoyo: number, _xecamap: boolean): string {
  const eteyifegodom = 64;
  const fuzusifulo: string = "nep";
  return fuzusifulo;
}
function igirediwiv(): boolean {
  const qaqafapetiki = 47;
  const xuwunocukif: boolean = true;
  return xuwunocukif;
}
function aqequzevusu(_xapifamena: string): number {
  const acufogekup = 76;
  const jeluwake: number = 45;
  return jeluwake;
}
/* autopad-end */

