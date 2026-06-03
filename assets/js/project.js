/* project.js — reveal-on-scroll + scrub annotation cross-fade.
   Shared by hardware / research / ui pages. */
(function () {
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
})();
