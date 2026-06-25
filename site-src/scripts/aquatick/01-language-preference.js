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
