/* ==========================================================================
   Kumaresan B - Complete Editorial Light-Grid & Glassify Script
   Spider-Web Particle Canvas, Glowing Neon Cursor, 3D Side Render & Shatter
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSpiderWebCanvas();
  initCustomGlowingCursor();
  initRotatingHeadline();
  initPrintingIntro();
  initCenterpiece3DVisual();
  initCornerUtilities();
  initCard3DTilt();
  initContactForm();
  initNavSpy();
});

/* ==========================================================================
   1. Interactive Spider-Web Particle Canvas
   ========================================================================== */
function initSpiderWebCanvas() {
  const canvas = document.getElementById('spiderweb-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 13000), 85);
  const maxDistance = 150;
  const mouse = { x: -1000, y: -1000, radius: 180 };

  class WebParticle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = (Math.random() - 0.5) * 0.65;
      this.radius = Math.random() * 2 + 1.2;
      this.baseAlpha = Math.random() * 0.4 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse attraction / web flex
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 1.2;
        this.y -= Math.sin(angle) * force * 1.2;
      }
    }

    draw() {
      const accentPink = getComputedStyle(document.documentElement).getPropertyValue('--accent-pink').trim() || '#ff007f';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = accentPink;
      ctx.globalAlpha = this.baseAlpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = accentPink;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new WebParticle());
  }

  function renderSpiderWeb() {
    ctx.clearRect(0, 0, width, height);

    const accentPink = getComputedStyle(document.documentElement).getPropertyValue('--accent-pink').trim() || '#ff007f';

    // Inter-particle spider web connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Spider web connections to cursor
    if (mouse.x > 0 && mouse.y > 0) {
      for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = accentPink;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(renderSpiderWeb);
  }

  renderSpiderWeb();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });
}

/* ==========================================================================
   2. Custom Glowing Neon Cursor & Spotlight Aura
   ========================================================================== */
function initCustomGlowingCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const aura = document.getElementById('spotlight-aura');

  if (!dot || !ring || !aura) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let auraX = -100;
  let auraY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursorGlow() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    auraX += (mouseX - auraX) * 0.08;
    auraY += (mouseY - auraY) * 0.08;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    aura.style.left = `${auraX}px`;
    aura.style.top = `${auraY}px`;

    requestAnimationFrame(renderCursorGlow);
  }
  renderCursorGlow();

  const interactiveEls = document.querySelectorAll('a, button, .glass-card, .swatch-dot, input, textarea');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   3. Rotating Headline & Shatter Explosion Transition
   ========================================================================== */
const phrases = [
  'FULL STACK DEVELOPER',
  'AI SECURITY ENGINE',
  'ORIGIN HACKATHON WINNER',
  'MERN & SUPABASE ARCHITECT'
];

let currentPhraseIndex = 0;
let autoCycleTimer = null;
let isAudioEnabled = false;

function initRotatingHeadline() {
  const headline = document.getElementById('rotating-headline');
  const prevBtn = document.getElementById('prev-phrase-btn');
  const nextBtn = document.getElementById('next-phrase-btn');

  if (!headline) return;

  function updatePhrase(index, direction = 1) {
    triggerShatterTransition();
    if (isAudioEnabled) playSynthClick();

    headline.style.opacity = '0';
    setTimeout(() => {
      currentPhraseIndex = (index + phrases.length) % phrases.length;
      headline.textContent = phrases[currentPhraseIndex];
      headline.style.opacity = '1';
    }, 150);

    if (direction > 0) {
      nextBtn.classList.add('active');
      prevBtn.classList.remove('active');
    } else {
      prevBtn.classList.add('active');
      nextBtn.classList.remove('active');
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      resetAutoCycle();
      updatePhrase(currentPhraseIndex - 1, -1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      resetAutoCycle();
      updatePhrase(currentPhraseIndex + 1, 1);
    });
  }

  function startAutoCycle() {
    autoCycleTimer = setInterval(() => {
      updatePhrase(currentPhraseIndex + 1, 1);
    }, 4500);
  }

  function resetAutoCycle() {
    clearInterval(autoCycleTimer);
    startAutoCycle();
  }

  startAutoCycle();
}

/* ==========================================================================
   4. Printing Character Intro Animation
   ========================================================================== */
