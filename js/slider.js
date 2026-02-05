const hero = document.getElementById('hero');
const track = document.getElementById('track');
const dots = Array.from(document.querySelectorAll('.dot'));

let slides = Array.from(track.children);
const realCount = slides.length;

// --- klonovi za seamless loop ---
const firstClone = slides[0].cloneNode(true);
const lastClone  = slides[slides.length - 1].cloneNode(true);

track.insertBefore(lastClone, slides[0]);
track.appendChild(firstClone);

slides = Array.from(track.children);

// index 1 = prvi pravi slajd
let index = 1;

let slideWidth = hero.clientWidth;

// auto
let timer = null;
const AUTO_TIME = 6000;

// swipe state
let isDragging = false;
let startX = 0;
let startTranslate = 0;
let startTime = 0;

// pragovi
const DIST_THRESHOLD = 0.22;     // 22% širine
const VELOCITY_FLICK = 0.9;      // px/ms (flick)
const VELOCITY_OK = 0.55;        // px/ms (brži swipe)

// helpers
function setTransitionMs(ms) {
  track.style.transition = `transform ${ms}ms cubic-bezier(.2,.9,.2,1)`;
}

function setNoTransition() {
  track.style.transition = 'none';
}

function translateFor(i) {
  return -i * slideWidth;
}

function setTranslate(px) {
  track.style.transform = `translateX(${px}px)`;
}

function realIndexFrom(i) {
  if (i === 0) return realCount - 1;
  if (i === realCount + 1) return 0;
  return i - 1;
}

function updateDots() {
  const r = realIndexFrom(index);
  dots.forEach(d => d.classList.remove('active'));
  dots[r].classList.add('active');
}

function goTo(i, ms = 1200) {
  index = i;
  setTransitionMs(ms);
  setTranslate(translateFor(index));
  updateDots();
}

function snapTo(i) {
  index = i;
  setNoTransition();
  setTranslate(translateFor(index));
  updateDots();
}

// init
setNoTransition();
setTranslate(translateFor(index));
updateDots();

// auto
function startAuto() {
  stopAuto();
  timer = setInterval(() => {
    goTo(index + 1, 1200);
  }, AUTO_TIME);
}
function stopAuto() {
  if (timer) clearInterval(timer);
  timer = null;
}
startAuto();

// seamless teleport bez crnog (dvostruki requestAnimationFrame)
track.addEventListener('transitionend', () => {
  if (index === 0) {
    requestAnimationFrame(() => {
      snapTo(realCount);
    });
  } else if (index === realCount + 1) {
    requestAnimationFrame(() => {
      snapTo(1);
    });
  }
});

// dots click
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const targetReal = parseInt(dot.dataset.slide, 10); // 0..3
    const targetIndex = targetReal + 1; // 1..4
    goTo(targetIndex, 900);
    startAuto();
  });
});

// resize
window.addEventListener('resize', () => {
  slideWidth = hero.clientWidth;
  snapTo(index);
});

// SMART swipe (prati prst)
hero.addEventListener('touchstart', (e) => {
  stopAuto();
  isDragging = true;

  setNoTransition();

  startX = e.touches[0].clientX;
  startTime = Date.now();
  startTranslate = translateFor(index);
}, { passive:true });

hero.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const x = e.touches[0].clientX;
  const dx = x - startX;

  setTranslate(startTranslate + dx);
}, { passive:true });

hero.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  isDragging = false;

  const endX = e.changedTouches[0].clientX;
  const dx = endX - startX;
  const dt = Math.max(1, Date.now() - startTime);

  const velocity = Math.abs(dx / dt); // px/ms
  const ratio = Math.abs(dx) / slideWidth;

  // brzina animacije zavisi od “zaleta”
  // flick -> veoma brzo, brži swipe -> brzo, inače normalno
  let animMs = 900;
  if (velocity >= VELOCITY_FLICK) animMs = 280;
  else if (velocity >= VELOCITY_OK) animMs = 450;
  else animMs = 900;

  // Odluka: pređi ako je dovoljno daleko ili dovoljno brzo
  const shouldMove = (ratio > DIST_THRESHOLD) || (velocity >= VELOCITY_OK);

  if (shouldMove) {
    if (dx < 0) goTo(index + 1, animMs);
    else goTo(index - 1, animMs);
  } else {
    goTo(index, 650);
  }

  startAuto();
}, { passive:true });

// desktop hover pause
hero.addEventListener('mouseenter', stopAuto);
hero.addEventListener('mouseleave', startAuto);
