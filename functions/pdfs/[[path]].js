/**
 * AbiLearn — PDF Hotlink Protection
 * Cloudflare Pages Function: intercepts every /pdfs/* request.
 *
 * Policy:
 *   • No Referer header  → allow (bookmarks, privacy-mode browsers, mobile apps)
 *   • Referer from AbiLearn domains → allow
 *   • Referer from any other origin → 403 (hotlinking / embedding blocked)
 *
 * Note: Referer-based checks are a deterrent, not cryptographic security.
 * A sophisticated actor can spoof headers. This blocks casual hotlinking,
 * scrapers that don't set Referer, and all embedded/iframe abuse.
 */

const ALLOWED_ORIGINS = [
  'https://www.abilearn.co.in',
  'https://abilearn.co.in',
];

const BLOCKED_HTML =
  '<!DOCTYPE html>' +
  '<html lang="en"><head><meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>Protected — AbiLearn</title>' +
  '<style>' +
    'body{font-family:system-ui,sans-serif;text-align:center;padding:4rem 1.5rem;' +
         'max-width:520px;margin:auto;color:#333;background:#f9f8ff}' +
    'h1{color:#3b28cc;font-size:1.5rem;margin:1rem 0 .5rem}' +
    'p{color:#555;line-height:1.6;margin:.5rem 0}' +
    'a{color:#5B47DE;font-weight:600}' +
    'footer{margin-top:2.5rem;font-size:.75rem;color:#999}' +
  '</style>' +
  '</head><body>' +
  '<div style="font-size:3rem">🔒</div>' +
  '<h1>Content Protected</h1>' +
  '<p>This educational resource belongs to <strong>AbiLearn</strong> and ' +
     'may not be hotlinked, embedded, or redistributed.</p>' +
  '<p>Visit <a href="https://www.abilearn.co.in">www.abilearn.co.in</a> ' +
     'to access study materials.</p>' +
  '<footer>&copy; AbiLearn. All rights reserved.</footer>' +
  '</body></html>';

export async function onRequest(context) {
  const { request } = context;

  /* Only intercept GET / HEAD — let OPTIONS through for CORS preflight */
  const method = request.method.toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') {
    return context.next();
  }

  const referer = request.headers.get('Referer') || '';

  /* Determine if the request originates from our own site */
  const isAllowed =
    referer === '' ||
    ALLOWED_ORIGINS.some(function (origin) {
      return referer.startsWith(origin);
    });

  if (!isAllowed) {
    return new Response(BLOCKED_HTML, {
      status: 403,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

  /* Allowed — fetch from static assets and add protective response headers */
  const response = await context.next();

  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate');
  headers.set('X-Content-Type-Options', 'nosniff');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