function initPrintingIntro() {
  const printEl = document.getElementById('printing-intro-text');
  if (!printEl) return;

  const introLines = [
    'FULL STACK DEVELOPER & B.TECH IT UNDERGRADUATE @ LICET',
    'EX-INTERN AT FLARENET COMPANY • CHENNAI, INDIA',
    'WINNER @ ORIGIN 24-HOUR HACKATHON (SIMATS ENGINEERING)',
    'BUILDING SCALABLE MERN & SUPABASE WEB ARCHITECTURES'
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let printSpeed = 60;

  function typePrint() {
    const currentLine = introLines[lineIndex];

    if (isDeleting) {
      printEl.textContent = currentLine.substring(0, charIndex - 1);
      charIndex--;
      printSpeed = 30;
    } else {
      printEl.textContent = currentLine.substring(0, charIndex + 1);
      charIndex++;
      printSpeed = 55;
    }

    if (!isDeleting && charIndex === currentLine.length) {
      isDeleting = true;
      printSpeed = 2200;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % introLines.length;
      printSpeed = 350;
    }

    setTimeout(typePrint, printSpeed);
  }

  typePrint();
}

/* ==========================================================================
   5. Shatter Particle Explosion Canvas
   ========================================================================== */
function triggerShatterTransition() {
  const canvas = document.getElementById('shatter-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width || 600;
  canvas.height = rect.height || 180;

  const fragments = [];
  const fragmentCount = 45;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-pink').trim() || '#ff007f';

  for (let i = 0; i < fragmentCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;

    fragments.push({
      x: centerX + (Math.random() - 0.5) * 180,
      y: centerY + (Math.random() - 0.5) * 35,
      w: Math.random() * 20 + 6,
      h: Math.random() * 10 + 4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.2,
      alpha: 1,
      color: Math.random() > 0.3 ? accentColor : '#0a0b0e'
    });
  }

  let duration = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fragments.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      f.rot += f.vRot;
      f.alpha -= 0.025;

      if (f.alpha > 0) {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.fillStyle = f.color;
        ctx.globalAlpha = Math.max(f.alpha, 0);
        ctx.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
        ctx.restore();
      }
    });

    duration++;
    if (duration < 40) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

/* ==========================================================================
   6. Glossy Floating 3D Object Side Render
   ========================================================================== */
function initCenterpiece3DVisual() {
  const canvas = document.getElementById('render-3d-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = 360);
  let height = (canvas.height = 360);

  let rotation = 0;
  let floatOffset = 0;

  function drawIridescentSphere() {
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2 + Math.sin(floatOffset) * 12;
    const radius = 115;

    const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.5);
    const accentPink = getComputedStyle(document.documentElement).getPropertyValue('--accent-pink').trim() || '#ff007f';
    glowGrad.addColorStop(0, accentPink + '44');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    const sphereGrad = ctx.createRadialGradient(
      centerX - radius * 0.35,
      centerY - radius * 0.35,
      radius * 0.1,
      centerX,
      centerY,
      radius
    );

    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.2, '#ffd6f5');
    sphereGrad.addColorStop(0.5, accentPink);
    sphereGrad.addColorStop(0.85, '#7928ca');
    sphereGrad.addColorStop(1, '#0e0b16');

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    const ringGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
    ringGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    ringGrad.addColorStop(0.5, 'rgba(255, 0, 127, 0.4)');
    ringGrad.addColorStop(1, 'transparent');

    ctx.strokeStyle = ringGrad;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.05, radius * 0.35, Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.35, centerY - radius * 0.35, radius * 0.18, 0, Math.PI * 2);
    ctx.fill();

    rotation += 0.015;
    floatOffset += 0.035;

    requestAnimationFrame(drawIridescentSphere);
  }

  drawIridescentSphere();
}

/* ==========================================================================
   7. Corner Utilities & Theme Swatches
   ========================================================================== */
function initCornerUtilities() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioLabel = document.getElementById('audio-label');
  const resetBtn = document.getElementById('reset-hero-btn');
  const swatches = document.querySelectorAll('.swatch-dot');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      isAudioEnabled = !isAudioEnabled;
      audioBtn.classList.toggle('on', isAudioEnabled);
      audioLabel.textContent = isAudioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
      if (isAudioEnabled) playSynthClick();
    });
  }

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const theme = swatch.dataset.theme;
      document.body.className = '';
      if (theme !== 'magenta') {
        document.body.classList.add(`theme-${theme}`);
      }
      triggerShatterTransition();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.body.className = '';
      swatches.forEach(s => s.classList.remove('active'));
      document.querySelector('.swatch-magenta').classList.add('active');
      currentPhraseIndex = 0;
      document.getElementById('rotating-headline').textContent = phrases[0];
      triggerShatterTransition();
    });
  }
}

function playSynthClick() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

/* ==========================================================================
   8. Card 3D Tilt Effect
   ========================================================================== */
function initCard3DTilt() {
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   9. Contact Form & Clipboard Copy
   ========================================================================== */
window.copyEmail = function () {
  navigator.clipboard.writeText('kumaresanbalamurugan184@gmail.com').then(() => {
    showToast('Email address copied to clipboard!');
  });
};

window.copyPhone = function () {
  navigator.clipboard.writeText('+918807278984').then(() => {
    showToast('Phone number copied to clipboard!');
  });
};

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    const mailtoUrl = `mailto:kumaresanbalamurugan184@gmail.com?subject=${encodeURIComponent(
      subject || `Contact from ${name}`
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    window.location.href = mailtoUrl;
    showToast(`Thanks ${name}! Opening mail client...`);
    form.reset();
  });
}

/* ==========================================================================
   10. Active Nav Link Observer
   ========================================================================== */
function initNavSpy() {
  const links = document.querySelectorAll('.bracket-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
