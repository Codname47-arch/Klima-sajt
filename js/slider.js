(() => {
    // FIX: ne skrolaj automatski na #ponuda ili bilo koji hash pri ulasku
  if (window.location.hash && window.location.hash !== "#hero") {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }

  const hero = document.getElementById("hero");
  const track = document.getElementById("track");
  const dotsWrap = document.getElementById("dots");

  if (!hero || !track) return;

  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".dot")) : [];

  const originals = Array.from(track.children);
  const realCount = originals.length;
  if (realCount < 2) return;

  // clones
  const firstClone = originals[0].cloneNode(true);
  const lastClone = originals[realCount - 1].cloneNode(true);
  firstClone.dataset.clone = "first";
  lastClone.dataset.clone = "last";
  track.insertBefore(lastClone, originals[0]);
  track.appendChild(firstClone);

  const slides = Array.from(track.children);
  let index = 1;
  let width = 0;

  let isDragging = false;
  let isAnimating = false;

  let startX = 0;
  let currentX = 0;

  // tuning
  const THRESHOLD = 0.5;    // 50%
  const MANUAL_MS = 160;    // brzo (swipe)
  const AUTO_MS = 700;      // sporije (auto)
  const AUTO_INTERVAL = 4500;

  let autoplayId = null;

  function measure() {
    width = hero.clientWidth || hero.getBoundingClientRect().width || 0;
  }

  function setTransition(ms) {
    track.style.transition = ms ? `transform ${ms}ms cubic-bezier(.2,.85,.25,1)` : "none";
  }

  function setTranslate(px) {
    track.style.transform = `translate3d(${px}px,0,0)`;
  }

  function teleportTo(newIndex) {
    setTransition(0);
    index = newIndex;
    setTranslate(-index * width);
  }

  function realIndex() {
    let r = index - 1;
    if (r < 0) r = realCount - 1;
    if (r >= realCount) r = 0;
    return r;
  }

  function updateDots() {
    if (!dots.length) return;
    const r = realIndex();
    dots.forEach((d, i) => d.classList.toggle("active", i === r));
  }

  function goTo(nextIndex, ms) {
    if (isAnimating) return;
    isAnimating = true;

    if (!width) measure();

    setTransition(ms);
    index = nextIndex;
    setTranslate(-index * width);

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;

      const cur = slides[index];
      if (cur?.dataset.clone === "first") {
        requestAnimationFrame(() => teleportTo(1));
      } else if (cur?.dataset.clone === "last") {
        requestAnimationFrame(() => teleportTo(realCount));
      }

      updateDots();
      isAnimating = false;
    };

    const onEnd = () => {
      track.removeEventListener("transitionend", onEnd);
      finish();
    };

    track.addEventListener("transitionend", onEnd);
    setTimeout(() => {
      track.removeEventListener("transitionend", onEnd);
      finish();
    }, (ms || 0) + 120);
  }

  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
    autoplayId = null;
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(() => {
      if (isDragging || isAnimating) return;
      goTo(index + 1, AUTO_MS);
    }, AUTO_INTERVAL);
  }

  // Pointer events (najbolje za Android)
  track.style.touchAction = "pan-y";

  track.addEventListener("pointerdown", (e) => {
    if (isAnimating) return;
    isDragging = true;
    startX = e.clientX;
    currentX = e.clientX;
    stopAutoplay();
    setTransition(0);
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const delta = currentX - startX;
    setTranslate((-index * width) + delta);
  });

  track.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;

    const delta = currentX - startX;
    const movedRatio = Math.abs(delta) / width;

    if (movedRatio >= THRESHOLD) {
      goTo(delta < 0 ? index + 1 : index - 1, MANUAL_MS);
    } else {
      goTo(index, MANUAL_MS);
    }

    startAutoplay();
  });

  track.addEventListener("pointercancel", () => {
    if (!isDragging) return;
    isDragging = false;
    goTo(index, MANUAL_MS);
    startAutoplay();
  });

  // dots
  dotsWrap?.addEventListener("click", (e) => {
    const dot = e.target.closest(".dot");
    if (!dot) return;
    const t = Number(dot.dataset.slide);
    stopAutoplay();
    goTo(t + 1, MANUAL_MS);
    startAutoplay();
  });

  window.addEventListener("resize", () => {
    measure();
    setTransition(0);
    setTranslate(-index * width);
  });

  // init
  measure();
  setTransition(0);
  setTranslate(-index * width);
  updateDots();
  startAutoplay();
  // MENU (hamburger)
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = navMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // klik van menija zatvara
  document.addEventListener("click", closeMenu);

  // klik na link zatvara meni
  navMenu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    closeMenu();
  });
}

})();
