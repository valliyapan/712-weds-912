// ===== Nav toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Countdown =====
const WEDDING_DATE = new Date('2026-10-30T06:00:00+05:30').getTime();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function tickCountdown() {
  const now = Date.now();
  const diff = WEDDING_DATE - now;
  if (diff <= 0) {
    document.getElementById('countdown-cards').hidden = true;
    document.getElementById('countdown-message').hidden = false;
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}
tickCountdown();
setInterval(tickCountdown, 1000);

// ===== Scroll reveal =====
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// ===== Floating petals (hero background) =====
const canvas = document.getElementById('petals');
const ctx = canvas.getContext('2d');
let petals = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function makePetal() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: 6 + Math.random() * 10,
    speed: 0.5 + Math.random() * 1.2,
    drift: Math.random() * 1 - 0.5,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
    color: ['#F9A825', '#FFE3EC', '#D4AF37'][Math.floor(Math.random() * 3)]
  };
}

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = p.color;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach(p => {
    p.y += p.speed;
    p.x += p.drift;
    p.rotation += p.rotSpeed;
    if (p.y > canvas.height) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
    drawPetal(p);
  });
  requestAnimationFrame(animatePetals);
}

if (!reduceMotion) {
  resizeCanvas();
  petals = Array.from({ length: 26 }, makePetal);
  window.addEventListener('resize', resizeCanvas);
  animatePetals();
}

// ===== Gallery lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxContent.innerHTML = item.querySelector('svg').outerHTML;
    lightboxContent.style.background = getComputedStyle(item).background;
    lightbox.hidden = false;
  });
});
lightboxClose.addEventListener('click', () => { lightbox.hidden = true; });
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.hidden = true; });

// ===== RSVP form submit (AJAX + confetti) =====
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById('rsvpSubmit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(rsvpForm)).toString()
    });
    rsvpForm.hidden = true;
    rsvpSuccess.hidden = false;
    if (!reduceMotion) burstConfetti();
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send RSVP';
    alert('Something went wrong. Please try again or call us directly.');
  }
});

// ===== Confetti burst =====
function burstConfetti() {
  const cCanvas = document.getElementById('confetti');
  const cCtx = cCanvas.getContext('2d');
  cCanvas.width = window.innerWidth;
  cCanvas.height = window.innerHeight;
  const colors = ['#C2185B', '#F9A825', '#00796B', '#D4AF37', '#FFE3EC'];
  let pieces = Array.from({ length: 90 }, () => ({
    x: cCanvas.width / 2,
    y: cCanvas.height / 3,
    vx: (Math.random() - 0.5) * 12,
    vy: Math.random() * -10 - 4,
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.3
  }));
  let frame = 0;
  function step() {
    frame++;
    cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    pieces.forEach(p => {
      p.vy += 0.28;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate(p.rot);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      cCtx.restore();
    });
    if (frame < 130) {
      requestAnimationFrame(step);
    } else {
      cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    }
  }
  step();
}
