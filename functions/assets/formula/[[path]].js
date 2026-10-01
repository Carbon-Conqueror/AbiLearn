/* AbiLearn — Static pass-through for /assets/formula/*
 *
 * Subject pages do not load the Firebase SDK (auth-stub.js), so no
 * ID token is ever available. The auth gate has been removed; formula
 * images are served publicly, matching the same access level as the
 * HTML pages that embed them. Content protection is enforced client-side
 * via watermark.js and protect.js.
 */
export async function onRequest({ request, env }) {
  return env.ASSETS.fetch(request);
}
