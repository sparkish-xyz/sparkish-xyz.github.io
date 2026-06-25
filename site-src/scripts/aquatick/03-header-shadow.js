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