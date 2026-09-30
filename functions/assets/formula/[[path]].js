/* AbiLearn — Firebase JWT gate for /assets/formula/*
 *
 * Identical to functions/pdfs/[[path]].js — guards formula PNG images.
 * See that file for full comments.
 */

const FIREBASE_PROJECT = 'abilearn-89c92';
const KEYS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwks/' +
  'securetoken@system.gserviceaccount.com';

let _keys = null;
let _keysExpiry = 0;

async function getPublicKeys() {
  if (_keys && Date.now() < _keysExpiry) return _keys;
  const r = await fetch(KEYS_URL);
  if (!r.ok) throw new Error('key fetch failed');
  const json = await r.json();
  const ma = /max-age=(\d+)/.exec(r.headers.get('Cache-Control') || '');
  _keysExpiry = Date.now() + (ma ? +ma[1] * 1000 : 3_600_000);
  _keys = Object.fromEntries(json.keys.map(k => [k.kid, k]));
  return _keys;
}

function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (s.length % 4)) % 4;
  s += '='.repeat(pad);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function verifyFirebaseToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('malformed');

  const dec = new TextDecoder();
  const header  = JSON.parse(dec.decode(b64urlToBytes(parts[0])));
  const payload = JSON.parse(dec.decode(b64urlToBytes(parts[1])));

  if (Date.now() / 1000 > payload.exp) throw new Error('expired');
  if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT}`) throw new Error('bad iss');
  if (payload.aud !== FIREBASE_PROJECT) throw new Error('bad aud');

  const keys = await getPublicKeys();
  const jwk  = keys[header.kid];
  if (!jwk) throw new Error('unknown kid');

  const key = await crypto.subtle.importKey(
    'jwk', jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['verify']
  );

  const sigInput = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const sig      = b64urlToBytes(parts[2]);
  const valid    = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sig, sigInput);
  if (!valid) throw new Error('bad signature');
}

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin':  request.headers.get('Origin') || '*',
        'Access-Control-Allow-Headers': 'Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age':       '86400',
      },
    });
  }

  const auth  = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await verifyFirebaseToken(token);
  } catch (_) {
    return new Response('Unauthorized', { status: 401 });
  }

  return env.ASSETS.fetch(request);
}
