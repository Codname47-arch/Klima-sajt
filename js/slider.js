const track = document.getElementById('track');
const dots = document.querySelectorAll('.dot');
const hero = document.getElementById('hero');

let index = 0;
let timer = null;

const SLIDE_TIME = 6000; // 6 sekundi

function goTo(i){
  index = (i + dots.length) % dots.length;
  track.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach(d => d.classList.remove('active'));
  dots[index].classList.add('active');
}

function start(){
  stop();
  timer = setInterval(() => goTo(index + 1), SLIDE_TIME);
}

function stop(){
  if(timer) clearInterval(timer);
  timer = null;
}

// start
goTo(0);
start();

// dots click
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goTo(parseInt(dot.dataset.slide, 10));
    start();
  });
});

// pause on hold / hover
hero.addEventListener('touchstart', stop, { passive:true });
hero.addEventListener('touchend', start, { passive:true });
hero.addEventListener('mouseenter', stop);
hero.addEventListener('mouseleave', start);

// swipe
let startX = 0;
hero.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
}, { passive:true });

hero.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if(Math.abs(dx) > 50){
    if(dx < 0) goTo(index + 1);
    else goTo(index - 1);
    start();
  }
}, { passive:true });
