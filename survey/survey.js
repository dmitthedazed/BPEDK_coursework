(function () {
  const REDIRECT_DELAY_MS = 3600;
  const STORAGE_KEY = "bpedk_done_" + window.location.pathname;

  // ── Telegram WebApp ──
  const tgWebApp = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (tgWebApp) { tgWebApp.ready(); tgWebApp.expand(); }

  // ── Links ──
  const links = Array.isArray(window.SURVEY_LINKS) && window.SURVEY_LINKS.length
    ? window.SURVEY_LINKS : ["https://example.org"];
  const url = links[Math.floor(Math.random() * links.length)];
  const isVideo = window.location.pathname.includes("/m/");

  // ── Compliment + subtitle ──
  const lang = document.documentElement.lang || 'uk';
  const COMPLIMENTS = lang === 'sk' ? [
    "Robíte tento svet lepším",
    "Váš názor je naozaj dôležitý",
    "Ste neuveriteľne pozorný človek",
    "Ďakujeme — ste skvelý",
    "S vami sa veda stáva možnou",
    "Ste súčasťou niečoho dôležitého",
    "Na vašej účasti záleží",
    "Robíte dobrý skutok",
    "Ďakujeme vám z celého srdca",
    "Váš pohľad je cenným prínom",
    "Spoločne robíme vedu lepšou"
  ] : lang === 'en' ? [
    "You are making this world a better place",
    "Your opinion is truly important",
    "You are an incredibly attentive person",
    "Thank you — you are wonderful",
    "With you, science becomes possible",
    "You are a part of something important",
    "Your participation matters",
    "You are doing a good deed",
    "Thank you from the bottom of our hearts",
    "Your perspective is a valuable contribution",
    "Together we make science better"
  ] : [
    "Ви робите цей світ кращим",
    "Ваша думка справді важлива",
    "Ви неймовірно уважна людина",
    "Дякуємо — ви чудові",
    "З вами наука стає можливою",
    "Ви — частина чогось важливого",
    "Ваша участь має значення",
    "Ви робите добру справу",
    "Дякуємо від усього серця",
    "Ваш погляд — цінний внесок",
    "Разом ми робимо науку кращою",
  ];
  const SUBTITLES = isVideo
    ? (lang === 'sk' ? [
        "Otvárame video na Google Disku",
        "Nahrávame materiál — sekundu",
        "Pripravujeme video na zobrazenie",
        "Video sa otvorí automaticky",
        "Už takmer sme tam — počkajte chvíľu"
      ] : lang === 'en' ? [
        "Opening video in Google Drive",
        "Loading material — one second",
        "Preparing video for viewing",
        "Video opens automatically",
        "Almost there — wait a moment"
      ] : [
        "Відкриваємо відео в Google Drive",
        "Завантажуємо матеріал — секунду",
        "Готуємо відео для перегляду",
        "Відео відкривається автоматично",
        "Майже там — зачекайте мить",
      ])
    : (lang === 'sk' ? [
        "Otvárame dotazník v Google Formulároch",
        "Pripravujeme formulár — sekundu",
        "Nahrávame Google Formuláre",
        "Formulár sa otvorí automaticky",
        "Už takmer sme tam — počkajte chvíľu"
      ] : lang === 'en' ? [
        "Opening questionnaire in Google Forms",
        "Preparing form — one second",
        "Loading Google Forms",
        "Form opens automatically",
        "Almost there — wait a moment"
      ] : [
        "Відкриваємо анкету в Google Forms",
        "Готуємо форму — секунду",
        "Завантажуємо Google Forms",
        "Форма відкривається автоматично",
        "Майже там — зачекайте мить",
      ]);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const complimentEl = document.getElementById("compliment");
  const subtitleEl   = document.getElementById("subtitle");
  if (complimentEl) complimentEl.textContent = pick(COMPLIMENTS);
  if (subtitleEl)   subtitleEl.textContent   = pick(SUBTITLES);
  const destinationLabel = isVideo ? "Google Drive" : "Google Forms";
  const primaryActionLabel = isVideo
    ? (lang === 'sk' ? "Otvoriť video na Google Disku" : (lang === 'en' ? "Open video in Google Drive" : "Відкрити відео v Google Drive"))
    : (lang === 'sk' ? "Otvoriť dotazník v Google Formulároch" : (lang === 'en' ? "Open questionnaire in Google Forms" : "Відкрити анкету в Google Forms"));
  const targetHost = (function () {
    try {
      return new URL(url).host;
    } catch (error) {
      return "";
    }
  })();

  function track(eventName, params) {
    const analytics = window.BPEDKAnalytics;

    if (!analytics || typeof analytics.track !== "function") {
      return;
    }

    analytics.track(eventName, {
      destination_service: destinationLabel,
      redirect_target_host: targetHost,
      ...params,
    });
  }

  function detectInAppBrowser() {
    const ua = navigator.userAgent || "";
    const lang = document.documentElement.lang || 'uk';

    const inAppInstructions = {
      'telegram-webview': {
        uk: "У Telegram натисніть ⋮ у правому верхньому куті та оберіть «Відкрити в браузері».",
        en: "In Telegram, tap ⋮ in the upper right corner and select 'Open in browser'.",
        sk: "V Telegrame klepnite na ⋮ v pravom hornom rohu a vyberte 'Otvoriť v prehliadači'."
      },
      'telegram-webapp': {
        uk: "У Telegram натисніть ⋮ у правому верхньому куті та оберіть «Відкрити в браузері».",
        en: "In Telegram, tap ⋮ in the upper right corner and select 'Open in browser'.",
        sk: "V Telegrame klepnite na ⋮ v pravom hornom rohu a vyberte 'Otvoriť v prehliadači'."
      },
      'telegram-android': {
        uk: "У Telegram натисніть ⋮ у правому верхньому куті та оберіть «Відкрити в браузері».",
        en: "In Telegram, tap ⋮ in the upper right corner and select 'Open in browser'.",
        sk: "V Telegrame klepnite na ⋮ v pravom hornom rohu a vyberte 'Otvoriť v prehliadači'."
      },
      'viber': {
        uk: "У Viber відкрийте меню повідомлення або сторінки, скопіюйте посилання та вставте його у Chrome чи Safari. У деяких версіях є опція відкривати посилання зовні.",
        en: "In Viber, open the message or page menu, copy the link and paste it into Chrome or Safari.",
        sk: "Vo Viberi otvorte menu správy alebo stránky, skopírujte odkaz a vložte ho do prehliadača Chrome alebo Safari."
      },
      'instagram': {
        uk: "В Instagram після відкриття сторінки шукайте іконку браузера у верхньому куті. Якщо її немає — відкрийте меню, скопіюйте посилання та вставте у Chrome чи Safari.",
        en: "In Instagram, look for the browser icon in the top corner. If not present, open the menu, copy the link and paste it into Chrome or Safari.",
        sk: "V Instagrame po otvorení stránky vyhľadajte ikonu prehliadača v hornom rohu. Ak tam nie je, otvorte menu, skopírujte odkaz a vložte ho do Chrome alebo Safari."
      },
      'facebook': {
        uk: "У Facebook відкрийте меню сторінки або допису, виберіть копіювання посилання й відкрийте його у Chrome чи Safari. За бажання можна ввімкнути відкриття посилань у зовнішньому браузері в налаштуваннях.",
        en: "In Facebook, open the page or post menu, copy the link and open it in Chrome or Safari.",
        sk: "Vo Facebooku otvorte menu stránky alebo príspevku, skopírujte odkaz a otvorte ho v prehliadači Chrome alebo Safari."
      },
      'tiktok': {
        uk: "У TikTok відкрийте сторінку, шукайте кнопку відкриття у браузері у верхньому куті. Якщо її немає — скопіюйте посилання та відкрийте його у браузері вручну.",
        en: "In TikTok, open the page and look for the open-in-browser button in the top corner. If not present, copy the link and open it in a browser manually.",
        sk: "V TikToku otvorte stránku a vyhľadajte tlačidlo otvorenia v prehliadači v hornom rohu. Ak tam nie je, skopírujte odkaz a otvorte ho v prehliadači ručne."
      },
      'whatsapp': {
        uk: "WhatsApp зазвичай відкриває посилання у браузері. Якщо сторінка все ж відкрилася всередині, знайдіть «Відкрити в браузері» або скопіюйте посилання.",
        en: "WhatsApp usually opens links in the browser. If the page opened inside, find 'Open in browser' or copy the link.",
        sk: "WhatsApp zvyčajne otvára odkazy v prehliadači. Ak sa stránka napriek tomu otvorila vo vnútri, nájdite možnosť 'Otvoriť v prehliadači' alebo skopírujte odkaz."
      }
    };

    if (typeof window.TelegramWebview !== "undefined" || typeof window.TelegramWebviewProxy !== "undefined" || typeof window.TelegramWebviewProxyProto !== "undefined") {
      return {
        id: "telegram-webview",
        label: "Telegram",
        instruction: inAppInstructions['telegram-webview'][lang]
      };
    }

    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
      return {
        id: "telegram-webapp",
        label: "Telegram",
        instruction: inAppInstructions['telegram-webapp'][lang]
      };
    }

    if (/Telegram-Android/i.test(ua)) {
      return {
        id: "telegram-android",
        label: "Telegram",
        instruction: inAppInstructions['telegram-android'][lang]
      };
    }

    if (/Viber/i.test(ua)) {
      return {
        id: "viber",
        label: "Viber",
        instruction: inAppInstructions['viber'][lang]
      };
    }

    if (/Instagram/i.test(ua)) {
      return {
        id: "instagram",
        label: "Instagram",
        instruction: inAppInstructions['instagram'][lang]
      };
    }

    if (/FBAN|FBAV|FBIOS|Facebook/i.test(ua)) {
      return {
        id: "facebook",
        label: "Facebook",
        instruction: inAppInstructions['facebook'][lang]
      };
    }

    if (/musical_ly|BytedanceWebview/i.test(ua)) {
      return {
        id: "tiktok",
        label: "TikTok",
        instruction: inAppInstructions['tiktok'][lang]
      };
    }

    if (/WhatsApp/i.test(ua)) {
      return {
        id: "whatsapp",
        label: "WhatsApp",
        instruction: inAppInstructions['whatsapp'][lang]
      };
    }

    return null;
  }

  async function copyText(value) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(value);
      return true;
    }

    const helper = document.createElement("textarea");
    helper.value = value;
    helper.setAttribute("readonly", "");
    helper.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    document.body.appendChild(helper);
    helper.select();

    try {
      return document.execCommand("copy");
    } finally {
      helper.remove();
    }
  }

  // ── Prefetch redirect target ──
  const prefetch = document.createElement("link");
  prefetch.rel = "prefetch"; prefetch.href = url;
  document.head.appendChild(prefetch);

  // ── DOM ──
  const timerEl     = document.getElementById("timer");
  const fallbackEl  = document.getElementById("fallback");
  const progressBar = document.getElementById("progressBar");
  const goNowBtn    = document.getElementById("goNowBtn");

  if (!timerEl || !fallbackEl || !progressBar || !goNowBtn) {
    throw new Error("Required UI elements were not found");
  }

  const inAppBrowser = detectInAppBrowser();
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  let allowAutoRedirect = !inAppBrowser && !isLocalhost;

  function showInAppBrowserPrompt() {
    if (!inAppBrowser || !subtitleEl) {
      return;
    }

    const lang = document.documentElement.lang || 'uk';
    document.body.classList.add("is-in-app-browser");
    subtitleEl.textContent = lang === 'sk'
      ? `V ${inAppBrowser.label} sa ${destinationLabel} môže otvárať nestabilne.`
      : lang === 'en'
        ? `In ${inAppBrowser.label}, ${destinationLabel} may open unstably.`
        : `У ${inAppBrowser.label} ${destinationLabel} може відкриватися нестабільно.`;

    const prompt = document.createElement("section");
    prompt.className = "inapp-prompt";

    const titleText = lang === 'sk' ? "Túto stránku je lepšie otvoriť v prehliadači" : lang === 'en' ? "Better to open this page in a browser" : "Краще відкрити цю сторінку в браузері";
    const btnText = lang === 'sk' ? "Kopírovať odkaz" : lang === 'en' ? "Copy link" : "Скопіювати посилання";
    const noteText = lang === 'sk' ? "Potom odkaz vložte do Safari, Chrome alebo iného prehliadača." : lang === 'en' ? "After that, paste the link into Safari, Chrome, or another browser." : "Після цього вставте посилання у Safari, Chrome або інший браузер.";

    prompt.innerHTML = `
      <p class="inapp-prompt-title">${titleText}</p>
      <p class="inapp-prompt-copy">${inAppBrowser.instruction}</p>
      <div class="inapp-prompt-actions">
        <button class="inapp-copy-btn" type="button">${btnText}</button>
      </div>
      <p class="inapp-prompt-note">${noteText}</p>
    `;
    subtitleEl.insertAdjacentElement("afterend", prompt);

    const statusEl = document.querySelector(".redirect-status");
    if (statusEl) {
      statusEl.style.display = "none";
    }

    const copyBtn = prompt.querySelector(".inapp-copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const copied = await copyText(window.location.href).catch(() => false);
        copyBtn.textContent = copied
          ? (lang === 'sk' ? "Odkaz skopírovaný" : (lang === 'en' ? "Link copied" : "Посилання скопійовано"))
          : (lang === 'sk' ? "Chyba kopírovania" : (lang === 'en' ? "Failed to copy" : "Не вдалося скопіювати"));
        track("open_in_browser_copy", {
          in_app_browser: inAppBrowser.id,
          copy_success: copied,
        });
      });
    }

    goNowBtn.textContent = isVideo
      ? (lang === 'sk' ? "Pokračovať tu v messengeri" : (lang === 'en' ? "Continue here in messenger" : "Продовжити тут у месенджері"))
      : (lang === 'sk' ? "Vyskúšať tu v messengeri" : (lang === 'en' ? "Try here in messenger" : "Спробувати тут у месенджері"));

    track("open_in_browser_prompt_shown", {
      in_app_browser: inAppBrowser.id,
      interaction_source: "in_app_detected",
    });
  }

  if (inAppBrowser) {
    showInAppBrowserPrompt();
  }

  // ── Fallback link ──
  const manualLink = document.createElement("a");
  manualLink.href = url;
  manualLink.textContent = isVideo
    ? (lang === 'sk' ? "otvoriť Google Disk ručne →" : (lang === 'en' ? "open Google Drive manually →" : "відкрити Google Drive вручну →"))
    : (lang === 'sk' ? "otvoriť Google Formuláre ručne →" : (lang === 'en' ? "open Google Forms manually →" : "відкрити Google Forms вручну →"));
  manualLink.rel = "noopener noreferrer";
  manualLink.target = "_blank";
  fallbackEl.textContent = lang === 'sk' ? "Neotvorilo sa? " : (lang === 'en' ? "Didn't open? " : "Не відкрилось? ");
  fallbackEl.appendChild(manualLink);
  goNowBtn.textContent = primaryActionLabel;

  manualLink.addEventListener("click", () => {
    track("manual_open", {
      redirect_mode: "manual",
      interaction_source: "fallback_link",
    });
  });

  // ── Confetti ──
  function launchConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const colors = ["#a855f7","#3b82f6","#f59e0b","#10b981","#ec4899","#c8410a","#e8873a"];
    const pieces = Array.from({ length: 75 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.35,
      r: Math.random() * 5 + 3,
      d: Math.random() * 70,
      color: colors[Math.floor(Math.random() * colors.length)],
      tiltAngle: 0,
      tiltInc: Math.random() * 0.07 + 0.04,
    }));
    let angle = 0;
    let frame;
    const start = Date.now();
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.01;
      for (const p of pieces) {
        p.tiltAngle += p.tiltInc;
        p.y += (Math.cos(angle + p.d) + 3 + p.r / 2) * 0.9;
        p.x += Math.sin(angle) * 1.2;
        const tilt = Math.sin(p.tiltAngle) * 14;
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + tilt, p.y + tilt + p.r / 4);
        ctx.stroke();
      }
      if (Date.now() - start < 2400) {
        frame = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(frame);
        canvas.remove();
      }
    }
    draw();
  }

  // ── Back state UI ──
  function showBackState() {
    document.body.classList.remove("page-exit");
    const lang = document.documentElement.lang || 'uk';

    const h1  = document.getElementById("compliment");
    const sub = document.getElementById("subtitle");
    if (h1)  h1.textContent = lang === 'sk' ? "Už ste tu boli — ďakujeme!" : lang === 'en' ? "Already been here — thank you!" : "Вже були тут — дякуємо!";
    if (sub) sub.textContent = isVideo
      ? (lang === 'sk' ? "Video sa malo otvoriť automaticky." : lang === 'en' ? "The video should have opened automatically." : "Відео мало відкритись автоматично.")
      : (lang === 'sk' ? "Formulár sa mal otvoriť automaticky." : lang === 'en' ? "The form should have opened automatically." : "Форма мала відкритись автоматично.");

    const player = document.getElementById("dicePlayer") || document.querySelector(".redirect-gif");
    if (player) {
      const currentSrc = player.getAttribute("src") || "";
      const prefix = currentSrc.replace(/[^/]+\.tgs$/, "");
      const fresh = document.createElement("tgs-player");
      fresh.className = player.className;
      fresh.setAttribute("autoplay", "");
      fresh.setAttribute("loop", "");
      fresh.setAttribute("mode", "normal");
      fresh.setAttribute("background", "transparent");
      fresh.setAttribute("src", prefix + "ducklike.tgs");
      player.replaceWith(fresh);
    }

    const statusEl  = document.querySelector(".redirect-status");
    const actionsEl = document.querySelector(".redirect-actions");
    if (statusEl)  statusEl.style.display = "none";
    if (actionsEl) actionsEl.style.display = "none";

    fallbackEl.innerHTML = "";
    fallbackEl.appendChild(document.createTextNode(lang === 'sk' ? "Ak sa neotvorilo — " : lang === 'en' ? "If it didn't open — " : "Якщо не відкрилось — "));
    fallbackEl.appendChild(manualLink);

    const indexBtn = document.createElement("a");
    indexBtn.href = "../../";
    indexBtn.textContent = lang === 'sk' ? "Chcete sa zoznámiť s prácou? →" : lang === 'en' ? "Want to get acquainted with the research? →" : "Хочете познайомитись з роботою? →";
    indexBtn.style.cssText = "display:block;margin-top:12px;font-size:0.85rem;color:var(--theme);font-weight:600;text-decoration:none;";
    indexBtn.addEventListener("mouseenter", () => indexBtn.style.textDecoration = "underline");
    indexBtn.addEventListener("mouseleave", () => indexBtn.style.textDecoration = "none");
    fallbackEl.appendChild(indexBtn);

    launchConfetti();
    track("redirect_return", {
      redirect_mode: "return",
      interaction_source: "browser_back",
    });
  }

  // ── bfcache: handle back navigation ──
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) showBackState();
  });

  // ── Fresh load: already redirected ──
  if (sessionStorage.getItem(STORAGE_KEY)) {
    showBackState();
    return;
  }

  // ── Redirect ──
  let redirected = false;
  let redirectFailureTimerId = null;

  function scheduleRedirectFailureCheck(redirectMode, interactionSource) {
    if (redirectFailureTimerId !== null) {
      clearTimeout(redirectFailureTimerId);
    }

    redirectFailureTimerId = window.setTimeout(() => {
      if (!document.hidden && window.location.pathname === new URL(window.location.href).pathname) {
        track("redirect_failed", {
          redirect_mode: redirectMode,
          interaction_source: interactionSource,
        });
      }
    }, 4500);
  }

  function redirectNow(redirectMode, interactionSource) {
    if (redirected) return;
    redirected = true;
    track(redirectMode === "manual" ? "manual_open" : "auto_redirect", {
      redirect_mode: redirectMode,
      interaction_source: interactionSource,
    });
    sessionStorage.setItem(STORAGE_KEY, "1");
    navigator.vibrate && navigator.vibrate(200);
    document.body.classList.add("page-exit");
    goNowBtn.innerHTML = '<span class="btn-spinner"></span>';
    scheduleRedirectFailureCheck(redirectMode, interactionSource);
    setTimeout(() => window.location.assign(url), 400);
  }

  // ── Timer with visibility pause ──
  let startedAt = Date.now();
  let hiddenAt = null;
  let lastSecond = null;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hiddenAt = Date.now();
    } else if (hiddenAt !== null) {
      startedAt += Date.now() - hiddenAt;
      hiddenAt = null;
    }
  });

  function render(remainingMs) {
    const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
    const lang = document.documentElement.lang || 'uk';
    timerEl.textContent = String(seconds);
    if (seconds !== lastSecond) {
      lastSecond = seconds;
      timerEl.classList.remove("tick");
      void timerEl.offsetWidth;
      timerEl.classList.add("tick");
      goNowBtn.textContent = inAppBrowser && !allowAutoRedirect
        ? (isVideo
            ? (lang === 'sk' ? "Pokračovať tu v messengeri" : (lang === 'en' ? "Continue here in messenger" : "Продовжити тут у месенджері"))
            : (lang === 'sk' ? "Vyskúšať tu v messengeri" : (lang === 'en' ? "Try here in messenger" : "Спробувати тут у месенджері")))
        : seconds > 0
          ? `${primaryActionLabel} (${seconds}${lang === 'sk' ? 's' : (lang === 'en' ? 's' : 'с')})`
          : primaryActionLabel;
    }
    const elapsed = REDIRECT_DELAY_MS - remainingMs;
    progressBar.style.width = `${Math.min(100, (elapsed / REDIRECT_DELAY_MS) * 100).toFixed(2)}%`;
  }

  render(REDIRECT_DELAY_MS);

  const intervalId = setInterval(() => {
    if (redirected) { clearInterval(intervalId); return; }
    if (!allowAutoRedirect) {
      render(REDIRECT_DELAY_MS);
      return;
    }
    const elapsed = Date.now() - startedAt;
    const remaining = REDIRECT_DELAY_MS - elapsed;
    if (remaining <= 0) {
      render(0);
      clearInterval(intervalId);
      launchConfetti();
      redirectNow("auto", "countdown");
      return;
    }
    render(remaining);
  }, 100);

  goNowBtn.addEventListener("click", () => {
    if (inAppBrowser && !allowAutoRedirect) {
      allowAutoRedirect = true;
      track("continue_in_app_browser", {
        in_app_browser: inAppBrowser.id,
        interaction_source: "primary_button",
      });
    }
    launchConfetti();
    redirectNow("manual", "primary_button");
  });
})();
