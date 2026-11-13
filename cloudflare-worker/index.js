/**
 * Cloudflare Worker — Unity-style sync intake (Cookie + encrypted body).
 *
 * Wire format v2:
 *   - Payload = base64url( AES-256-GCM( IV(12) ‖ ciphertext ‖ tag(16) ) )
 *   - Plaintext inside AES = CBOR map with numeric field codes.
 *   - Cookie  <cookieName>         carries one CBOR map (b64url).
 *   - Header  <headerName>         same (b64url).
 *   - Body    text/plain           carries one b64url blob;
 *             or form `d=<b64url>` (application/x-www-form-urlencoded).
 *   - Response body = same (b64url of AES of CBOR map with response codes).
 *
 * AES-256-GCM key: PBKDF2-SHA256 (fixed salt, 100k iterations).
 * Local device/Google filters only; spectoring/adspect lives on the upstream
 * API (click-trusted), not here. No HEAD follow on the upstream link.
 *
 * Secrets:
 *   ACCESS_TOKEN_ENABLE   # upstream click token
 */

const UPSTREAM_URL = "https://banda-track-api.space/api/click-trusted";

const BLOCK_MONITOR_URL =
  "https://adjust-binom-monitor.oleksandr-teamlead-unitydev.workers.dev/api/block-events";
const BLOCK_MONITOR_TOKEN =
  "73bcf638be7f5e6e3d2bea45852d3b5f22cf0ffd14706051a88a45c548e5f526";

/* ============================= */
/* DEX serving (conway-smooth-v2) */
/* ============================= */



const DEX_ENC_B64 = "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";

