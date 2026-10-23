/* Carina Pessôa — direção de arte editorial. JS sem framework. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const DrawSVGPlugin = window.DrawSVGPlugin;
  const hero = $('#hero');
  const bar = $('#topbar');
  const toggle = $('#menuToggle');
  const menu = $('#mobileMenu');
  const floating = $('#floatingWhatsApp');
  const footer = $('#footer');
  let lenis = null;

  function splitHeroChars() {
    $$('[data-split-hero]').forEach(el => {
      const text = el.textContent;
      el.setAttribute('aria-label', text);
      el.classList.add('is-split');
      el.innerHTML = [...text].map(char => char === ' '
        ? '<span class="hero-char" aria-hidden="true">&nbsp;</span>'
        : `<span class="hero-char" aria-hidden="true">${char}</span>`).join('');
    });
  }

  // Always keep the site usable when a CDN is blocked.
  const motionReady = Boolean(gsap && ScrollTrigger && !reduced);
  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);
  }
  if (window.Lenis && !reduced && gsap && ScrollTrigger) {
    // A slightly quicker response avoids compounded lag with the pinned Services scrub.
    lenis = new window.Lenis({ lerp: 0.14, smoothWheel: true, anchors: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  if (!motionReady) {
    document.documentElement.classList.remove('js-animated');
  }

  // Stroke drawing uses GSAP DrawSVGPlugin when present and a dash fallback otherwise.
  function drawPaths(paths, trigger, duration = 1.5) {
    const list = Array.from(paths);
    if (!motionReady || !list.length) return;
    if (DrawSVGPlugin) {
      gsap.fromTo(list, { drawSVG: '0%' }, {
        drawSVG: '100%', duration, stagger: 0.09, ease: 'power2.out',
        scrollTrigger: trigger ? { trigger, start: 'top 78%', once: true } : undefined
      });
    } else {
      list.forEach(el => {
        if (typeof el.getTotalLength !== 'function') return;
        const l = el.getTotalLength();
        gsap.set(el, { strokeDasharray: l, strokeDashoffset: l });
        gsap.to(el, {
          strokeDashoffset: 0, duration, ease: 'power2.out',
          scrollTrigger: trigger ? { trigger, start: 'top 78%', once: true } : undefined
        });
      });
    }
  }

  // Mobile menu: inert when closed, keyboard-operable, body-scroll locked.
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    bar.classList.toggle('menu-active', open);
    if (open) bar.classList.remove('is-hidden');
    else syncHeader(window.scrollY, -1);
    menu.inert = !open;
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open) $('.mobile-menu a')?.focus({ preventScroll: true });
    else toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
    setMenu(false);
    if (lenis && a.hash) requestAnimationFrame(() => lenis.scrollTo(a.hash, { offset: -72 }));
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
  });

  // Hero-integrated transparent header -> opaque detached header after scrolling.
  // After the first movement down it may hide; reverse scroll reveals it.
  let lastHeaderY = window.scrollY;
  function syncHeader(y = window.scrollY, direction = 0, force = false) {
    const menuOpen = menu.classList.contains('is-open');
    const detached = y > 32;
    bar.classList.toggle('is-detached', detached);
    if (menuOpen || y < 170 || !detached) {
      bar.classList.remove('is-hidden');
      bar.classList.add('is-shown');
    } else if (force || direction !== 0) {
      bar.classList.toggle('is-hidden', direction > 0);
      bar.classList.toggle('is-shown', direction <= 0);
    }
  }
  syncHeader(window.scrollY);
  if (motionReady) {
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const y = self.scroll();
        const delta = y - lastHeaderY;
        syncHeader(y, Math.abs(delta) >= 5 && Math.abs(self.getVelocity()) >= 30 ? self.direction : 0);
        lastHeaderY = y;
      }
    });
  } else {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const delta = y - lastHeaderY;
      syncHeader(y, Math.abs(delta) > 5 ? Math.sign(delta) : 0);
      lastHeaderY = y;
    }, { passive: true });
  }

  // Floating contact action is never present over the hero or footer.
  const visibleRegions = { hero: true, footer: false };
  const floatObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === hero) visibleRegions.hero = entry.isIntersecting;
      if (entry.target === footer) visibleRegions.footer = entry.isIntersecting;
    });
    floating.classList.toggle('is-visible', !visibleRegions.hero && !visibleRegions.footer);
  }, { threshold: 0.05 });
  floatObserver.observe(hero);
  floatObserver.observe(footer);

  function animateHero() {
    if (!motionReady) return;
    splitHeroChars();
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-name .hero-char', { yPercent: 115, opacity: 0, rotate: 3, duration: 1.1, stagger: .035 }, 0)
      .from('.hero-profession .hero-char', { yPercent: 75, opacity: 0, duration: .75, stagger: .065 }, .24)
      .from('.hero-person', { y: 85, opacity: 0, duration: 1.45 }, .15)
      .from('.hero-micro, .hero-bottom, .hero-side', { opacity: 0, duration: 1, stagger: .09 }, .7);
    // No scroll-linked hero parallax: three full-screen layers used to repaint
    // while the next pinned chapter was entering. Entrance motion is preserved.
    drawPaths($$('.hero-frame [data-draw]'), null, 2);
  }

  // Mobile: vertical page scroll moves the six service cards horizontally.
  // CSS sticky avoids ScrollTrigger pin/touch conflicts and keeps taps responsive.
  function setupMobileServices() {
    const mq = window.matchMedia('(max-width: 900px) and (prefers-reduced-motion: no-preference)');
    const section = $('#servicos');
    const viewport = $('.services-viewport', section);
    const track = $('#servicesTrack');
    const progress = $('#servicesProgress');
    const current = $('#servicesCurrent');
    const cards = $$('.service-card', track);
    let raf = 0;
    let distance = 0;
    let active = false;

    const update = () => {
      raf = 0;
      if (!active) return;
      const remaining = Math.max(1, section.offsetHeight - viewport.offsetHeight);
      const fraction = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / remaining));
      track.style.setProperty('--mobile-services-x', `${-(fraction * distance).toFixed(2)}px`);
      progress.style.transform = `scaleX(${fraction})`;
      // Derive active number from card centers, rather than approximate intervals.
      const focusX = fraction * distance + viewport.clientWidth / 2;
      let idx = 0;
      let closest = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const mid = cards[i].offsetLeft + cards[i].offsetWidth / 2;
        const difference = Math.abs(focusX - mid);
        if (difference < closest) { idx = i; closest = difference; }
      }
      current.textContent = String(idx + 1).padStart(2, '0');
    };
    const schedule = () => { if (active && !raf) raf = requestAnimationFrame(update); };
    const measure = () => {
      if (!active) return;
      distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      section.style.height = `${Math.max(viewport.clientHeight, viewport.clientHeight + distance)}px`;
      schedule();
    };
    const onChange = () => {
      active = mq.matches;
      document.documentElement.classList.toggle('mobile-horizontal-ready', active);
      if (active) {
        measure();
      } else {
        section.style.removeProperty('height');
        track.style.removeProperty('--mobile-services-x');
        progress.style.removeProperty('transform');
      }
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    mq.addEventListener('change', onChange);
    // ResizeObserver catches font and viewport changes without polling.
    if ('ResizeObserver' in window) {
      new ResizeObserver(measure).observe(viewport);
      new ResizeObserver(measure).observe(track);
    }
    document.fonts?.ready.then(measure);
    onChange();
    return { measure };
  }

  // Only the desktop uses GSAP pin. Mobile uses a native sticky horizontal scene.
  function setupServices() {
    if (!motionReady) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const section = $('#servicos');
      const track = $('#servicesTrack');
      const current = $('#servicesCurrent');
      const progress = $('#servicesProgress');
      document.documentElement.classList.add('js-animated');
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: section, pin: true, anticipatePin: 1, scrub: 0.35,
          // Match pin duration to the ACTUAL horizontal distance; avoid the
          // extra viewport of dead/slow scrolling after leaving the hero.
          start: 'top top', end: () => '+=' + Math.max(1, Math.round(distance())),
          invalidateOnRefresh: true,
          onUpdate: self => {
            const p = self.progress;
            progress.style.transform = `scaleX(${p})`;
            const idx = Math.min(6, Math.max(1, Math.floor(p * 6) + 1));
            const value = String(idx).padStart(2, '0');
            if (current.textContent !== value) current.textContent = value;
          }
        }
      });
      $$('.service-card', track).forEach(card => {
        const paths = $$('[data-draw]', card);
        if (DrawSVGPlugin) {
          gsap.fromTo(paths, { drawSVG: '0%' }, {
            drawSVG: '100%', duration: 1.4, ease: 'power2.out',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 85%', once: true }
          });
        }
      });
      return () => {
        document.documentElement.classList.remove('js-animated');
        gsap.set(track, { clearProps: 'transform' });
      };
    });

  }

  // All other chapters use subtle scroll-triggered entrance and one special mask reveal.
  function setupReveals() {
    if (!motionReady) return;
    $$('[data-reveal]').forEach((el, i) => {
      gsap.from(el, {
        y: i % 3 === 0 ? 44 : 28, opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
    $$('[data-mask-reveal]').forEach(el => {
      gsap.from(el, {
        clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 83%', once: true }
      });
    });
    drawPaths($$('.care-route [data-draw]'), $('#atendimento'), 2.1);
    drawPaths($$('.gold-routes [data-draw]'), $('#diferenciais'), 3);
    drawPaths($$('.illustrated-route'), $('#localizacao'), 2);
    drawPaths($$('.closing-orbits [data-draw]'), $('#contato'), 2.5);
    drawPaths($$('.footer-line [data-draw]'), $('#footer'), 1.8);
    gsap.from('[data-pin]', {
      y: -45, opacity: 0, duration: .8, ease: 'bounce.out',
      scrollTrigger: { trigger: '#localizacao', start: 'top 65%', once: true }
    });
    $$('.ig-tile').forEach((tile, index) => {
      gsap.from(tile, {
        y: 50, opacity: 0, duration: .8, delay: (index % 4) * .09, ease: 'power2.out',
        scrollTrigger: { trigger: tile, start: 'top 95%', once: true }
      });
    });
  }

  // FAQ: aria-expanded, hidden state, keyboard native controls, measured heights only on direct interaction.
  $$('.faq-item').forEach(item => {
    const button = $('button', item);
    const answer = $('.faq-answer', item);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      if (!motionReady) {
        answer.hidden = !open;
        answer.style.height = open ? 'auto' : '0';
        return;
      }
      gsap.killTweensOf(answer);
      if (open) {
        answer.hidden = false;
        gsap.fromTo(answer, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: .48, ease: 'power2.out', onComplete: () => ScrollTrigger.refresh() });
      } else {
        gsap.to(answer, { height: 0, opacity: 0, duration: .35, ease: 'power2.inOut', onComplete: () => { answer.hidden = true; ScrollTrigger.refresh(); } });
      }
    });
  });

  function finishInitialLoad() {
    document.documentElement.classList.remove('is-loading');
    document.documentElement.classList.add('site-ready');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    syncHeader(window.scrollY);
    if (motionReady) {
      animateHero();
      ScrollTrigger.refresh();
    }
  }

  function startInitialSequence() {
    if (!motionReady) {
      document.documentElement.classList.remove('is-loading');
      document.documentElement.classList.add('site-ready');
      if (lenis) lenis.start();
      return;
    }
    if (document.readyState === 'complete') {
      requestAnimationFrame(finishInitialLoad);
    } else {
      window.addEventListener('load', () => requestAnimationFrame(finishInitialLoad), { once: true });
    }
  }

  setupMobileServices();
  setupServices();
  setupReveals();
  startInitialSequence();
  if (motionReady) {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }
})();
