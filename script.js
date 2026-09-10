/* ==========================================================================
   Kumaresan B — Portfolio JavaScript
   Interactive Engine: GSAP ScrollTrigger + Lenis Smooth Scroll +
   Spiderweb Particle Canvas + 3D Three.js Object + Glowing Cursor +
   Rotating Shatter Headline + Interactive Features
   ========================================================================== */

(function () {
  'use strict';

  // --- Global State ---
  let lenisInstance = null;
  let soundEnabled = false;
  let audioCtx = null;

  // --- Initialize on DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', () => {
    initLenisScroll();
    initGlowingCursor();
    initSpiderWebCanvas();
    initThreeJsHero();
    initHeadlineRotator();
    initTypewriterIntro();
    initGsapAnimations();
    initThemeSwitcher();
    initSoundEffects();
    initInteractiveUtilities();
    initContactForm();
    animateHeroName();
    initHamburgerMenu();
  });

  /* ==========================================================================
     1. Lenis Smooth Scrolling (Fluid 60+ FPS without stutter)
     ========================================================================== */
  function initLenisScroll() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis not found, falling back to native scroll.');
      return;
    }

    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Synchronize Lenis strictly with GSAP ticker (only ONE loop, prevents double RAF stutter)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Anchor smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenisInstance.scrollTo(targetEl, { offset: -74, duration: 1.2 });
        }
      });
    });
  }

  /* ==========================================================================
     2. Custom Glowing Cursor & Spotlight Aura
     ========================================================================== */
  function initGlowingCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const aura = document.getElementById('spotlight-aura') || document.querySelector('.cursor-spotlight-aura');

    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let auraX = mouseX;
    let auraY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    }, { passive: true });

    // Smooth trailing ring & aura
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      if (aura) {
        auraX += (mouseX - auraX) * 0.08;
        auraY += (mouseY - auraY) * 0.08;
        aura.style.left = `${auraX}px`;
        aura.style.top = `${auraY}px`;
      }

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Hover effect on interactive elements
    const interactables = document.querySelectorAll(
      'a, button, input, textarea, .glass-card, .swatch-dot, .phrase-dot, .stat-card'
    );
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        playBeep(800, 0.03, 'sine', 0.04);
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  /* ==========================================================================
     3. Spider-Web Interactive Canvas Background
     ========================================================================== */
  function initSpiderWebCanvas() {
    const canvas = document.getElementById('spiderweb-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, radius: 130 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createNodes();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    const NODE_COUNT = Math.min(Math.floor((width * height) / 16000), 65);
    let nodes = [];

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.8 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse reaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 81, 26, 0.45)';
        ctx.fill();
      }
    }

    function createNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push(new Node());
      }
    }
    createNodes();

    function animateWeb() {
      ctx.clearRect(0, 0, width, height);

      // Node connections
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(100, 95, 85, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Mouse connection strands
        const mdx = nodes[i].x - mouse.x;
        const mdy = nodes[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          const mAlpha = (1 - mdist / mouse.radius) * 0.55;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(200, 81, 26, ${mAlpha})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(animateWeb);
    }
    requestAnimationFrame(animateWeb);
  }

  /* ==========================================================================
     4. Three.js 3D Hero Sculpture
     ========================================================================== */
  function initThreeJsHero() {
    const canvas = document.getElementById('render-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.z = 4.2;

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(380, 420);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Torus Knot geometry with physical sheen
      const geometry = new THREE.TorusKnotGeometry(1.05, 0.32, 100, 24);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xC8511A,
        emissive: 0x3a1800,
        roughness: 0.18,
        metalness: 0.85,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Outer Wireframe Cage
      const wireGeo = new THREE.IcosahedronGeometry(1.85, 2);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x1a1a18,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const cage = new THREE.Mesh(wireGeo, wireMat);
      scene.add(cage);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0xC8511A, 3.5, 40);
      pointLight1.position.set(4, 3, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xB8420F, 3.0, 40);
      pointLight2.position.set(-4, -3, 3);
      scene.add(pointLight2);

      let targetRotX = 0;
      let targetRotY = 0;

      window.addEventListener('mousemove', (e) => {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRotX = normY * 0.4;
        targetRotY = normX * 0.4;
      }, { passive: true });

      function render3D() {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.008;

        cage.rotation.x -= 0.002;
        cage.rotation.y -= 0.0025;

        mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.05;
        mesh.rotation.y += (targetRotY - mesh.rotation.y) * 0.05;

        renderer.render(scene, camera);
        requestAnimationFrame(render3D);
      }
      requestAnimationFrame(render3D);
    } catch (err) {
      console.warn('3D WebGL render initialized with fallback:', err);
    }
  }

  /* ==========================================================================
     5. Massive Headline Rotator + Shatter Effect
     ========================================================================== */
  function initHeadlineRotator() {
    const headlineEl = document.getElementById('rotating-headline');
    const prevBtn = document.getElementById('prev-phrase-btn') || document.getElementById('headline-prev-btn');
    const nextBtn = document.getElementById('next-phrase-btn') || document.getElementById('headline-next-btn');
    const dots = document.querySelectorAll('.phrase-dot');
    const shatterCanvas = document.getElementById('shatter-canvas');

    if (!headlineEl) return;

    const phrases = [
      'AI & FULL-STACK DEVELOPER',
      'LLM & DEEP LEARNING SPECIALIST',
      'HACKATHON WINNER · ORIGIN SIMATS',
      'SCALABLE ARCHITECTURE BUILDER',
    ];

    let currentIndex = 0;
    let autoInterval = null;

    function updateDots(idx) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
      });
    }

    function triggerShatterEffect() {
      if (!shatterCanvas) return;
      const ctx = shatterCanvas.getContext('2d');
      shatterCanvas.width = headlineEl.offsetWidth || 400;
      shatterCanvas.height = headlineEl.offsetHeight || 100;

      const particles = [];
      const pCount = 28;
      for (let i = 0; i < pCount; i++) {
        particles.push({
          x: Math.random() * shatterCanvas.width,
          y: Math.random() * shatterCanvas.height,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          size: Math.random() * 2.5 + 1,
          alpha: 1,
          color: Math.random() > 0.5 ? '#C8511A' : '#1a1a18',
        });
      }

      function renderShatter() {
        ctx.clearRect(0, 0, shatterCanvas.width, shatterCanvas.height);
        let alive = false;
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.04;
          if (p.alpha > 0) {
            alive = true;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        if (alive) requestAnimationFrame(renderShatter);
        else ctx.clearRect(0, 0, shatterCanvas.width, shatterCanvas.height);
      }
      renderShatter();
    }

    function setPhrase(index) {
      triggerShatterEffect();
      headlineEl.style.opacity = '0';
      playBeep(520, 0.03, 'triangle', 0.06);

      setTimeout(() => {
        headlineEl.textContent = phrases[index];
        headlineEl.style.opacity = '1';
        updateDots(index);
      }, 140);
    }

    function nextPhrase() {
      currentIndex = (currentIndex + 1) % phrases.length;
      setPhrase(currentIndex);
    }

    function prevPhrase() {
      currentIndex = (currentIndex - 1 + phrases.length) % phrases.length;
      setPhrase(currentIndex);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextPhrase();
        resetTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevPhrase();
        resetTimer();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        currentIndex = idx;
        setPhrase(currentIndex);
        resetTimer();
      });
    });

    function startTimer() {
      autoInterval = setInterval(nextPhrase, 4200);
    }

    function resetTimer() {
      clearInterval(autoInterval);
      startTimer();
    }

    startTimer();
  }

  /* ==========================================================================
     6. Printing / Typewriter Effect
     ========================================================================== */
  function initTypewriterIntro() {
    const textEl = document.getElementById('print-text');
    if (!textEl) return;

    const messages = [
      'B.Tech IT Undergrad · Panimalar Engineering College',
      'Passionate about Deep Learning & Scalable Architectures',
      'SIH 2024 Winner · Crafting intelligent web experiences',
    ];

    let msgIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentMsg = messages[msgIdx];

      if (isDeleting) {
        textEl.textContent = currentMsg.substring(0, charIdx - 1);
        charIdx--;
      } else {
        textEl.textContent = currentMsg.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 28 : 55;

      if (!isDeleting && charIdx === currentMsg.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        msgIdx = (msgIdx + 1) % messages.length;
        speed = 400;
      }

      setTimeout(typeLoop, speed);
    }

    setTimeout(typeLoop, 500);
  }

  /* ==========================================================================
     7. GSAP ScrollTrigger Animations & Reveal
     ========================================================================== */
  function initGsapAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const fadeElements = document.querySelectorAll('[data-gsap="fade-up"]');
    fadeElements.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    // Refresh ScrollTrigger once DOM layout stabilizes
    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 200);

    // Nav blur background transition on scroll
    const nav = document.querySelector('.editorial-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }, { passive: true });
    }
  }

  /* ==========================================================================
     8. Theme Swatches
     ========================================================================== */
  function initThemeSwitcher() {
    const swatches = document.querySelectorAll('.swatch-dot');
    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const theme = swatch.getAttribute('data-theme');
        document.body.className = '';
        if (theme !== 'magenta') {
          document.body.classList.add(`theme-${theme}`);
        }

        swatches.forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');

        showToast(`Theme: ${theme.toUpperCase()}`);
        playBeep(640, 0.04, 'sine', 0.08);
      });
    });
  }

  /* ==========================================================================
     9. Audio Synthesis & Micro-Interactions
     ========================================================================== */
  function initSoundEffects() {
    const soundBtn = document.getElementById('sound-toggle-btn') || document.getElementById('audio-toggle-btn');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.classList.toggle('enabled', soundEnabled);
      const label = soundBtn.querySelector('.audio-label') || document.getElementById('audio-label');
      if (label) label.textContent = soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';

      if (soundEnabled && !audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (soundEnabled) {
        playBeep(880, 0.06, 'sine', 0.12);
        showToast('UI Sound Effects: ON');
      } else {
        showToast('UI Sound Effects: OFF');
      }
    });
  }

  function playBeep(freq = 440, duration = 0.04, type = 'sine', vol = 0.04) {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio handled silently
    }
  }

  /* ==========================================================================
     10. Interactive Utilities (Copy buttons, Toasts, Reset)
     ========================================================================== */
  function initInteractiveUtilities() {
    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy');
        if (text) {
          navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied: ${text}`);
            playBeep(900, 0.05, 'sine', 0.08);
          });
        }
      });
    });

    // Reset button
    const resetBtn = document.getElementById('reset-hero-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (lenisInstance) {
          lenisInstance.scrollTo(0, { duration: 1 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        showToast('Reset view to Top');
        playBeep(600, 0.05, 'sine', 0.08);
      });
    }
  }

  function showToast(msg) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }

  /* ==========================================================================
     11. Contact Form Handler
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const message = document.getElementById('cf-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all fields.');
        return;
      }

      const mailtoUrl = `mailto:kumaresanbalamurugan184@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(
        name
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;

      window.location.href = mailtoUrl;
      showToast('Opening your email client...');
      form.reset();
    });
  }
  /* ==========================================================================
     12. Animated Hero Name Letters
     ========================================================================== */
  function animateHeroName() {
    const nameEl = document.getElementById('hero-name');
    if (!nameEl) return;

    const text = nameEl.textContent || '';
    nameEl.textContent = '';

    // Split into individual letter spans
    const letters = Array.from(text);
    letters.forEach((char, i) => {
      const span = document.createElement('span');
      span.classList.add('hero-name-letter');
      span.textContent = char === ' ' ? '\u00A0' : char;

      // Each letter gets a unique float animation with staggered offset
      // Use CSS custom properties for the unique delay & duration
      const delay = (i * 0.18).toFixed(2);
      const dur   = (2.8 + (i % 4) * 0.55).toFixed(2);
      const amplitude = 8 + (i % 3) * 5; // px variance
      const rotate = ((i % 2 === 0) ? -1 : 1) * (1.5 + (i % 3));

      span.style.setProperty('--letter-i', i);
      span.style.animationName        = 'name-letter-float';
      span.style.animationDuration    = `${dur}s`;
      span.style.animationDelay       = `${delay}s`;
      span.style.animationTimingFunction = 'ease-in-out';
      span.style.animationIterationCount = 'infinite';
      span.style.animationFillMode    = 'both';

      // Override animation keyframes per letter with inline style
      // We'll use a dynamic keyframe injection trick
      const keyframeName = `nlf${i}`;
      if (!document.getElementById(`kf-${keyframeName}`)) {
        const style = document.createElement('style');
        style.id = `kf-${keyframeName}`;
        style.textContent = `
          @keyframes ${keyframeName} {
            0%,100% { transform: translateY(0px) rotate(0deg); }
            30%      { transform: translateY(-${amplitude}px) rotate(${rotate}deg); }
            60%      { transform: translateY(${Math.round(amplitude * 0.5)}px) rotate(${-rotate * 0.6}deg); }
          }
        `;
        document.head.appendChild(style);
      }
      span.style.animationName = keyframeName;

      nameEl.appendChild(span);
    });

    // Add hover interaction — pause all, highlight hovered
    nameEl.querySelectorAll('.hero-name-letter').forEach((span) => {
      span.addEventListener('mouseenter', () => {
        nameEl.querySelectorAll('.hero-name-letter').forEach(s => {
          s.style.animationPlayState = 'paused';
        });
        span.style.animationPlayState = 'running';
      });
      span.addEventListener('mouseleave', () => {
        nameEl.querySelectorAll('.hero-name-letter').forEach(s => {
          s.style.animationPlayState = 'running';
        });
      });
    });
  }


  // ============================================================
  // Hamburger Mobile Menu
  // ============================================================
  function initHamburgerMenu() {
    const btn     = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('mobile-nav-overlay');
    const links   = overlay ? overlay.querySelectorAll('.mobile-nav-link') : [];
    if (!btn || !overlay) return;

    function openMenu() {
      btn.classList.add('open');
      overlay.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      btn.classList.remove('open');
      overlay.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
      overlay.classList.contains('open') ? closeMenu() : openMenu();
    });

    links.forEach(link => link.addEventListener('click', closeMenu));

    // Close on resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

})();