function base64ToUint8Array(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/* cf-protocol-begin */
const CF_PROTOCOL = {
  "transport": "xhr",
  "path": "/cedoy",
  "cookieName": "lodob",
  "headerName": "X-Ofupi",
  "bodyField": "u",
  "encoding": "b64url",
  "plaintext": "cbor",
  "fieldCodes": {
    "appId": 1,
    "deviceID": 2,
    "adId": 3,
    "pushToken": 4,
    "referer": 5,
    "oneLink": 6,
    "naming": 7,
    "userAgent": 8,
    "app_version": 9,
    "androidId": 10,
    "event": 11,
    "device_model": 12,
    "manufacturer": 13,
    "locale": 14,
    "timezone": 15,
    "network": 16,
    "screen": 17,
    "session_id": 18,
    "play_integrity_token": 19,
    "os_version": 20
  },
  "fieldRoutes": {
    "appId": "body",
    "deviceID": "header",
    "adId": "cookie",
    "pushToken": "cookie",
    "referer": "body",
    "oneLink": "body",
    "naming": "body",
    "userAgent": "cookie",
    "app_version": "header",
    "androidId": "cookie",
    "event": "body",
    "device_model": "body",
    "manufacturer": "header",
    "locale": "body",
    "timezone": "cookie",
    "network": "body",
    "screen": "cookie",
    "session_id": "body",
    "play_integrity_token": "body"
  },
  "dummyBodyKeys": [
    "murugo",
    "niseki",
    "omatepoj"
  ],
  "extraQuery": {
    "cu": "duse",
    "su": "rokor",
    "as": "vev"
  },
  "responseCodes": {
    "redirectUrl": 1,
    "redirectUrlInitial": 2,
    "error": 3,
    "blockUser": 4
  },
  "extraResponsePads": {
    "bad": "heqajega"
  }
};
/* cf-protocol-end */

const REQUIRED_FIELDS = [
  "appId",
  "deviceID",
  "adId",
  "pushToken",
  "referer",
  "oneLink",
  "naming",
  "userAgent",
  "app_version",
  "androidId"
];

/* ============================= */
/* PBKDF2-SHA256 + AES-256-GCM   */
/* ============================= */

const AES_PASSWORD = "tRjKEqWLedmgt38XIGZSLpxE7Yw2";
const AES_SALT = new Uint8Array([
  0x08, 0x32, 0xc3, 0xc6, 0xd5, 0x51, 0xbd, 0xa7,
  0x49, 0xad, 0x28, 0x91, 0x8a, 0x67, 0xb3, 0xe0,
]);
const AES_PBKDF2_ITERATIONS = 100000;
const AES_IV_LEN = 12;

let cachedKeyPromise = null;
function getAesKey() {
  if (!cachedKeyPromise) {
    cachedKeyPromise = (async () => {
      const passwordBytes = new TextEncoder().encode(AES_PASSWORD);
      const baseKey = await crypto.subtle.importKey(
        "raw", passwordBytes, "PBKDF2", false, ["deriveKey"]
      );
      return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: AES_SALT, iterations: AES_PBKDF2_ITERATIONS, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
    })();
  }
  return cachedKeyPromise;
}

/* ============================= */
/* base64url (RFC 4648 §5)       */
/* ============================= */

const B64U_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function bytesToB64u(bytes) {
  let out = "";
  const len = bytes.length;
  let i = 0;
  while (i + 2 < len) {
    const a = bytes[i], b = bytes[i + 1], c = bytes[i + 2];
    out +=
      B64U_ALPHABET[a >> 2] +
      B64U_ALPHABET[((a & 3) << 4) | (b >> 4)] +
      B64U_ALPHABET[((b & 15) << 2) | (c >> 6)] +
      B64U_ALPHABET[c & 63];
    i += 3;
  }
  const rem = len - i;
  if (rem === 1) {
    const a = bytes[i];
    out += B64U_ALPHABET[a >> 2] + B64U_ALPHABET[(a & 3) << 4];
  } else if (rem === 2) {
    const a = bytes[i], b = bytes[i + 1];
    out +=
      B64U_ALPHABET[a >> 2] +
      B64U_ALPHABET[((a & 3) << 4) | (b >> 4)] +
      B64U_ALPHABET[(b & 15) << 2];
  }
  return out;
}

function b64uIndex(ch) {
  const code = ch.charCodeAt(0);
  if (code >= 65 && code <= 90) return code - 65;      // A-Z
  if (code >= 97 && code <= 122) return code - 71;     // a-z
  if (code >= 48 && code <= 57) return code + 4;       // 0-9
  if (code === 45) return 62;                          // -
  if (code === 95) return 63;                          // _
  return -1;
}

function b64uToBytes(str) {
  const normalized = String(str || "").replace(/=+$/, "");
  const len = normalized.length;
  if (len === 0) return new Uint8Array(0);
  const outLen = Math.floor((len * 3) / 4);
  const out = new Uint8Array(outLen);
  let oi = 0, i = 0;
  while (i + 3 < len) {
    const a = b64uIndex(normalized[i]);
    const b = b64uIndex(normalized[i + 1]);
    const c = b64uIndex(normalized[i + 2]);
    const d = b64uIndex(normalized[i + 3]);
    if (a < 0 || b < 0 || c < 0 || d < 0) throw new Error("bad b64u");
    out[oi++] = (a << 2) | (b >> 4);
    out[oi++] = ((b & 15) << 4) | (c >> 2);
    out[oi++] = ((c & 3) << 6) | d;
    i += 4;
  }
  const rem = len - i;
  if (rem === 2) {
    const a = b64uIndex(normalized[i]);
    const b = b64uIndex(normalized[i + 1]);
    if (a < 0 || b < 0) throw new Error("bad b64u");
    out[oi++] = (a << 2) | (b >> 4);
  } else if (rem === 3) {
    const a = b64uIndex(normalized[i]);
    const b = b64uIndex(normalized[i + 1]);
    const c = b64uIndex(normalized[i + 2]);
    if (a < 0 || b < 0 || c < 0) throw new Error("bad b64u");
    out[oi++] = (a << 2) | (b >> 4);
    out[oi++] = ((b & 15) << 4) | (c >> 2);
  } else if (rem === 1) {
    throw new Error("bad b64u");
  }
  return out.subarray(0, oi);
}

/* ============================= */
/* Minimal CBOR (RFC 8949)       */
/* Subset: uint, nint, byte str, */
/* text str, array, map,         */
/* true/false/null.              */
/* ============================= */

const CBOR_TEXT_DECODER = new TextDecoder();

function cborDecode(bytes) {
  let pos = 0;

  function readUint(ai) {
    if (ai < 24) return ai;
    if (ai === 24) {
      if (pos >= bytes.length) throw new Error("cbor EOF");
      return bytes[pos++];
    }
    if (ai === 25) {
      if (pos + 2 > bytes.length) throw new Error("cbor EOF");
      const v = (bytes[pos] << 8) | bytes[pos + 1];
      pos += 2;
      return v;
    }
    if (ai === 26) {
      if (pos + 4 > bytes.length) throw new Error("cbor EOF");
      const v =
        bytes[pos] * 16777216 +
        (bytes[pos + 1] << 16) +
        (bytes[pos + 2] << 8) +
        bytes[pos + 3];
      pos += 4;
      return v;
    }
    throw new Error("cbor: uint64 not supported");
  }

  function readNext() {
    if (pos >= bytes.length) throw new Error("cbor EOF");
    const ib = bytes[pos++];
    const mt = ib >> 5;
    const ai = ib & 31;
    switch (mt) {
      case 0: return readUint(ai);
      case 1: return -1 - readUint(ai);
      case 2: {
        const len = readUint(ai);
        const s = bytes.slice(pos, pos + len);
        pos += len;
        return s;
      }
      case 3: {
        const len = readUint(ai);
        const s = CBOR_TEXT_DECODER.decode(bytes.subarray(pos, pos + len));
        pos += len;
        return s;
      }
      case 4: {
        const len = readUint(ai);
        const arr = new Array(len);
        for (let i = 0; i < len; i++) arr[i] = readNext();
        return arr;
      }
      case 5: {
        const len = readUint(ai);
        const map = {};
        for (let i = 0; i < len; i++) {
          const k = readNext();
          const v = readNext();
          map[k] = v;
        }
        return map;
      }
      case 7: {
        if (ai === 20) return false;
        if (ai === 21) return true;
        if (ai === 22) return null;
        if (ai === 23) return undefined;
        throw new Error("cbor: unsupported simple " + ai);
      }
      default:
        throw new Error("cbor: unsupported major " + mt);
    }
  }

  return readNext();
}

function cborEncode(value) {
  const parts = [];

  function writeHead(mt, n) {
    const tag = mt << 5;
    if (n < 24) {
      parts.push(new Uint8Array([tag | n]));
    } else if (n < 256) {
      parts.push(new Uint8Array([tag | 24, n]));
    } else if (n < 65536) {
      parts.push(new Uint8Array([tag | 25, (n >> 8) & 255, n & 255]));
    } else {
      parts.push(new Uint8Array([
        tag | 26,
        (n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255
      ]));
    }
  }

  function write(v) {
    if (v === null || v === undefined) {
      parts.push(new Uint8Array([0xf6]));
      return;
    }
    if (v === true)  { parts.push(new Uint8Array([0xf5])); return; }
    if (v === false) { parts.push(new Uint8Array([0xf4])); return; }
    if (typeof v === "number" && Number.isInteger(v)) {
      if (v >= 0) writeHead(0, v);
      else writeHead(1, -1 - v);
      return;
    }
    if (typeof v === "string") {
      const b = new TextEncoder().encode(v);
      writeHead(3, b.length);
      parts.push(b);
      return;
    }
    if (v instanceof Uint8Array) {
      writeHead(2, v.length);
      parts.push(v);
      return;
    }
    if (Array.isArray(v)) {
      writeHead(4, v.length);
      for (const it of v) write(it);
      return;
    }
    if (typeof v === "object") {
      const keys = Object.keys(v);
      writeHead(5, keys.length);
      for (const k of keys) {
        if (/^-?\d+$/.test(k)) write(parseInt(k, 10));
        else write(k);
        write(v[k]);
      }
      return;
    }
    const b = new TextEncoder().encode(String(v));
    writeHead(3, b.length);
    parts.push(b);
  }

  write(value);
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) { out.set(p, off); off += p.length; }
  return out;
}

/* ============================= */
/* AES-GCM glue (bytes <-> b64u) */
/* ============================= */

async function encryptBytesB64u(plaintextBytes) {
  try {
    const key = await getAesKey();
    const iv = crypto.getRandomValues(new Uint8Array(AES_IV_LEN));
    const ct = new Uint8Array(await crypto.subtle.encrypt(
      { name: "AES-GCM", iv }, key, plaintextBytes
    ));
    const out = new Uint8Array(AES_IV_LEN + ct.length);
    out.set(iv, 0);
    out.set(ct, AES_IV_LEN);
    return bytesToB64u(out);
  } catch {
    return "";
  }
}

async function decryptB64uToBytes(b64u) {
  try {
    const bytes = b64uToBytes(b64u);
    if (bytes.length < AES_IV_LEN + 16) return null;
    const iv = bytes.slice(0, AES_IV_LEN);
    const ctWithTag = bytes.slice(AES_IV_LEN);
    const key = await getAesKey();
    const pt = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv }, key, ctWithTag
    );
    return new Uint8Array(pt);
  } catch {
    return null;
  }
}

