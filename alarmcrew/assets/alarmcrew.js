// Native navigation and language disclosure, with dismissal and keyboard focus restoration.
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

// Progressive enhancement: all copy and images are useful without GSAP or JS.
(() => {
  if (!document.body.classList.contains('cinematic-edition') || !window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  const hero = document.querySelector('.hero');
  const crew = document.querySelector('.crew-section');
  const steps = [...document.querySelectorAll('[data-crew-step]')];

  media.add('(prefers-reduced-motion: no-preference)', () => {
    // One opening sequence. Only product imagery animates on smaller screens.
    gsap.from('.hero-copy > *', { y: 24, opacity: 0, duration: .8, ease: 'power3.out', clearProps: 'transform,opacity' });
    gsap.from('.hero-capture', { y: 50, duration: 1.1, ease: 'power3.out', clearProps: 'transform' });
    gsap.from('.hero-wing img', { y: 70, opacity: 0, duration: 1.1, delay: .15, ease: 'power3.out', clearProps: 'transform,opacity' });
  });

  media.add('(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)', () => {
    hero.classList.add('motion-hero');
    crew.classList.add('motion-crew');
    const navigationOffset = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ac-nav-height'));
    const heroTimeline = gsap.timeline({ scrollTrigger: { trigger: hero, start: () => `top top+=${navigationOffset()}`, end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true } });
    heroTimeline.to('.hero-copy', { y: -70, opacity: 0, duration: .35, ease: 'none' }, 0)
      .to('.hero-product', { y: -40, scale: 1.12, duration: 1, ease: 'none' }, 0)
      .to('.hero-wing-left', { x: -100, rotation: -18, y: 60, duration: 1, ease: 'none' }, 0)
      .to('.hero-wing-right', { x: 100, rotation: 18, y: 60, duration: 1, ease: 'none' }, 0)
      .to('.hero-main', { y: 35, scale: 1.14, duration: 1, ease: 'none' }, 0)
      .fromTo('.hero-finale', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .32, ease: 'none' }, .55)
      .to('.hero-scroll-cue', { opacity: 0, duration: .15, ease: 'none' }, 0);

    function setStep(index) {
      crew.dataset.activeStep = String(index);
      steps.forEach((step, i) => {
        step.classList.toggle('is-active', i === index);
        if (i === index) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
    }
    setStep(0);
    const crewTimeline = gsap.timeline({ scrollTrigger: {
      trigger: crew, start: () => `top top+=${navigationOffset()}`, end: 'bottom bottom', scrub: .45, invalidateOnRefresh: true,
      onUpdate: self => setStep(self.progress < .3 ? 0 : self.progress < .64 ? 1 : 2)
    } });
    // Pan the genuine capture from the shared time to its invite and members.
    crewTimeline.fromTo('.crew-window img', { yPercent: 0 }, { yPercent: -28, duration: 1, ease: 'none' }, 0)
      .to('.crew-progress span', { scaleX: 1, duration: 1, ease: 'none' }, 0);
    gsap.fromTo('.next-figure', { scale: .78, y: 75 }, { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.next-section', start: 'top 75%', end: 'center 48%', scrub: .6 } });
    gsap.fromTo('.next-copy h2', { y: 45 }, { y: 0, ease: 'none', scrollTrigger: { trigger: '.next-section', start: 'top 85%', end: 'top 20%', scrub: .5 } });
    return () => {
      hero.classList.remove('motion-hero');
      crew.classList.remove('motion-crew');
      delete crew.dataset.activeStep;
      steps.forEach(step => { step.classList.remove('is-active'); step.removeAttribute('aria-current'); });
    };
  });
  media.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
    // Compact, one-shot product reveals on touch screens; never pin the reader.
    ['.crew-visual', '.next-figure'].forEach(selector => {
      gsap.from(selector, { y: 36, scale: .94, duration: .85, ease: 'power3.out',
        scrollTrigger: { trigger: selector, start: 'top 92%', once: true } });
    });
  });
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  window.addEventListener('pageshow', () => ScrollTrigger.refresh());
})();
