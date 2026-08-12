/**
 * Cloudflare Pages Function — serves js/firebase-config.js
 * with real Firebase credentials injected from env vars.
 *
 * Set these in Cloudflare Pages → Settings → Environment variables:
 *   FIREBASE_API_KEY
 *   FIREBASE_AUTH_DOMAIN
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_STORAGE_BUCKET
 *   FIREBASE_MESSAGING_SENDER_ID
 *   FIREBASE_APP_ID
 */
export async function onRequest(context) {
  var env = context.env;

  var missing = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
  ].filter(function (k) { return !env[k]; });

  if (missing.length) {
    var errScript = '/* AbiLearn — Firebase NOT configured.\n' +
      '   Missing env vars: ' + missing.join(', ') + '\n' +
      '   Set them in Cloudflare Pages → Settings → Environment variables.\n' +
      '*/\nconsole.error("[AbiLearn] Firebase not configured. Missing:", ' +
      JSON.stringify(missing) + ');\n' +
      'window._firebaseConfigMissing = true;\n';
    return new Response(errScript, {
      headers: { 'Content-Type': 'application/javascript; charset=utf-8' }
    });
  }

  function esc(s) {
    return String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }

  var script =
    '(function () {\n' +
    '  var firebaseConfig = {\n' +
    "    apiKey:            '" + esc(env.FIREBASE_API_KEY)            + "',\n" +
    "    authDomain:        '" + esc(env.FIREBASE_AUTH_DOMAIN)        + "',\n" +
    "    projectId:         '" + esc(env.FIREBASE_PROJECT_ID)         + "',\n" +
    "    storageBucket:     '" + esc(env.FIREBASE_STORAGE_BUCKET)     + "',\n" +
    "    messagingSenderId: '" + esc(env.FIREBASE_MESSAGING_SENDER_ID)+ "',\n" +
    "    appId:             '" + esc(env.FIREBASE_APP_ID)             + "'\n" +
    '  };\n' +
    '  if (!firebase.apps.length) {\n' +
    '    firebase.initializeApp(firebaseConfig);\n' +
    '  }\n' +
    '  window._fauth = firebase.auth();\n' +
    '  window._fdb   = firebase.firestore();\n' +
    '  window._fdb.enablePersistence({ synchronizeTabs: true }).catch(function () {});\n' +
    '})();\n';

  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