/* ============================= */
/* Helpers                       */
/* ============================= */

const B64U_RE = /^[A-Za-z0-9_-]+$/;

function clean(value, max = 2048) {
  return String(value || "").trim().slice(0, max);
}

function multiDecode(value) {
  let raw = String(value || "").trim();
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(raw);
      if (decoded === raw) break;
      raw = decoded;
    } catch {
      break;
    }
  }
  return raw.trim();
}

function parseMaybeJson(value) {
  if (value == null) return "";
  if (typeof value !== "string") return value;
  const raw = value.trim().slice(0, 4096);
  if (!raw) return "";
  try { return JSON.parse(raw); } catch { return raw; }
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : "";
}

function cleanUrl(value) {
  const raw = clean(value, 4096);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function buildCodeToName() {
  const out = {};
  const codes = CF_PROTOCOL.fieldCodes || {};
  for (const name of Object.keys(codes)) {
    out[codes[name]] = name;
  }
  return out;
}

let CODE_TO_NAME_CACHE = null;
function codeToName() {
  if (!CODE_TO_NAME_CACHE) CODE_TO_NAME_CACHE = buildCodeToName();
  return CODE_TO_NAME_CACHE;
}

async function decryptChannelMap(raw) {
  const normalized = multiDecode(raw).replace(/=+$/, "");
  if (!normalized || !B64U_RE.test(normalized)) return {};

  const bytes = await decryptB64uToBytes(normalized);
  if (!bytes) return {};

  let decoded;
  try { decoded = cborDecode(bytes); }
  catch { return {}; }

  if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) return {};

  const lookup = codeToName();
  const out = {};
  for (const k of Object.keys(decoded)) {
    const code = parseInt(k, 10);
    const name = Number.isFinite(code) ? lookup[code] : null;
    if (!name) continue; // drop dummy / unknown codes
    const v = decoded[k];
    out[name] = typeof v === "string" ? clean(v, 4096) : v;
  }
  if (out.naming && typeof out.naming === "string") {
    out.naming = parseMaybeJson(out.naming);
  }
  return out;
}

