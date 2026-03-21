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

  const pathname = getPathname();
  const segments = getSegments();
  const isDebugHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const context = {
    page_kind: getPageKind(pathname, segments),
    page_path: clean(window.location.pathname),
    page_title: clean(document.title),
    audience: getAudience(pathname),
    material_code: getMaterialCode(segments),
    target_type: getTargetType(pathname, segments),
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
    track("material_view", { material_type: "text" });
    return;
  }

  if (context.page_kind === "not_found") {
    track("not_found_view");
  }
})();
