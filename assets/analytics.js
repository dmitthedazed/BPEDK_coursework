(function () {
  function hasGtag() {
    return typeof window.gtag === "function";
  }

  function clean(value) {
    return typeof value === "string" ? value.trim() : value;
  }

  function sanitizeParams(params) {
    const out = {};

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      out[key] = typeof value === "string" ? value.slice(0, 100) : value;
    });

    return out;
  }

  function getPathname() {
    const pathname = window.location.pathname || "/";
    return pathname.endsWith("/") ? pathname : pathname + "/";
  }

  function getSegments() {
    return getPathname().split("/").filter(Boolean);
  }

  function parseUrl(url) {
    if (!url) {
      return null;
    }

    try {
      return new URL(url, window.location.origin);
    } catch (error) {
      return null;
    }
  }

  function getAudience(pathname) {
    if (pathname.includes("/survey/parents/")) {
      return "parents";
    }

    if (pathname.includes("/survey/educators/")) {
      return "educators";
    }

    return null;
  }

  function getMaterialCode(segments) {
    return segments[0] === "m" && segments[1] ? segments[1] : null;
  }

  function isRedirectPage() {
    return Boolean(document.getElementById("goNowBtn") && document.getElementById("timer"));
  }

  function getTargetType(pathname, segments) {
    if (pathname.includes("/survey/")) {
      return "form";
    }

    if (segments[0] === "m" && segments[1] && isRedirectPage()) {
      return "video";
    }

    if (segments[0] === "m" && segments[1]) {
      return "text";
    }

    return null;
  }

  function getPageKind(pathname, segments) {
    if (pathname.includes("/survey/parents/")) {
      return "survey_parents_redirect";
    }

    if (pathname.includes("/survey/educators/")) {
      return "survey_educators_redirect";
    }

    if (segments[0] === "m" && segments[1] && isRedirectPage()) {
      return "video_redirect";
    }

    if (segments[0] === "m" && segments[1]) {
      return "text_material";
    }

    if (pathname.includes("/m/")) {
      return "materials_hub";
    }

    if (document.title.includes("404") || document.body.dataset.pageType === "404") {
      return "not_found";
    }

    if (pathname === "/" || /\/BPEDK_coursework\/$/.test(pathname)) {
      return "landing";
    }

    return "generic";
  }

  function getReferrerData() {
    const referrer = parseUrl(document.referrer);

    if (!referrer) {
      return {};
    }

    return {
      referrer_host: clean(referrer.host),
      referrer_path: clean(referrer.pathname),
      referrer_url: clean(document.referrer),
    };
  }

  function getViewportWidth() {
    return Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
  }

  function getViewportBucket(width) {
    if (width <= 480) {
      return "small";
    }

    if (width <= 900) {
      return "medium";
    }

    return "large";
  }

  function getPointerType() {
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
      return "coarse";
    }

    if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
      return "fine";
    }

    return "none";
  }

  function hasTouchSupport() {
    return Boolean(
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  function getNormalizedPath(url) {
    const parsed = parseUrl(url);

    if (!parsed || parsed.origin !== window.location.origin) {
      return null;
    }

    return parsed.pathname.endsWith("/") ? parsed.pathname : parsed.pathname + "/";
  }

  function getLinkText(link) {
    return clean((link.textContent || "").replace(/\s+/g, " "));
  }

  function scheduleVisibleTimeout(callback, delayMs) {
    let startedAt = Date.now();
    let remainingMs = delayMs;
    let timeoutId = null;
    let isDone = false;

    function clear() {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }

    function finish() {
      if (isDone) {
        return;
      }

      isDone = true;
      clear();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      callback();
    }

    function startTimer() {
      startedAt = Date.now();
      timeoutId = window.setTimeout(finish, remainingMs);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        remainingMs -= Date.now() - startedAt;
        clear();
        return;
      }

      if (remainingMs <= 0) {
        finish();
        return;
      }

      startTimer();
    }

    if (document.hidden) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return;
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startTimer();
  }

  const pathname = getPathname();
  const segments = getSegments();
  const isDebugHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const viewportWidth = getViewportWidth();
  const context = {
    page_kind: getPageKind(pathname, segments),
    page_path: clean(window.location.pathname),
    page_title: clean(document.title),
    audience: getAudience(pathname),
    material_code: getMaterialCode(segments),
    target_type: getTargetType(pathname, segments),
    viewport_bucket: getViewportBucket(viewportWidth),
    is_telegram_webapp: Boolean(window.Telegram && window.Telegram.WebApp),
    prefers_reduced_motion: Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    touch_support: hasTouchSupport(),
    pointer_type: getPointerType(),
    ...getReferrerData(),
  };

  function track(eventName, params) {
    if (!hasGtag()) {
      return false;
    }

    window.gtag("event", eventName, sanitizeParams({
      ...context,
      debug_mode: isDebugHost ? true : undefined,
      ...params,
    }));

    return true;
  }

  window.BPEDKAnalytics = {
    track,
    getContext: function () {
      return { ...context };
    },
  };

  function installEntryClickTracking() {
    document.addEventListener("click", function (event) {
      const link = event.target.closest("a[href]");

      if (!link) {
        return;
      }

      const path = getNormalizedPath(link.href);
      const linkText = getLinkText(link);

      if (!path) {
        return;
      }

      if (/\/survey\/(parents|educators)\/$/.test(path)) {
        track("survey_entry_click", {
          audience: path.includes("/parents/") ? "parents" : "educators",
          entry_location: context.page_kind,
          link_path: path,
          link_label: linkText,
        });
      }

      const materialMatch = path.match(/\/m\/([^/]+)\/$/);
      if (materialMatch && (context.page_kind === "materials_hub" || context.page_kind === "landing")) {
        track("material_card_click", {
          material_code: materialMatch[1],
          entry_location: context.page_kind,
          link_path: path,
          link_label: linkText,
          target_type: link.closest(".mat-card--video") ? "video" : link.closest(".mat-card--text") ? "text" : null,
        });
      }

      if (context.page_kind === "not_found" && link.closest(".error-link")) {
        track("404_link_click", {
          entry_location: context.page_kind,
          link_path: path,
          link_label: linkText,
        });
      }
    }, { passive: true });
  }

  function installTextReadTracking() {
    const article = document.querySelector(".story-content");

    if (!article) {
      return;
    }

    track("text_read_start", {
      material_type: "text",
      entry_location: context.page_kind,
    });

    scheduleVisibleTimeout(function () {
      track("text_read_engaged", {
        material_type: "text",
        read_time_bucket: "15s",
      });
    }, 15000);

    let completed = false;
    const lastBlock = article.lastElementChild || article;

    function markComplete() {
      if (completed) {
        return;
      }

      completed = true;
      track("text_read_complete", {
        material_type: "text",
        completion_percent: 100,
      });
    }

    if (window.IntersectionObserver && lastBlock) {
      const observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
          observer.disconnect();
          markComplete();
        }
      }, {
        threshold: 0.6,
      });

      observer.observe(lastBlock);
      return;
    }

    function onScroll() {
      const rect = article.getBoundingClientRect();
      if (rect.bottom <= window.innerHeight * 1.1) {
        window.removeEventListener("scroll", onScroll);
        markComplete();
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  installEntryClickTracking();

  if (context.page_kind === "survey_parents_redirect") {
    track("survey_parents_open");
    return;
  }

  if (context.page_kind === "survey_educators_redirect") {
    track("survey_educators_open");
    return;
  }

  if (context.page_kind === "video_redirect") {
    track("video_open");
    return;
  }

  if (context.page_kind === "text_material") {
    installTextReadTracking();
    track("material_view", { material_type: "text" });
    return;
  }

  if (context.page_kind === "materials_hub") {
    track("hub_open");
    return;
  }

  if (context.page_kind === "not_found") {
    track("not_found_view");
  }
})();
