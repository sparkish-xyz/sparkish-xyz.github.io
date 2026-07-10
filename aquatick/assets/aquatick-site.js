(function () {
  var VALID = ['ko', 'en', 'ja'];
  var match = location.pathname.match(/\/aquatick\/(ko|en|ja)(?:\/|$)/);
  var canStorePreference = true;

  function rememberLanguage(lang) {
    if (!canStorePreference) return;
    try {
      localStorage.setItem('aquaLangPref', lang);
    } catch (e) {
      canStorePreference = false;
    }
  }

  if (match && VALID.indexOf(match[1]) !== -1) {
    rememberLanguage(match[1]);
  }

  document.querySelectorAll('[data-aqua-lang]').forEach(function (el) {
    el.addEventListener('click', function () {
      var lang = el.getAttribute('data-aqua-lang');
      if (VALID.indexOf(lang) !== -1) {
        rememberLanguage(lang);
      }
    });
  });
})();


(function () {
  var nav = document.querySelector('.site-header');
  var last = 0;

  if (!nav) return;
  window.addEventListener('scroll', function () {
    var y = window.scrollY || 0;
    nav.style.boxShadow = (y > 60 && y > last) ? 'var(--shadow-card)' : '';
    last = y;
  }, { passive: true });
})();