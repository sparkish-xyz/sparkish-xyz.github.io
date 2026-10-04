(function () {
  'use strict';
  if (!document.body.classList.contains('aqua-story')) return;

  // The complete gallery stays readable when JavaScript is unavailable.
  var tabList = document.querySelector('.screen-tabs');
  var tabs = Array.from(document.querySelectorAll('[data-screen-tab]'));
  var panels = Array.from(document.querySelectorAll('[data-screen-panel]'));
  function selectScreen(index, moveFocus) {
    tabs.forEach(function (tab, i) {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (moveFocus) tabs[index].focus({ preventScroll: true });
  }
  if (tabList && tabs.length === panels.length && tabs.length) {
    tabList.setAttribute('role', 'tablist');
    tabs.forEach(function (tab, index) {
      tab.setAttribute('role', 'tab');
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      tab.addEventListener('click', function () { selectScreen(index, false); });
      tab.addEventListener('keydown', function (event) {
        var next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        selectScreen(next, true);
      });
    });
    tabList.hidden = false;
    document.querySelector('.screen-grid').classList.add('is-enhanced');
    selectScreen(0, false);
  }

  // The link is an ordinary MP4 link without JS. Media loads only on request.
  var dialog = document.querySelector('.demo-dialog');
  var video = dialog && dialog.querySelector('video');
  var trigger = document.querySelector('.demo-trigger');
  if (dialog && video && trigger && typeof dialog.showModal === 'function') {
    trigger.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (!video.getAttribute('src')) video.src = trigger.href;
      dialog.showModal();
      var playing = video.play();
      if (playing && playing.catch) playing.catch(function () { /* Native play controls remain available. */ });
    });
    dialog.querySelector('.demo-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) {
      if (event.target !== dialog) return;
      var rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', function () {
      video.pause();
      video.currentTime = 0;
      trigger.focus({ preventScroll: true });
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) video.pause();
    });
    window.addEventListener('pagehide', function () { video.pause(); });
  }

  if (!window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  var media = gsap.matchMedia();
  var hero = document.querySelector('.hero');
  var section = document.getElementById('features');
  var steps = Array.from(document.querySelectorAll('[data-story-step]'));

  media.add('(prefers-reduced-motion: no-preference)', function () {
    gsap.from('.hero-copy > *', { y: 26, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out', clearProps: 'transform,opacity' });
    gsap.from('.hero-phone', { y: 30, duration: 1, ease: 'power2.out', clearProps: 'transform' });
    gsap.from('.watch-shot', {
      y: 64, scale: .8, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: '.watch-section', start: 'top 72%', once: true }
    });
    gsap.from('.watch-section .story-copy', {
      y: 24, duration: .8, ease: 'power2.out',
      scrollTrigger: { trigger: '.watch-section', start: 'top 72%', once: true }
    });
    gsap.from('.closing-layout > img', {
      y: 22, scale: .94, duration: .85, ease: 'power2.out',
      scrollTrigger: { trigger: '.closing-section', start: 'top 85%', once: true }
    });
  });

  media.add('(min-width: 900px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)', function () {
    hero.classList.add('motion-hero');
    section.classList.add('motion-story');
    // CSS sticky stages preserve native scrolling and a useful no-JS fallback.
    var heroTimeline = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: .55 }
    });
    heroTimeline.to('.hero-copy', { y: -100, opacity: 0, duration: .6, ease: 'none' }, 0)
      .to('.hero-visual', { y: -95, scale: 1.13, duration: 1, ease: 'none' }, 0)
      .to('.hero-vault', { x: -55, y: -35, rotation: -16, duration: 1, ease: 'none' }, 0)
      .to('.hero-history', { x: 55, y: -35, rotation: 16, duration: 1, ease: 'none' }, 0)
      .to('.hero-water', { yPercent: -8, scale: 1.1, duration: 1, ease: 'none' }, 0);
    var timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section, start: 'top top+=76', end: 'bottom bottom', scrub: .35,
        onUpdate: function (self) {
          var active = self.progress < .32 ? 0 : self.progress < .68 ? 1 : 2;
          section.dataset.activeStep = String(active);
          steps.forEach(function (step, index) { step.classList.toggle('is-active', index === active); });
        }
      }
    });
    // Enlarge the native capture, travel to the cup controls, then reveal the
    // actual after-entry capture. Never recreate or animate invented app UI.
    timeline.to('.logging-captures img', { scale: 1.08, y: -55, transformOrigin: 'center top', duration: .3, ease: 'none' }, 0)
      .to('.logging-captures img', { y: -145, duration: .2, ease: 'none' }, .3)
      .to('.logging-after', { opacity: 1, duration: .16, ease: 'none' }, .62)
      .to('.logging-captures img', { scale: 1, y: 0, duration: .2, ease: 'none' }, .8)
      .to('.story-progress span', { scaleX: 1, duration: 1, ease: 'none' }, 0);
    steps[0].classList.add('is-active');
    return function () {
      hero.classList.remove('motion-hero');
      section.classList.remove('motion-story');
      section.dataset.activeStep = '0';
      steps.forEach(function (step) { step.classList.remove('is-active'); });
    };
  });
  // Refresh after local image dimensions are ready, including restored history entries.
  window.addEventListener('load', function () { window.ScrollTrigger.refresh(); }, { once: true });
})();
