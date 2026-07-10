const body = document.body;
const heroPanel = document.querySelector(".hero-panel");
const easeOutExpo = "cubic-bezier(0.16, 1, 0.3, 1)";

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

  await Promise.all([loadPromise, fontPromise]);
};

const measureFinalPanel = () => {
  body.classList.remove("intro-pending", "intro-lock");
  body.classList.add("intro-measuring");

  heroPanel.removeAttribute("style");
  const rect = heroPanel.getBoundingClientRect();
  const styles = window.getComputedStyle(heroPanel);

  body.classList.remove("intro-measuring");
  body.classList.add("intro-pending", "intro-lock");

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    borderRadius: styles.borderRadius,
    borderWidth: styles.borderTopWidth,
  };
};

const runIntro = async () => {
  if (!heroPanel) {
    body.classList.remove("intro-pending");
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !heroPanel.animate) {
    body.classList.remove("intro-pending", "intro-lock");
    body.classList.add("intro-complete");
    return;
  }

  body.classList.add("intro-lock");
  await waitForPageReady();

  const finalPanel = measureFinalPanel();
  const barWidth = Math.min(300, window.innerWidth * 0.7);
  const barHeight = 42;
  const barLeft = (window.innerWidth - barWidth) / 2;
  const barTop = (window.innerHeight - barHeight) / 2;

  Object.assign(heroPanel.style, {
    position: "fixed",
    inset: "auto",
    left: `${barLeft}px`,
    top: `${barTop}px`,
    zIndex: "80",
    width: "0px",
    height: `${barHeight}px`,
    borderRadius: "999px",
    borderWidth: "4px",
    transform: "none",
    transformOrigin: "center",
  });

  const loadingAnimation = heroPanel.animate(
    [
      {
        width: "0px",
        opacity: 0.75,
        filter: "blur(0)",
      },
      {
        width: `${barWidth}px`,
        opacity: 1,
        filter: "blur(0)",
      },
    ],
    {
      duration: 1350,
      easing: easeOutExpo,
      fill: "forwards",
    }
  );

  await loadingAnimation.finished;
  loadingAnimation.cancel();

  Object.assign(heroPanel.style, {
    left: `${barLeft}px`,
    top: `${barTop}px`,
    width: `${barWidth}px`,
    height: `${barHeight}px`,
  });

  const morphAnimation = heroPanel.animate(
    [
      {
        left: `${barLeft}px`,
        top: `${barTop}px`,
        width: `${barWidth}px`,
        height: `${barHeight}px`,
        borderRadius: "999px",
        borderWidth: "4px",
        boxShadow: "0 18px 45px rgba(87, 58, 46, 0.12)",
      },
      {
        left: `${finalPanel.left}px`,
        top: `${finalPanel.top}px`,
        width: `${finalPanel.width}px`,
        height: `${finalPanel.height}px`,
        borderRadius: finalPanel.borderRadius,
        borderWidth: finalPanel.borderWidth,
        boxShadow: "0 0 0 rgba(87, 58, 46, 0)",
      },
    ],
    {
      duration: 1750,
      easing: easeOutExpo,
      fill: "forwards",
    }
  );

  await morphAnimation.finished;

  Object.assign(heroPanel.style, {
    left: `${finalPanel.left}px`,
    top: `${finalPanel.top}px`,
    width: `${finalPanel.width}px`,
    height: `${finalPanel.height}px`,
    borderRadius: finalPanel.borderRadius,
    borderWidth: finalPanel.borderWidth,
    boxShadow: "0 0 0 rgba(87, 58, 46, 0)",
  });

  morphAnimation.cancel();

  await new Promise((resolve) => requestAnimationFrame(resolve));

  heroPanel.removeAttribute("style");
  body.classList.remove("intro-pending");
  body.classList.add("intro-revealing");

  await wait(1450);

  body.classList.remove("intro-lock", "intro-revealing");
  body.classList.add("intro-complete");
};

runIntro().catch(() => {
  heroPanel?.removeAttribute("style");
  body.classList.remove("intro-pending", "intro-lock", "intro-revealing");
  body.classList.add("intro-complete");
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
