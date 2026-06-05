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

    let ticking = false;
    function update() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (scrollTop / max) * 100 : 0;
      bar.style.setProperty('--scroll', pct + '%');
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
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

  // ── Language translations maps ──
  const PAGE_TRANSLATIONS = {
    '/': {
      en: {
        title: 'Psychological Safety of AI Content for Preschoolers — Coursework',
        desc: 'Website for a coursework research project on the impact of neural-network-generated content on the psychology and world perception of preschool children.'
      },
      sk: {
        title: 'Psychologická bezpečnosť AI obsahu pre predškolákov — Semestrálna práca',
        desc: 'Webová stránka výskumného projektu semestrálnej práce o vplyve obsahu generovaného neurónovými sieťami na psychiku a vnímanie sveta predškolských detí.'
      }
    },
    '/index.html': {
      en: {
        title: 'Psychological Safety of AI Content for Preschoolers — Coursework',
        desc: 'Website for a coursework research project on the impact of neural-network-generated content on the psychology and world perception of preschool children.'
      },
      sk: {
        title: 'Psychologická bezpečnosť AI obsahu pre predškolákov — Semestrálna práca',
        desc: 'Webová stránka výskumného projektu semestrálnej práce o vplyve obsahu generovaného neurónovými sieťami na psychiku a vnímanie sveta predškolských detí.'
      }
    },
    '/literature/': {
      en: {
        title: 'Literature — Coursework 2026',
        desc: 'List of references and sources for the coursework on psychological safety and pedagogical appropriateness of AI content for preschoolers.'
      },
      sk: {
        title: 'Literatúra — Semestrálna práca 2026',
        desc: 'Zoznam literatúry a zdrojov pre semestrálnu prácu o psychologickej bezpečnosti a pedagogickej vhodnosti AI obsahu pre predškolákov.'
      }
    },
    '/literature/index.html': {
      en: {
        title: 'Literature — Coursework 2026',
        desc: 'List of references and sources for the coursework on psychological safety and pedagogical appropriateness of AI content for preschoolers.'
      },
      sk: {
        title: 'Literatúra — Semestrálna práca 2026',
        desc: 'Zoznam literatúry a zdrojov pre semestrálnu prácu o psychologickej bezpečnosti a pedagogickej vhodnosti AI obsahu pre predškolákov.'
      }
    },
    '/reports/': {
      en: {
        title: 'Reporting — Coursework 2026',
        desc: 'CSV report files with parents\' and educators\' responses: data from Google Forms and manually entered paper questionnaires.'
      },
      sk: {
        title: 'Reporty — Semestrálna práca 2026',
        desc: 'CSV súbory s odpoveďami rodičov a pedagógov: dáta z Google Forms a ručne prepísané papierové dotazníky.'
      }
    },
    '/reports/index.html': {
      en: {
        title: 'Reporting — Coursework 2026',
        desc: 'CSV report files with parents\' and educators\' responses: data from Google Forms and manually entered paper questionnaires.'
      },
      sk: {
        title: 'Reporty — Semestrálna práca 2026',
        desc: 'CSV súbory s odpoveďami rodičov a pedagógov: dáta z Google Forms a ručne prepísané papierové dotazníky.'
      }
    },
    '/m/': {
      en: {
        title: 'Materials Corpus for AI Content Research — Coursework 2026',
        desc: 'Corpus of 15 materials for researching the psychological safety and pedagogical appropriateness of AI content for preschoolers: 6 video fragments and 9 texts for blind evaluation.'
      },
      sk: {
        title: 'Korpus materiálov pre výskum AI obsahu — Semestrálna práca 2026',
        desc: 'Korpus 15 materiálov na výskum psychologickej bezpečnosti a pedagogickej vhodnosti AI obsahu pre predškolákov: 6 video fragmentov a 9 textov na slepé hodnotenie.'
      }
    },
    '/m/index.html': {
      en: {
        title: 'Materials Corpus for AI Content Research — Coursework 2026',
        desc: 'Corpus of 15 materials for researching the psychological safety and pedagogical appropriateness of AI content for preschoolers: 6 video fragments and 9 texts for blind evaluation.'
      },
      sk: {
        title: 'Korpus materiálov pre výskum AI obsahu — Semestrálna práca 2026',
        desc: 'Korpus 15 materiálov na výskum psychologickej bezpečnosti a pedagogickej vhodnosti AI obsahu pre predškolákov: 6 video fragmentov a 9 textov na slepé hodnotenie.'
      }
    },
    '/survey/': {
      en: {
        title: 'Research Questionnaires — Select Role',
        desc: 'Select a questionnaire to participate in the research: for preschool educators or for parents of preschoolers.'
      },
      sk: {
        title: 'Výskumné dotazníky — Vyberte rolu',
        desc: 'Vyberte dotazník pre účasť vo výskume: pre pedagógov MŠ alebo pre rodičov predškolákov.'
      }
    },
    '/survey/index.html': {
      en: {
        title: 'Research Questionnaires — Select Role',
        desc: 'Select a questionnaire to participate in the research: for preschool educators or for parents of preschoolers.'
      },
      sk: {
        title: 'Výskumné dotazníky — Vyberte rolu',
        desc: 'Vyberte dotazník pre účasť vo výskume: pre pedagógov MŠ alebo pre rodičov predškolákov.'
      }
    },
    '/survey/parents/': {
      en: {
        title: 'Questionnaire for Parents of Preschoolers — Collection Completed',
        desc: 'Response collection completed. Questionnaire for parents of preschool children under the research project on psychological safety of AI content.'
      },
      sk: {
        title: 'Dotazník pre rodičov predškolákov — Zber ukončený',
        desc: 'Zber odpovedí bol ukončený. Dotazník pre rodičov predškolských detí v rámci výskumného projektu o psychologickej bezpečnosti AI obsahu.'
      }
    },
    '/survey/parents/index.html': {
      en: {
        title: 'Questionnaire for Parents of Preschoolers — Collection Completed',
        desc: 'Response collection completed. Questionnaire for parents of preschool children under the research project on psychological safety of AI content.'
      },
      sk: {
        title: 'Dotazník pre rodičov predškolákov — Zber ukončený',
        desc: 'Zber odpovedí bol ukončený. Dotazník pre rodičov predškolských detí v rámci výskumného projektu o psychologickej bezpečnosti AI obsahu.'
      }
    },
    '/survey/educators/': {
      en: {
        title: 'Questionnaire for Preschool Educators — Collection Completed',
        desc: 'Response collection completed. Questionnaire for educators of preschool education institutions under the research project on psychological safety of AI content.'
      },
      sk: {
        title: 'Dotazník pre pedagógov MŠ — Zber ukončený',
        desc: 'Zber odpovedí bol ukončený. Dotazník pre učiteľov predškolských zariadení v rámci výskumného projektu o psychologickej bezpečnosti AI obsahu.'
      }
    },
    '/survey/educators/index.html': {
      en: {
        title: 'Questionnaire for Preschool Educators — Collection Completed',
        desc: 'Response collection completed. Questionnaire for educators of preschool education institutions under the research project on psychological safety of AI content.'
      },
      sk: {
        title: 'Dotazník pre pedagógov MŠ — Zber ukončený',
        desc: 'Zber odpovedí bol ukončený. Dotazník pre učiteľov predškolských zariadení v rámci výskumného projektu o psychologickej bezpečnosti AI obsahu.'
      }
    },
    '/404.html': {
      en: {
        title: '404 Page Not Found — Coursework 2026',
        desc: 'Requested page was not found.'
      },
      sk: {
        title: '404 Stránka nenájdená — Semestrálna práca 2026',
        desc: 'Požadovaná stránka nebola nájdená.'
      }
    },
    '/paper/': {
      en: {
        title: 'Coursework Paper — Full Text',
        desc: 'Full text of the coursework paper in child psychology on the impact of AI content on preschoolers.'
      },
      sk: {
        title: 'Semestrálna práca — Úplný text',
        desc: 'Úplný text semestrálnej práce z detskej psychológie o vplyve AI obsahu na predškolákov.'
      }
    },
    '/paper/index.html': {
      en: {
        title: 'Coursework Paper — Full Text',
        desc: 'Full text of the coursework paper in child psychology on the impact of AI content on preschoolers.'
      },
      sk: {
        title: 'Semestrálna práca — Úplný text',
        desc: 'Úplný text semestrálnej práce z detskej psychológie o vplyve AI obsahu na predškolákov.'
      }
    }
  };

  // Pre-populate dynamic material pages translations
  (function () {
    const codes = ['grk', 'pkd', 'ssn', 'trk', 'tfi', 'prs', 'spb', 'dub', 'ksh', 'xhf', 'bbp', 'izh', 'lsk', 'snc', 'pst'];
    const namesEn = {
      grk: 'The Gruffalo',
      pkd: 'Krtek and Panda',
      ssn: 'Pip and Posy',
      trk: 'Three Adventures of the Blue Tractor',
      tfi: 'Tofi and the Mystery',
      prs: 'Adventures of the Piglet',
      spb: 'Why Do We Say "Thank You"',
      dub: 'The Oak Tree Under the Window',
      ksh: 'The Abandoned Kitten',
      xhf: 'Warm Bread for Friends',
      bbp: 'Grandmother\'s Pie',
      izh: 'Hedgehog\'s Apple Find',
      lsk: 'The Fox and the Magic Seed',
      snc: 'The Sun and the Cloud',
      pst: 'Adventures of Pstryk the Sunbeam'
    };
    const namesSk = {
      grk: 'Gruffalo',
      pkd: 'Krtko a Panda',
      ssn: 'Milo a Mimi',
      trk: 'Tri dobrodružstvá Modrého Traktora',
      tfi: 'Tofi a tajomstvo',
      prs: 'Dobrodružstvá prasiatka',
      spb: 'Prečo hovoríme „Ďakujem“',
      dub: 'Dub pod oknom',
      ksh: 'Opustené mačiatko',
      xhf: 'Teplý chlebík pre priateľov',
      bbp: 'Babičkin koláč',
      izh: 'Ježkov jablkový nález',
      lsk: 'Líška a čarovné semienko',
      snc: 'Slniečko a obláčik',
      pst: 'Dobrodružstvá slnečného lúča Pstrika'
    };
    codes.forEach(code => {
      PAGE_TRANSLATIONS[`/m/${code}/`] = {
        en: {
          title: `${namesEn[code]} — Coursework 2026`,
          desc: `Evaluation material in the research of psychological safety and pedagogical appropriateness of AI-generated content for preschoolers.`
        },
        sk: {
          title: `${namesSk[code]} — Semestrálna práca 2026`,
          desc: `Hodnotiaci materiál vo výskume psychologickej bezpečnosti a pedagogickej vhodnosti obsahu generovaného AI pre predškolákov.`
        }
      };
      PAGE_TRANSLATIONS[`/m/${code}/index.html`] = PAGE_TRANSLATIONS[`/m/${code}/`];
    });
  })();

  const originalTitle = document.title;
  let originalMetaDesc = '';
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) {
    originalMetaDesc = descMeta.getAttribute('content') || '';
  }

  function applyLanguageDOM(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.lang = lang;

    // Update title and meta description
    let path = window.location.pathname;
    if (path.startsWith('/BPEDK_coursework')) {
      path = path.slice('/BPEDK_coursework'.length);
    }
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    const matched = PAGE_TRANSLATIONS[path] 
      || PAGE_TRANSLATIONS[path + '/'] 
      || PAGE_TRANSLATIONS[path.replace(/\/index\.html$/, '/')]
      || PAGE_TRANSLATIONS[path.replace(/\/$/, '/index.html')];

    if (matched && matched[lang]) {
      document.title = matched[lang].title;
      if (descMeta) descMeta.setAttribute('content', matched[lang].desc);
    } else {
      document.title = originalTitle;
      if (descMeta && originalMetaDesc) descMeta.setAttribute('content', originalMetaDesc);
    }
  }

  // ── Language Toggle (manual lang selection via beautiful dropdown) ──
  function initLangToggle() {
    const saved = localStorage.getItem('bpedk-lang');
    const initial = saved || 'uk';

    const toggles = document.querySelectorAll('.lang-toggle');
    if (toggles.length === 0) {
      applyLanguageDOM(initial);
      return;
    }

    const langs = {
      uk: { label: 'UA', name: 'Українська', flag: '🇺🇦' },
      en: { label: 'EN', name: 'English', flag: '🇬🇧' },
      sk: { label: 'SK', name: 'Slovenčina', flag: '🇸🇰' }
    };

    toggles.forEach(btn => {
      // Create custom dropdown container
      const container = document.createElement('div');
      container.className = 'custom-dropdown lang-dropdown';
      if (btn.getAttribute('style')) {
        container.setAttribute('style', btn.getAttribute('style'));
      }

      // Dropdown trigger button
      const trigger = document.createElement('button');
      trigger.className = 'dropdown-trigger lang-toggle';
      trigger.type = 'button';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Вибір мови / Select Language');

      // Dropdown menu list
      const menu = document.createElement('div');
      menu.className = 'dropdown-menu';
      menu.setAttribute('role', 'listbox');

      // Build menu items
      Object.keys(langs).forEach(langKey => {
        const langInfo = langs[langKey];
        const itemBtn = document.createElement('button');
        itemBtn.className = 'dropdown-item';
        itemBtn.type = 'button';
        itemBtn.setAttribute('role', 'option');
        itemBtn.dataset.lang = langKey;
        itemBtn.innerHTML = `
          <span class="flag-icon">${langInfo.flag}</span>
          <span class="lang-name">${langInfo.name}</span>
        `;

        itemBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const next = langKey;
          applyLanguageDOM(next);
          localStorage.setItem('bpedk-lang', next);
          
          updateAllDropdowns(next);

          if (window.BPEDKAnalytics && typeof window.BPEDKAnalytics.track === 'function') {
            window.BPEDKAnalytics.track('change_language', { language: next });
          }
          
          container.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        });

        menu.appendChild(itemBtn);
      });

      function updateUI(lang) {
        const currentLang = langs[lang] || langs.uk;
        trigger.innerHTML = `
          <span class="flag-icon">${currentLang.flag}</span>
          <span class="lang-code">${currentLang.label}</span>
          <svg class="chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 1 5 5 9 1"></polyline>
          </svg>
        `;
        menu.querySelectorAll('.dropdown-item').forEach(item => {
          const isActive = item.dataset.lang === lang;
          item.classList.toggle('active', isActive);
          item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      }

      container.appendChild(trigger);
      container.appendChild(menu);
      container.updateUI = updateUI;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.custom-dropdown').forEach(d => {
          if (d !== container) {
            d.classList.remove('open');
            const otherTrig = d.querySelector('.dropdown-trigger');
            if (otherTrig) otherTrig.setAttribute('aria-expanded', 'false');
          }
        });

        const isOpen = container.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });

      btn.parentNode.replaceChild(container, btn);
    });

    function updateAllDropdowns(lang) {
      document.querySelectorAll('.custom-dropdown').forEach(container => {
        if (typeof container.updateUI === 'function') {
          container.updateUI(lang);
        }
      });
    }

    updateAllDropdowns(initial);
    applyLanguageDOM(initial);

    document.addEventListener('click', () => {
      document.querySelectorAll('.custom-dropdown').forEach(container => {
        container.classList.remove('open');
        const trig = container.querySelector('.dropdown-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      });
    });
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
    initLangToggle();
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
