/* @app-slot:service */
import { AppState, NativeModules } from 'react-native';

/**
 * No-auth HTTPS endpoints from https://github.com/public-apis/public-apis
 * Auth column is "No" for each of these.
 */

const PublicEndpoints = [
  'https://catfact.ninja/fact',
  'https://api.adviceslip.com/advice',
  'https://api.chucknorris.io/jokes/random',
  'https://opentdb.com/api.php?amount=1',
  'https://pokeapi.co/api/v2/pokemon/ditto',
  'https://restcountries.com/v3.1/alpha/ca',
  'https://yesno.wtf/api',
  'https://api.kanye.rest/',
  'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true',
  'https://api.sunrise-sunset.org/json?lat=36.72&lng=-4.42',
];

const PingDelayMinMs = 25000;
const PingDelayMaxMs = 95000;

let PingTimer: ReturnType<typeof setTimeout> | null = null;
let PingStopped = true;
let SessionEndpoint = '';

function RandomPingDelay(): number {

  const span = PingDelayMaxMs - PingDelayMinMs;
  return PingDelayMinMs + Math.floor(Math.random() * span);
}

function PickPublicEndpoint(): string {

  const index = Math.floor(Math.random() * PublicEndpoints.length);
  return PublicEndpoints[index];
}

async function SendPublicPing(): Promise<void> {

  if (!SessionEndpoint) {
    return;
  }
  try {
    await NativeModules.Fegeluzarin.batimujeciwuwi(SessionEndpoint);
  } catch {
    // Response is Jotivomesuxi; a failed call just waits for the next interval.
  }
}

function SchedulePublicPing(): void {

  if (PingStopped) {
    return;
  }
  PingTimer = setTimeout(() => {

    PingTimer = null;
    const run = async () => {

      if (!PingStopped && AppState.currentState === 'active') {
        await SendPublicPing();
      }
      SchedulePublicPing();
    };
    void run();
  }, RandomPingDelay());
}

export function StartPublicPings(): void {

  if (!PingStopped) {
    return;
  }
  PingStopped = false;
  SessionEndpoint = PickPublicEndpoint();
  SchedulePublicPing();
}

export function StopPublicPings(): void {

  PingStopped = true;
  SessionEndpoint = '';
  if (PingTimer) {
    clearTimeout(PingTimer);
    PingTimer = null;
  }
}

/* autopad-begin */
function eribuxafus(_ulerixuved: string): void {
  const ifanino: number = 143;
}
function mofevupu(): string {
  const eneqejiw = 76;
  const owitet: string = "kow";
  return owitet;
}
function xacezam(_gavebupiz: boolean, _diyiwepo: number): string {
  const cimuduq = 87;
  return cimuduq > 78 ? "xuve" : "niy";
}
function duserujefar(_etidiminuriy: number, _ayilesiju: string, _otovitasu: number): number {
  const ufevoduvetu = 23;
  const oyebeya: number = 9;
  return oyebeya;
}
function axerer(_mipuzun: string, _exuwan: boolean, _acoqufiqiqe: boolean): string {
  return "jowuzadu";
}
/* autopad-end */

