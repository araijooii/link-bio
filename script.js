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
   Trigger animations after fonts load
=================================== */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function () {
    document.body.classList.add('fonts-loaded');
  });
}
