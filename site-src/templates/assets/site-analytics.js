import firebaseConfig from './firebase-config.js';

const isProduction = location.hostname === 'sparkish-xyz.github.io';
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const debug = new URLSearchParams(location.search).get('analytics_debug') === '1';
const hasConfig = ['apiKey', 'projectId', 'appId', 'measurementId'].every(
  key => typeof firebaseConfig[key] === 'string' && firebaseConfig[key].trim()
) && /^G-[A-Z0-9]+$/.test(firebaseConfig.measurementId);

if (hasConfig && (isProduction || (isLocal && debug))) {
  startAnalytics().catch(() => {
    // Network restrictions and content blockers must not interrupt the page.
    console.warn('[analytics] Firebase Analytics could not be loaded.');
  });
}

async function startAnalytics() {
  const [{ initializeApp }, { initializeAnalytics, isSupported, logEvent }] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js'),
  ]);
  if (!(await isSupported())) return;

  const product = location.pathname.split('/')[1];
  const context = {
    app_name: { aquatick: 'AquaTick', alarmcrew: 'AlarmCrew', kinetto: 'KINETTO' }[product] || 'Sparkish',
    page_language: document.documentElement.lang,
    page_path: location.pathname,
  };
  const analytics = initializeAnalytics(initializeApp(firebaseConfig), {
    config: {
      // Log one explicit page view with product and locale dimensions.
      send_page_view: false,
      ...(debug ? { debug_mode: true } : {}),
    },
  });

  logEvent(analytics, 'page_view', {
    ...context,
    page_title: document.title,
    page_location: location.origin + location.pathname + location.search,
  });

  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    const url = new URL(link.href);
    if (url.hostname !== 'apps.apple.com') return;

    logEvent(analytics, 'app_store_click', {
      ...context,
      link_url: url.origin + url.pathname,
      placement: link.closest('section[id]')?.id || (link.closest('header') ? 'header' : 'page'),
    });
  });
}
