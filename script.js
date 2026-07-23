'use strict';

/* ===================================
   Theme Management
=================================== */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

themeToggle.addEventListener('click', toggleTheme);

// Sync with system preference changes (only when no saved preference)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
  if (!localStorage.getItem('theme')) {
    html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});

/* ===================================
   Footer Year
=================================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===================================
   Ripple Effect on Link Cards
=================================== */
document.querySelectorAll('.link-card').forEach(function (card) {
  card.addEventListener('pointerdown', function (e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + x + 'px;top:' + y + 'px;';
    this.appendChild(ripple);

    ripple.addEventListener('animationend', function () { ripple.remove(); }, { once: true });
  });
});

/* ===================================
   Scroll Reveal (About / Work sections)
=================================== */
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });
} else {
  document.querySelectorAll('.reveal').forEach(function (el) {
    el.classList.add('is-visible');
  });
}

/* ===================================
   Work Carousel, slow autoplay, pauses on hover/touch
=================================== */
(function () {
  const track = document.getElementById('workCarousel');
  if (!track) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let playing = false;
  let paused = false;
  let rafId = null;

  function step() {
    rafId = null;
    if (!playing || paused) return;
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 0) { rafId = requestAnimationFrame(step); return; }

    if (track.scrollLeft >= max - 1) {
      paused = true;
      setTimeout(function () {
        track.scrollTo({ left: 0, behavior: 'smooth' });
        setTimeout(function () { paused = false; rafId = requestAnimationFrame(step); }, 700);
      }, 1000);
      return;
    }

    track.scrollLeft += 0.6;
    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (playing) return;
    playing = true;
    if (!rafId) rafId = requestAnimationFrame(step);
  }

  function resume() {
    if (!playing || !paused) return;
    paused = false;
    if (!rafId) rafId = requestAnimationFrame(step);
  }

  track.addEventListener('pointerenter', function () { paused = true; });
  track.addEventListener('pointerleave', resume);
  track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
  track.addEventListener('touchend', function () { setTimeout(resume, 2500); });

  if ('IntersectionObserver' in window) {
    const carouselObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          start();
          carouselObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    carouselObserver.observe(track);
  } else {
    start();
  }
})();

/* ===================================
   Trigger animations after fonts load
=================================== */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function () {
    document.body.classList.add('fonts-loaded');
  });
}
