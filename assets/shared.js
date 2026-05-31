/**
 * Shared UI utilities for all BPEDK pages.
 * v3.0 — scroll progress, back-to-top, theme toggle, mobile nav, fade-in observer.
 */
(function () {
  'use strict';

  // ── Scroll progress bar ──
  function initScrollProgress() {
    if (document.querySelector('.scroll-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);

    function update() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (scrollTop / max) * 100 : 0;
      bar.style.setProperty('--scroll', pct + '%');
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ── Back to top ──
  function initBackToTop() {
    if (document.querySelector('.back-to-top')) return;
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Нагору');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    let ticking = false;
    function toggle() {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(toggle); ticking = true; }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Theme toggle (manual data-theme attribute) ──
  function initThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    const saved = localStorage.getItem('bpedk-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = initial;
    updateToggleIcon(btn, initial);

    btn.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme;
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('bpedk-theme', next);
      updateToggleIcon(btn, next);
    });
  }

  function updateToggleIcon(btn, theme) {
    btn.textContent = theme === 'dark' ? '☀' : '☾';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
    btn.setAttribute('title', theme === 'dark' ? 'Світла тема' : 'Темна тема');
  }

  // ── Mobile nav toggle ──
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav-links');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Відкрити меню');
      });
    });
  }

  // ── Fade-in on scroll ──
  function initFadeUp() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const delay = e.target.dataset.stagger ? parseInt(e.target.dataset.stagger) * 80 : i * 60;
          setTimeout(() => e.target.classList.add('visible'), delay);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }

  // ── Telegram WebApp ──
  function initTelegram() {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }

  // ── Active nav link from hash ──
  function initActiveNav() {
    const links = document.querySelectorAll('.site-nav-links a[href^="#"]');
    if (!links.length) return;

    const sections = Array.from(links)
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    function setActive(id) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-70px 0px -55% 0px', threshold: [0.1, 0.25, 0.5] });

    sections.forEach(s => observer.observe(s));

    if (window.location.hash) {
      setActive(window.location.hash.slice(1));
    }
  }

  // ── Smooth scroll for anchor links ──
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ── Skeleton loader cleanup ──
  function removeSkeletons() {
    document.querySelectorAll('.skeleton').forEach(el => {
      el.classList.remove('skeleton');
    });
  }

  // ── Boot ──
  function boot() {
    initScrollProgress();
    initBackToTop();
    initThemeToggle();
    initMobileNav();
    initFadeUp();
    initTelegram();
    initActiveNav();
    initSmoothAnchors();
    // Defer skeleton removal slightly to show effect
    if (document.querySelector('.skeleton')) {
      setTimeout(removeSkeletons, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