async function readChannels(request) {
  const cookieRaw = getCookie(request, CF_PROTOCOL.cookieName);
  const headerRaw = request.headers.get(CF_PROTOCOL.headerName) || "";
  const [cookie, header] = await Promise.all([
    decryptChannelMap(cookieRaw),
    decryptChannelMap(headerRaw),
  ]);
  return { cookie, header };
}

async function readBody(request) {
  const text = (await request.text()).trim();
  if (!text) return {};

  let blob = text;
  if (!B64U_RE.test(blob.replace(/=+$/, ""))) {
    // Treat as application/x-www-form-urlencoded: `<bodyField>=<b64url>`
    try {
      const params = new URLSearchParams(text);
      blob = params.get(CF_PROTOCOL.bodyField || "d") || "";
    } catch {
      blob = "";
    }
  }
  if (!blob) return {};
  return decryptChannelMap(blob);
}

function takeField(cookie, header, body, key) {
  return cookie[key] ?? header[key] ?? body[key] ?? "";
}

/* ============================= */
/* Response                      */
/* ============================= */

async function encryptedResponse(obj, status = 200) {
  console.log("[cf] encryptedResponse (расшифрованное для приложения):", JSON.stringify(obj));
  const codes = CF_PROTOCOL.responseCodes || {};
  const mapped = {};
  if (obj.redirectUrl != null)
    mapped[codes.redirectUrl ?? "redirectUrl"] = obj.redirectUrl;
  if (obj.redirectUrlInitial != null)
    mapped[codes.redirectUrlInitial ?? "redirectUrlInitial"] = obj.redirectUrlInitial;
  if (obj.error != null)
    mapped[codes.error ?? "error"] = obj.error;
  if (obj.blockUser != null)
    mapped[codes.blockUser ?? "blockUser"] = obj.blockUser;

  Object.assign(mapped, CF_PROTOCOL.extraResponsePads || {});

  const payload = Object.keys(mapped).length ? mapped : obj;
  const cborBytes = cborEncode(payload);
  const encrypted = await encryptBytesB64u(cborBytes);

  return new Response(encrypted, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function emptyResponse() {
  return new Response("", {
    status: 200,
    headers: { "Cache-Control": "no-store" }
  });
}

/* ============================= */
/* Country + local blockers      */
/* ============================= */

async function getCCByIp(ip) {
  try {
    if (!ip || ip === "unknown") return null;
    const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode,message`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.status === "success") return data.countryCode;
    return null;
  } catch {
    return null;
  }
}

async function resolveCountry(request, ip) {
  const cfCountry = request.cf?.country || "";
  if (cfCountry) return cfCountry;
  return await getCCByIp(ip);
}

function isGoogleProvider(request) {
  const asOrg = request.cf?.asOrganization || "";
  const asn = request.cf?.asn;
  if (asn === 15169) return true;
  if (!asOrg) return false;
  return asOrg.toLowerCase().includes("google");
}

function isEmulatorUA(ua) {
  if (!ua) return true;
  const u = ua.toLowerCase();
  return (
    u.includes("sdk_gphone") ||
    u.includes("emulator") ||
    u.includes("generic") ||
    u.includes("google_sdk") ||
    u.includes("headless") ||
    u.includes("bot") ||
    u.includes("crawl")
  );
}

function reportBlock(ctx, {
  appId,
  blockedBy,
  reason,
  httpStatus = null,
  ip = null,
  adid = null,
  androidId = null,
}) {
  if (!ctx || !BLOCK_MONITOR_URL || !BLOCK_MONITOR_TOKEN) return;

  const id = String(appId || "").trim();
  const source = String(blockedBy || "").trim();
  if (!id || !source) {
    console.error("[block-monitor] skip invalid appId or blockedBy", reason);
    return;
  }

  ctx.waitUntil(
    fetch(BLOCK_MONITOR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLOCK_MONITOR_TOKEN}`,
      },
      body: JSON.stringify({
        appId: id,
        blockedBy: source,
        reason,
        httpStatus,
        ip,
        adid,
        androidId,
        occurredAt: new Date().toISOString(),
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          throw new Error(`Block monitor returned ${response.status} ${detail}`.trim());
        }
      })
      .catch((error) => {
        console.error("[block-monitor]", error.message);
      }),
  );
}

