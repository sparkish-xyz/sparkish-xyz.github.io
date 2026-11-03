(function () {
  'use strict';
  var section = document.getElementById('cats');
  if (!section) return;
  var list = section.querySelector('.cat-tabs');
  var tabs = Array.from(section.querySelectorAll('[data-cat-tab]'));
  var panels = Array.from(section.querySelectorAll('[data-cat-panel]'));
  if (!list || !tabs.length || tabs.length !== panels.length) return;

  // This is a website preview. Selecting a cat does not change app preferences.
  // Without JavaScript every cat and its availability remain readable.
  function select(index, moveFocus) {
    tabs.forEach(function (tab, i) {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (moveFocus) tabs[index].focus({ preventScroll: true });
  }
  list.setAttribute('role', 'tablist');
  tabs.forEach(function (tab, index) {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', function () { select(index, false); });
    tab.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next, true);
    });
  });
  section.querySelector('.cat-panels').classList.add('is-enhanced');
  list.hidden = false;
  section.querySelector('.cat-picker-hint').hidden = false;
  select(2, false);
})();
