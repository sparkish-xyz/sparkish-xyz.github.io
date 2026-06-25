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
  var totalEl = document.getElementById('demo-total');
  var pctEl = document.getElementById('demo-pct');
  var remainEl = document.getElementById('demo-remain');
  var fillEl = document.getElementById('demo-progress-fill');
  var catEl = document.getElementById('demo-cat');
  var msgEl = document.getElementById('demo-message');
  var undoBtn = document.getElementById('demo-undo');
  var demo = document.querySelector('.app-demo');

  if (!totalEl || !pctEl || !remainEl || !fillEl || !catEl || !msgEl || !undoBtn || !demo) return;

  var GOAL = 2000;
  var THRESHOLDS = { LOW: 30, HIGH: 68 };
  var current = 0;
  var lastAdd = 0;
  var locale = demo.dataset.locale || document.documentElement.lang || 'en-US';
  var messages = {
    goal: demo.dataset.goalMessage || 'Goal reached.',
    logged: demo.dataset.loggedMessage || 'Logged.',
    undone: demo.dataset.undoneMessage || 'Undone.',
  };
  var cats = {
    low: '/aquatick/assets/cat-empty.png',
    mid: '/aquatick/assets/cat-thirsty.png',
    high: '/aquatick/assets/cat-hero.png',
  };

  function getCatSrc(pct) {
    if (pct < THRESHOLDS.LOW) return cats.low;
    if (pct < THRESHOLDS.HIGH) return cats.mid;
    return cats.high;
  }

  function updateUI(animate) {
    var pct = Math.min(100, Math.round((current / GOAL) * 100));
    var remain = Math.max(0, GOAL - current);
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var newSrc = getCatSrc(pct);
    var base = newSrc.split('/').pop();

    totalEl.textContent = current.toLocaleString(locale);
    pctEl.textContent = pct;
    remainEl.textContent = remain.toLocaleString(locale);
    fillEl.style.transition = (animate && !reduced) ? 'width 260ms cubic-bezier(0.23, 1, 0.32, 1)' : 'none';
    fillEl.style.width = pct + '%';

    if (catEl.dataset.currentCat !== base) {
      catEl.src = newSrc;
      catEl.dataset.currentCat = base;
    }
  }

  function showMessage(text) {
    msgEl.textContent = text;
    setTimeout(function () {
      if (msgEl.textContent === text) msgEl.textContent = '';
    }, 1600);
  }

  function addWater(amount) {
    var prev = current;
    var pct;

    current = Math.min(GOAL, current + amount);
    lastAdd = current - prev;
    updateUI(true);

    pct = Math.round((current / GOAL) * 100);
    if (pct >= 100) {
      showMessage(messages.goal);
    } else if (lastAdd > 0) {
      showMessage(messages.logged);
    }
    undoBtn.disabled = lastAdd <= 0;
  }

  function undoLast() {
    if (lastAdd <= 0) return;
    current = Math.max(0, current - lastAdd);
    lastAdd = 0;
    updateUI(true);
    showMessage(messages.undone);
    undoBtn.disabled = true;
  }

  document.querySelectorAll('.quick-add-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      addWater(parseInt(btn.getAttribute('data-add'), 10) || 200);
    });
  });
  undoBtn.addEventListener('click', undoLast);
  undoBtn.disabled = true;
  updateUI(false);
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

(function () {
  var sticker = document.querySelector('.cat-sticker');

  if (!sticker) return;
  sticker.addEventListener('click', function () {
    var original = sticker.textContent;
    sticker.textContent = sticker.dataset.activeText || original;
    sticker.style.transform = 'rotate(-8deg) scale(1.1)';
    setTimeout(function () {
      sticker.textContent = original;
      sticker.style.transform = 'rotate(12deg) scale(1)';
    }, 1100);
  });
})();