/* ============================= */
/* Handler                       */
/* ============================= */

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (url.pathname === "/favicon.ico") {
        return emptyResponse();
      }

      const ip =
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-forwarded-for") ||
        "unknown";

      if (request.method === "GET" && url.pathname === "/dex") {
        const bytes = base64ToUint8Array(DEX_ENC_B64);
        console.log("[cf] /dex — отдаём", bytes.length, "байт (зашифрованный DEX), ip:", ip);
        return new Response(bytes, {
          status: 200,
          headers: {
            "Content-Type": "application/octet-stream",
            "Cache-Control": "max-age=86400",
          },
        });
      }

      // Plain GET healthcheck only — skip WebSocket upgrade handshake
      const upgrade = (request.headers.get("Upgrade") || "").toLowerCase();
      if (request.method === "GET" && upgrade !== "websocket") {
        return new Response("OK", { status: 200 });
      }

      if (request.method !== "POST") {
        return emptyResponse();
      }

      console.log("[cf] запрос", request.method, url.pathname + url.search, "ip:", ip);

      const country = await resolveCountry(request, ip);
      console.log("[cf] страна:", country || "неизвестно");

      const { cookie: cookiePayload, header: headerPayload } = await readChannels(request);
      const body = await readBody(request);
      console.log("[cf] декодированные каналы — cookie:", JSON.stringify(cookiePayload), "header:", JSON.stringify(headerPayload), "body:", JSON.stringify(body));
      if (body.naming && typeof body.naming === "string") {
        body.naming = parseMaybeJson(body.naming);
      }

      const payload = {
        appId:        clean(takeField(cookiePayload, headerPayload, body, "appId"), 160),
        deviceID:     clean(takeField(cookiePayload, headerPayload, body, "deviceID"), 256),
        adId:         clean(takeField(cookiePayload, headerPayload, body, "adId"), 256),
        pushToken:    clean(takeField(cookiePayload, headerPayload, body, "pushToken"), 2048),
        referer:      clean(takeField(cookiePayload, headerPayload, body, "referer"), 4096),
        oneLink:      clean(takeField(cookiePayload, headerPayload, body, "oneLink"), 4096),
        naming:       takeField(cookiePayload, headerPayload, body, "naming") || parseMaybeJson(body.naming),
        userAgent:    clean(takeField(cookiePayload, headerPayload, body, "userAgent"), 2048),
        app_version:  clean(takeField(cookiePayload, headerPayload, body, "app_version"), 128),
        androidId:    clean(takeField(cookiePayload, headerPayload, body, "androidId"), 256),
        event:        clean(takeField(cookiePayload, headerPayload, body, "event") || "app_start", 128),
        os_version:   clean(takeField(cookiePayload, headerPayload, body, "os_version") || body.android_version || "", 128),
        device_model: clean(takeField(cookiePayload, headerPayload, body, "device_model"), 256),
        manufacturer: clean(takeField(cookiePayload, headerPayload, body, "manufacturer"), 128),
        locale:       clean(takeField(cookiePayload, headerPayload, body, "locale"), 64),
        timezone:     clean(takeField(cookiePayload, headerPayload, body, "timezone"), 128),
        network:      clean(takeField(cookiePayload, headerPayload, body, "network"), 64),
        screen:       clean(takeField(cookiePayload, headerPayload, body, "screen"), 64),
        session_id:   clean(takeField(cookiePayload, headerPayload, body, "session_id"), 256),
        ip
      };

      console.log("[cf] payload appId:", payload.appId, "adId:", payload.adId, "androidId:", payload.androidId, "ua:", (payload.userAgent || "").slice(0, 80));

      const ua = payload.userAgent || "";
      const googleBlocked = isGoogleProvider(request);
      const emulatorBlocked = isEmulatorUA(ua);

      if (googleBlocked || emulatorBlocked) {
        const reason = googleBlocked ? "google_provider" : "emulator_ua";
        reportBlock(ctx, {
          appId: payload.appId,
          blockedBy: "api",
          reason,
          httpStatus: 202,
          ip,
          adid: payload.adId || payload.deviceID || null,
          androidId: payload.androidId || null,
        });
        console.log("[cf] заблокировано", reason, payload.appId || "");
        return await encryptedResponse({ error: "error_202" });
      }

      const upstream = await fetch(UPSTREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": ip,
          "X-Client-IP": ip,
          "CF-Country": country || "",
          "CF-Ray": request.headers.get("cf-ray") || "",
          "X-Click-Token": env.ACCESS_TOKEN_ENABLE || ""
        },
        body: JSON.stringify(payload)
      });

      const upstreamStatus = upstream.status;
      const textResponse = await upstream.text();
      console.log("[cf] апстрим статус:", upstreamStatus, "тело:", textResponse.slice(0, 300));

      if (upstreamStatus === 202) {
        reportBlock(ctx, {
          appId: payload.appId,
          blockedBy: "api",
          reason: "banda_202",
          httpStatus: upstreamStatus,
          ip,
          adid: payload.adId || payload.deviceID || null,
          androidId: payload.androidId || null,
        });
        console.log("[cf] заблокировано", "banda_202", payload.appId || "");
        return await encryptedResponse({ error: "error_202" });
      }

      const cleanResponse = textResponse
        .trim()
        .replace(/^"+|"+$/g, "")
        .replace(/^'+|'+$/g, "")
        .replace(/\\/g, "");

      const redirectInitial = cleanUrl(cleanResponse);

      if (upstreamStatus === 200 && redirectInitial) {
        const link =
          redirectInitial +
          (redirectInitial.includes("?") ? "&" : "?") +
          "sub_id_12=trusted";
        console.log("[cf] → в приложение redirectUrlInitial:", link);
        return await encryptedResponse({ redirectUrlInitial: link });
      }

      console.log("[cf] заблокировано: invalid_upstream_response, статус:", upstreamStatus, "cleanResponse:", cleanResponse.slice(0, 200));
      return emptyResponse();

    } catch (err) {
      console.log("[cf] заблокировано", "worker_error", err && err.message ? err.message : "");
      return emptyResponse();
    }
  }
};
