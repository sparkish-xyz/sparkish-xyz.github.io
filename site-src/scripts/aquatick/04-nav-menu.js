(function () {
  var menu = document.querySelector('.nav-menu');

  if (!menu) return;

  var summary = menu.querySelector('summary');

  function closeMenu() {
    menu.open = false;
  }

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !menu.open) return;
    closeMenu();
    if (summary) summary.focus();
  });

  document.addEventListener('click', function (event) {
    if (menu.open && !menu.contains(event.target)) closeMenu();
  });
})();
