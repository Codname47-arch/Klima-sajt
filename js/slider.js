const hero = document.getElementById('hero');
const track = document.getElementById('track');
const dots = Array.from(document.querySelectorAll('.dot'));

// Originalni slajdovi (4 kom)
let slides = Array.from(track.children);
const realCount = slides.length;

// ==== SEAMLESS LOOP (klonovi) ====
// Klon zadnjeg ide na početak, klon prvog ide na kraj
const firstClone = slides[0].cloneNode(true);
const lastClone  = slides[slides.length - 1].cloneNode(true);

track.insertBefore(lastClone, slides[0]);
track.appendChild(firstClone);

// Refresh list
slides = Array.from(track.children);

// Index: 1 znači "prvi pravi slajd" (jer 0 je klon zadnjeg)
let index = 1;

// U px
let slideWidth = hero.clientWidth;

// Auto
let timer = null;
const AUTO_TIME = 6000;

// Swipe state
let isDragging = false;
let startX = 0;
let startTime = 0;
let startTranslate = 0;

// Helpers
function setTransition(on) {
  track.style.transition = on ? 'transform 1.5s ease-in-out' : 'none';
}

function setTranslate(px) {
  track.style.transform = `translateX(${px}px)`;
}

function getTranslateForIndex(i) {
  return -i * slideWidth;
}

function activeDot(realIndex) {
  dots.forEach(d => d.classList.remove('active'));
  dots[realIndex].classList.add('active');
}

function getRealIndexFromIndex(i) {
  // i: 1..realCount => 0..realCount-1
  if (i === 0) return realCount - 1;
  if (i === realCount + 1) return 0;
  return i - 1;
}

function goTo(newIndex, animated = true) {
  index = newIndex;
  setTransition(animated);
  setTranslate(getTranslateForIndex(index));
  activeDot(getRealIndexFromIndex(index));
}

function startAuto() {
  stopAuto();
  timer = setInterval(() => {
    goTo(index + 1, true);
  }, AUTO_TIME);
}

function stopAuto() {
  if (timer) clearInterval(timer);
  timer = null;
}

// Init position (bez animacije)
setTransition(false);
setTranslate(getTranslateForIndex(index));
activeDot(0);
startAuto();

// Kad animacija završi: ako smo na klonu, “teleport” bez animacije
track.addEventListener('transitionend', () => {
  if (index === 0) {
    // bili smo na klonu zadnjeg -> skoči na pravi zadnji
    goTo(realCount, false);
  } else if (index === realCount + 1) {
    // bili smo na klonu prvog -> skoči na pravi prvi
    goTo(1, false);
  }
});

// Dots click
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const targetReal = parseInt(dot.dataset.slide, 10); // 0..3
    const targetIndex = targetReal + 1; // 1..4
    goTo(targetIndex, true);
    startAuto();
  });
});

// Resize fix
window.addEventListener('resize', () => {
  slideWidth = hero.clientWidth;
  setTransition(false);
  setTranslate(getTranslateForIndex(index));
});

// ==== SMART SWIPE ====
// Pravilo: pređi slajd ako:
// - povukao si više od 25% širine, ili
// - brz “flick” (velocity) > 0.6 px/ms
const DIST_THRESHOLD = 0.25; // 25%
const VELOCITY_THRESHOLD = 0.6;

function onTouchStart(e) {
  stopAuto();
  isDragging = true;

  setTransition(false);

  startX = e.touches[0].clientX;
  startTime = Date.now();
  startTranslate = getTranslateForIndex(index);

  // da ne klikće link dok vučeš
  hero.classList.add('dragging');
}

function onTouchMove(e) {
  if (!isDragging) return;

  const x = e.touches[0].clientX;
  const dx = x - startX;

  // prst pomjera cijeli track
  setTranslate(startTranslate + dx);
}

function onTouchEnd(e) {
  if (!isDragging) return;
  isDragging = false;

  const endX = e.changedTouches[0].clientX;
  const dx = endX - startX;
  const dt = Math.max(1, Date.now() - startTime);
  const velocity = Math.abs(dx / dt); // px/ms
  const movedRatio = Math.abs(dx) / slideWidth;

  setTransition(true);

  // Odluka
  if (movedRatio > DIST_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
    if (dx < 0) goTo(index + 1, true);  // lijevo -> next
    else goTo(index - 1, true);         // desno -> prev
  } else {
    goTo(index, true);                  // vrati nazad
  }

  startAuto();
  hero.classList.remove('dragging');
}

// Pause on hold already covered by stopAuto/startAuto in touch events,
// but we also handle mouse hover (desktop)
hero.addEventListener('mouseenter', stopAuto);
hero.addEventListener('mouseleave', startAuto);

// Touch events
hero.addEventListener('touchstart', onTouchStart, { passive: true });
hero.addEventListener('touchmove', onTouchMove, { passive: true });
hero.addEventListener('touchend', onTouchEnd, { passive: true });
