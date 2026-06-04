/* project.js — reveal-on-scroll, scrub annotation cross-fade,
   highlights carousel. Shared by hardware / research / ui pages.
   Motion choices follow Emil Kowalski's design-eng skill:
   staggers of 60ms, UI transitions <300ms, no keyboard-action animation. */
(function () {
  // Stagger grouped reveals (60ms between siblings, decorative only)
  const groups = ['.statband', '.cards', '.phones', '.hl__track'];
  groups.forEach((sel) => {
    document.querySelectorAll(sel).forEach((box) => {
      [...box.querySelectorAll(':scope > .reveal')].forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
      });
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Active nav link by section in view
  const navLinks = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  if (navLinks.length) {
    const map = new Map();
    navLinks.forEach((a) => { const t = document.querySelector(a.getAttribute('href')); if (t) map.set(t, a); });
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const a = map.get(e.target); if (a) a.classList.add('active');
      }});
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, t) => navIO.observe(t));
  }

  // Scrub annotation cross-fade — notes appear at scroll thresholds
  document.querySelectorAll('.scrub').forEach((root) => {
    const notes = [...root.querySelectorAll('.scrub__note')];
    if (!notes.length) return;
    let raf = null;
    const update = () => {
      raf = null;
      const rect = root.getBoundingClientRect();
      const total = root.offsetHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? passed / total : 0;
      const idx = Math.min(notes.length - 1, Math.floor(p * notes.length));
      notes.forEach((n, i) => n.classList.toggle('on', i === idx));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  });

  // Highlights carousel — scroll-snap track + dots + prev/next
  document.querySelectorAll('.hl').forEach((hl) => {
    const track = hl.querySelector('.hl__track');
    const cards = [...track.children];
    const dotsBox = hl.querySelector('.hl__dots');
    const btns = [...hl.querySelectorAll('.hl__btn')];
    if (!cards.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const padLeft = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;

    // Build dots
    const dots = cards.map((_, i) => {
      const d = document.createElement('button');
      d.className = 'hl__dot';
      d.setAttribute('aria-label', `第 ${i + 1} 张卡片`);
      d.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(d);
      return d;
    });

    const current = () => {
      const x = track.scrollLeft + padLeft();
      let best = 0, bestDist = Infinity;
      cards.forEach((c, i) => {
        const dist = Math.abs(c.offsetLeft - x);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    };

    const goTo = (i) => {
      const idx = Math.max(0, Math.min(cards.length - 1, i));
      track.scrollTo({ left: cards[idx].offsetLeft - padLeft(), behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    btns.forEach((b) => {
      b.addEventListener('click', () => goTo(current() + parseInt(b.dataset.dir, 10)));
    });

    let raf = null;
    const sync = () => {
      raf = null;
      const i = current();
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      if (btns.length === 2) {
        btns[0].toggleAttribute('disabled', i === 0);
        btns[1].toggleAttribute('disabled', i === cards.length - 1);
      }
    };
    track.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
})();
