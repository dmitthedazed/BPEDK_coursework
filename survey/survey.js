const REDIRECT_DELAY_MS = 3600;

const tgWebApp = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tgWebApp) {
  tgWebApp.ready();
  tgWebApp.expand();
}

const links = Array.isArray(window.SURVEY_LINKS) && window.SURVEY_LINKS.length
  ? window.SURVEY_LINKS
  : ["https://example.org"];

function getRandomLink() {
  const randomIndex = Math.floor(Math.random() * links.length);
  return links[randomIndex];
}

const url = getRandomLink();
const timerEl = document.getElementById("timer");
const fallbackEl = document.getElementById("fallback");
const progressBar = document.getElementById("progressBar");
const goNowBtn = document.getElementById("goNowBtn");

if (!timerEl || !fallbackEl || !progressBar || !goNowBtn) {
  throw new Error("Required UI elements were not found");
}

const manualLink = document.createElement("a");
manualLink.href = url;
manualLink.textContent = url;
manualLink.rel = "noopener noreferrer";
manualLink.target = "_blank";

fallbackEl.textContent = "Якщо редирект не спрацював, відкрийте вручну: ";
fallbackEl.appendChild(manualLink);

let redirected = false;
const startedAt = Date.now();

function redirectNow() {
  if (redirected) {
    return;
  }

  redirected = true;
  window.location.assign(url);
}

function render(remainingMs) {
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  timerEl.textContent = String(seconds);

  const elapsed = Math.min(REDIRECT_DELAY_MS, REDIRECT_DELAY_MS - remainingMs);
  const progress = (elapsed / REDIRECT_DELAY_MS) * 100;
  progressBar.style.width = `${progress.toFixed(2)}%`;
}

render(REDIRECT_DELAY_MS);

const intervalId = setInterval(() => {
  if (redirected) {
    clearInterval(intervalId);
    return;
  }

  const elapsed = Date.now() - startedAt;
  const remaining = REDIRECT_DELAY_MS - elapsed;

  if (remaining <= 0) {
    render(0);
    clearInterval(intervalId);
    redirectNow();
    return;
  }

  render(remaining);
}, 100);

goNowBtn.addEventListener("click", redirectNow);
