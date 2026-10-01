// Native language disclosure, with dismissal and keyboard focus restoration.
(() => {
  const menu = document.querySelector('.language-menu');
  if (!(menu instanceof HTMLDetailsElement)) return;
  const summary = menu.querySelector('summary');
  document.addEventListener('click', event => {
    if (event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      if (summary instanceof HTMLElement) summary.focus();
    }
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
})();
