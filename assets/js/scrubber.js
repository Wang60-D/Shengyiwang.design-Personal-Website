/* scrubber.js — Apple-style scroll-linked product rotation.
   A tall section is pinned; as the user scrolls through it, a frame
   sequence is scrubbed onto a <canvas>, giving the "turntable +
   studio light sweep" effect. Replace the placeholder frames in
   assets/img/product-seq/ with real renders (same naming) to upgrade.

   Markup expected:
   <div class="scrub" data-frames="48" data-dir="../assets/img/product-seq"
        data-prefix="frame_" data-pad="3" data-ext="jpg"> ... </div>
*/
(function () {
  function initScrub(root) {
    const canvas = root.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const count  = parseInt(root.dataset.frames || '48', 10);
    const dir    = root.dataset.dir || 'assets/img/product-seq';
    const prefix = root.dataset.prefix || 'frame_';
    const pad    = parseInt(root.dataset.pad || '3', 10);
    const ext    = root.dataset.ext || 'jpg';

    const frames = new Array(count);
    let loaded = 0;
    let ready = false;
    const progressEl = root.querySelector('[data-scrub-progress]');

    const src = (i) => `${dir}/${prefix}${String(i).padStart(pad, '0')}.${ext}`;

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(img) {
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      ctx.clearRect(0, 0, cw, ch);
      // contain
      const s = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }

    function frameForScroll() {
      const rect = root.getBoundingClientRect();
      const total = root.offsetHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? passed / total : 0;
      if (progressEl) progressEl.style.transform = `scaleX(${p})`;
      return Math.min(count - 1, Math.max(0, Math.round(p * (count - 1))));
    }

    let raf = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        if (!ready) return;
        draw(frames[frameForScroll()]);
      });
    }

    // Preload
    for (let i = 0; i < count; i++) {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (i === 0) { sizeCanvas(); draw(img); }
        if (loaded >= count) { ready = true; onScroll(); }
      };
      img.onerror = () => { loaded++; if (loaded >= count) { ready = true; onScroll(); } };
      img.src = src(i);
      frames[i] = img;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { sizeCanvas(); onScroll(); });
    sizeCanvas();
  }

  document.querySelectorAll('.scrub').forEach(initScrub);
})();
