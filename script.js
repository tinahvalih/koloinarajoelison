const body = document.body;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

const waitForPageReady = async () => {
  const loadPromise =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));

  const fontPromise = document.fonts ? document.fonts.ready.catch(() => undefined) : undefined;

  await Promise.all([loadPromise, fontPromise, wait(900)]);
};

const finishLoader = async () => {
  if (reduceMotion) {
    body.classList.remove("is-loading");
    body.classList.add("is-ready");
    return;
  }

  await waitForPageReady();
  body.classList.remove("is-loading");
  body.classList.add("is-ready");
};

finishLoader().catch(() => {
  body.classList.remove("is-loading");
  body.classList.add("is-ready");
});

const links = document.querySelectorAll('a[href^="#"]');

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
