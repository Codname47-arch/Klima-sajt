(() => {
  const hero = document.getElementById("hero");
  const track = document.getElementById("track");
  const dotsWrap = document.getElementById("dots");
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".dot")) : [];

  if (!hero || !track) return;

  // Original slides (from HTML)
  const originals = Array.from(track.children);
  const realCount = originals.length;

  // Safety: ako nema dovoljno slajdova, nema šta da vrtimo
  if (realCount < 2) return;

  // ---- Infinite loop via clones ----
  const firstClone = originals[0].cloneNode(true);
  const lastClone = originals[realCount - 1].cloneNode(true);
  firstClone.dataset.clone = "first";
  lastClone.dataset.clone = "last";

  // ubaci klonove
  track.insertBefore(lastClone, originals[0]);
  track.appendChild(firstClone);

  const slides = Array.from(track.children);

  // index: 0 = lastClone, 1..realCount = real slides, realCount+1 = firstClone
  let index = 1;

  let width = 0;
  let isDragging = false;
  let isAnimating = false;

  let startX = 0;
  let currentX = 0;

  let autoplayId = null;

  // TUNING (po tvojoj želji)
  const THRESHOLD = 0.5;        // 50%
  const MANUAL_MS = 160;        // brzi "story snap"
  const AUTO_MS = 700;          // mekši autoplay
  const AUTO_INTERVAL = 4500;   // vrijeme između slajdova

  function measure() {
  width = hero.clientWidth || hero.getBoundingClientRect().width || 0;
}

  function setTransition(ms, easing = "cubic-bezier(.2,.85,.25,1)") {
    track.style.transition = ms ? `transform ${ms}ms ${easing}` : "none";
  }

  function setTranslate(px) {
    track.style.transform = `translate3d(${px}px,0,0)`;
  }

  function teleportTo(newIndex) {
    // "nevidljiv" skok: bez tranzicije, u sledećem frame-u
    setTransition(0);
    index = newIndex;
    setTranslate(-index * width);
  }

  function getRealIndex() {
    // map: index=1 -> 0, index=realCount -> realCount-1
    let r = index - 1;
    if (r < 0) r = realCount - 1;
    if (r >= realCount) r = 0;
    return r;
  }

  function updateDots() {
    if (!dots.length) return;
    const r = getRealIndex();
    dots.forEach((d, i) => d.classList.toggle("active", i === r));
  }

  
function goTo(nextIndex, ms) {
  if (isAnimating) return;
  isAnimating = true;

  // ako width slučajno ispadne 0 (rijetko na mobu), odmah izmjeri opet
  if (!width) measure();

  setTransition(ms);
  index = nextIndex;
  setTranslate(-index * width);

  let done = false;

  const finish = () => {
    if (done) return;
    done = true;

    // Ako smo završili na klonu, teleportuj na real slajd (bez crnog)
    const cur = slides[index];
    if (cur && cur.dataset.clone === "first") {
      requestAnimationFrame(() => teleportTo(1));
    } else if (cur && cur.dataset.clone === "last") {
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

  // FAIL-SAFE: ako transitionend ne stigne, završi nakon malo više od ms
  setTimeout(() => {
    track.removeEventListener("transitionend", onEnd);
    finish();
  }, (ms || 0) + 80);
}

    setTransition(ms);
    index = nextIndex;
    setTranslate(-index * width);

    const onEnd = () => {
      track.removeEventListener("transitionend", onEnd);

      // Ako smo završili na klonu, teleportuj na real slajd (bez crnog)
      const cur = slides[index];
      if (cur && cur.dataset.clone === "first") {
        // bili smo na zadnjem+1, vraćamo na prvi real (index=1)
        requestAnimationFrame(() => teleportTo(1));
      } else if (cur && cur.dataset.clone === "last") {
        // bili smo na 0, vraćamo na zadnji real (index=realCount)
        requestAnimationFrame(() => teleportTo(realCount));
      }

      updateDots();
      isAnimating = false;
    };

    track.addEventListener("transitionend", onEnd);
  }

  // ---- Autoplay ----
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

  // ---- Swipe (Insta snap) ----
  function onDown(x) {
    if (isAnimating) return;
    isDragging = true;
    startX = x;
    currentX = x;

    stopAutoplay();
    setTransition(0);
  }

  function onMove(x) {
    if (!isDragging) return;
    currentX = x;
    const delta = currentX - startX;
    setTranslate((-index * width) + delta);
  }

  function onUp() {
    if (!isDragging) return;
    isDragging = false;

    const delta = currentX - startX;
    const movedRatio = Math.abs(delta) / width;

    // >= 50% → prebaci brzo, inače vrati brzo
    if (movedRatio >= THRESHOLD) {
      if (delta < 0) {
        // swipe lijevo → sledeći
        goTo(index + 1, MANUAL_MS);
      } else {
        // swipe desno → prethodni
        goTo(index - 1, MANUAL_MS);
      }
    } else {
      // vrati na isti
      goTo(index, MANUAL_MS);
    }

    startAutoplay();
  }

  // Touch
  track.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX), { passive: true });
  track.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", onUp);

  // Mouse
  track.addEventListener("mousedown", (e) => {
    e.preventDefault();
    onDown(e.clientX);
  });
  window.addEventListener("mousemove", (e) => onMove(e.clientX));
  window.addEventListener("mouseup", onUp);

  // Dots click
  if (dotsWrap) {
    dotsWrap.addEventListener("click", (e) => {
      const dot = e.target.closest(".dot");
      if (!dot) return;

      const realTarget = Number(dot.dataset.slide); // 0..3
      const nextIndex = realTarget + 1; // jer real0 je index=1

      stopAutoplay();
      goTo(nextIndex, MANUAL_MS);
      startAutoplay();
    });
  }

  // Resize fix (sprječava prazninu/crno nakon rotacije/resize)
  window.addEventListener("resize", () => {
    measure();
    setTransition(0);
    setTranslate(-index * width);
  });

  // Init
  measure();
  setTransition(0);
  setTranslate(-index * width);
  updateDots();
  startAutoplay();
})();
