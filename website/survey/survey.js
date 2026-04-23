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
  const COMPLIMENTS = [
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
  const SUBTITLES = isVideo ? [
    "Відкриваємо відео в Google Drive",
    "Завантажуємо матеріал — секунду",
    "Готуємо відео для перегляду",
    "Відео відкривається автоматично",
    "Майже там — зачекайте мить",
  ] : [
    "Відкриваємо анкету в Google Forms",
    "Готуємо форму — секунду",
    "Завантажуємо Google Forms",
    "Форма відкривається автоматично",
    "Майже там — зачекайте мить",
  ];
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const complimentEl = document.getElementById("compliment");
  const subtitleEl   = document.getElementById("subtitle");
  if (complimentEl) complimentEl.textContent = pick(COMPLIMENTS);
  if (subtitleEl)   subtitleEl.textContent   = pick(SUBTITLES);
  const destinationLabel = isVideo ? "Google Drive" : "Google Forms";
  const primaryActionLabel = isVideo
    ? "Відкрити відео в Google Drive"
    : "Відкрити анкету в Google Forms";
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

    if (typeof window.TelegramWebview !== "undefined" || typeof window.TelegramWebviewProxy !== "undefined" || typeof window.TelegramWebviewProxyProto !== "undefined") {
      return {
        id: "telegram-webview",
        label: "Telegram",
        instruction: "У Telegram натисніть ⋮ у правому верхньому куті та оберіть «Відкрити в браузері»."
      };
    }

    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
      return {
        id: "telegram-webapp",
        label: "Telegram",
        instruction: "У Telegram натисніть ⋮ у правому верхньому куті та оберіть «Відкрити в браузері»."
      };
    }

    if (/Telegram-Android/i.test(ua)) {
      return {
        id: "telegram-android",
        label: "Telegram",
        instruction: "У Telegram натисніть ⋮ у правому верхньому куті та оберіть «Відкрити в браузері»."
      };
    }

    if (/Viber/i.test(ua)) {
      return {
        id: "viber",
        label: "Viber",
        instruction: "У Viber відкрийте меню повідомлення або сторінки, скопіюйте посилання та вставте його у Chrome чи Safari. У деяких версіях є опція відкривати посилання зовні."
      };
    }

    if (/Instagram/i.test(ua)) {
      return {
        id: "instagram",
        label: "Instagram",
        instruction: "В Instagram після відкриття сторінки шукайте іконку браузера у верхньому куті. Якщо її немає — відкрийте меню, скопіюйте посилання та вставте у Chrome чи Safari."
      };
    }

    if (/FBAN|FBAV|FBIOS|Facebook/i.test(ua)) {
      return {
        id: "facebook",
        label: "Facebook",
        instruction: "У Facebook відкрийте меню сторінки або допису, виберіть копіювання посилання й відкрийте його у Chrome чи Safari. За бажання можна ввімкнути відкриття посилань у зовнішньому браузері в налаштуваннях."
      };
    }

    if (/musical_ly|BytedanceWebview/i.test(ua)) {
      return {
        id: "tiktok",
        label: "TikTok",
        instruction: "У TikTok відкрийте сторінку, шукайте кнопку відкриття у браузері у верхньому куті. Якщо її немає — скопіюйте посилання та відкрийте його у браузері вручну."
      };
    }

    if (/WhatsApp/i.test(ua)) {
      return {
        id: "whatsapp",
        label: "WhatsApp",
        instruction: "WhatsApp зазвичай відкриває посилання у браузері. Якщо сторінка все ж відкрилася всередині, знайдіть «Відкрити в браузері» або скопіюйте посилання."
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
  let allowAutoRedirect = !inAppBrowser;

  function showInAppBrowserPrompt() {
    if (!inAppBrowser || !subtitleEl) {
      return;
    }

    document.body.classList.add("is-in-app-browser");
    subtitleEl.textContent = `У ${inAppBrowser.label} ${destinationLabel} може відкриватися нестабільно.`;

    const prompt = document.createElement("section");
    prompt.className = "inapp-prompt";
    prompt.innerHTML = `
      <p class="inapp-prompt-title">Краще відкрити цю сторінку в браузері</p>
      <p class="inapp-prompt-copy">${inAppBrowser.instruction}</p>
      <div class="inapp-prompt-actions">
        <button class="inapp-copy-btn" type="button">Скопіювати посилання</button>
      </div>
      <p class="inapp-prompt-note">Після цього вставте посилання у Safari, Chrome або інший браузер.</p>
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
        copyBtn.textContent = copied ? "Посилання скопійовано" : "Не вдалося скопіювати";
        track("open_in_browser_copy", {
          in_app_browser: inAppBrowser.id,
          copy_success: copied,
        });
      });
    }

    goNowBtn.textContent = isVideo
      ? "Продовжити тут у месенджері"
      : "Спробувати тут у месенджері";

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
    ? "відкрити Google Drive вручну →"
    : "відкрити Google Forms вручну →";
  manualLink.rel = "noopener noreferrer";
  manualLink.target = "_blank";
  fallbackEl.textContent = "Не відкрилось? ";
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

    const h1  = document.getElementById("compliment");
    const sub = document.getElementById("subtitle");
    if (h1)  h1.textContent = "Вже були тут — дякуємо!";
    if (sub) sub.textContent = isVideo
      ? "Відео мало відкритись автоматично."
      : "Форма мала відкритись автоматично.";

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
    fallbackEl.appendChild(document.createTextNode("Якщо не відкрилось — "));
    fallbackEl.appendChild(manualLink);

    const indexBtn = document.createElement("a");
    indexBtn.href = "../../";
    indexBtn.textContent = "Хочете познайомитись з роботою? →";
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
    timerEl.textContent = String(seconds);
    if (seconds !== lastSecond) {
      lastSecond = seconds;
      timerEl.classList.remove("tick");
      void timerEl.offsetWidth;
      timerEl.classList.add("tick");
      goNowBtn.textContent = inAppBrowser && !allowAutoRedirect
        ? (isVideo ? "Продовжити тут у месенджері" : "Спробувати тут у месенджері")
        : seconds > 0
          ? `${primaryActionLabel} (${seconds}с)`
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
