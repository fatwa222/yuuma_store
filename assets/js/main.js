if (window.lucide) {
  lucide.createIcons();
}

const quickOrderForm = document.getElementById('quick-order-form');
const orderService = document.getElementById('order-service');
const orderQuantity = document.getElementById('order-quantity');
const orderUnit = document.getElementById('order-unit');
const orderPreview = document.getElementById('order-preview');

if (quickOrderForm && orderService && orderQuantity && orderUnit && orderPreview) {
  const updateOrderPreview = () => {
    const selectedOption = orderService.options[orderService.selectedIndex];
    const service = selectedOption.dataset.service || selectedOption.value;
    const quantity = Math.max(1, Number(orderQuantity.value) || 1);
    const unit = orderService.value === 'IF' ? 'IF' : 'x';

    orderQuantity.value = quantity;
    orderUnit.textContent = unit;
    orderPreview.textContent = `Yuuma, aku mau joki ${quantity} ${service} dong`;
  };

  orderService.addEventListener('change', updateOrderPreview);
  orderQuantity.addEventListener('input', updateOrderPreview);
  quickOrderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = orderPreview.textContent;
    window.open(`https://wa.me/6289674135489?text=${encodeURIComponent(message)}`, '_blank');
  });

  updateOrderPreview();
}

const loader = document.getElementById('page-loader');
const appShell = document.querySelector('.app-shell');

const initLoader = () => {
  const hideLoader = () => {
    document.body.classList.remove('is-loading');

    if (loader) {
      loader.classList.add('hidden');
      loader.style.setProperty('display', 'none', 'important');
      loader.style.setProperty('opacity', '0', 'important');
      loader.style.setProperty('visibility', 'hidden', 'important');
      if (appShell) {
        if (window.gsap) {
          gsap.killTweensOf(appShell);
        }
        appShell.getAnimations().forEach((animation) => animation.cancel());
        appShell.classList.add('is-ready');
        appShell.style.setProperty('display', 'block', 'important');
        appShell.style.setProperty('opacity', '1', 'important');
        appShell.style.setProperty('visibility', 'visible', 'important');
        appShell.style.setProperty('transform', 'translateY(0)', 'important');
      }
    } else if (appShell) {
      appShell.getAnimations().forEach((animation) => animation.cancel());
      appShell.classList.add('is-ready');
      appShell.style.setProperty('display', 'block', 'important');
      appShell.style.setProperty('opacity', '1', 'important');
      appShell.style.setProperty('visibility', 'visible', 'important');
      appShell.style.setProperty('transform', 'translateY(0)', 'important');
    }
  };

  if (document.readyState === 'complete') {
    window.setTimeout(hideLoader, 500);
  } else {
    window.addEventListener('load', () => window.setTimeout(hideLoader, 500));
  }
};

if (document.body) {
  document.body.classList.add('is-loading');
}

const canvas = document.getElementById('particle-canvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class EmberParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.color = Math.random() > 0.5 ? '#ffca28' : '#e67e22';
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= 0.003;
      if (this.y < -10 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 50; i++) {
    particles.push(new EmberParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const heroEls = document.querySelectorAll('.gsap-hero');
  if (heroEls.length) {
    gsap.from(heroEls, {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.15
    });
  }

  const topbar = document.querySelector('.topbar');
  if (topbar) {
    gsap.from(topbar, {
      y: -80,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out'
    });
  }

  const sectionTrigger = document.querySelector('.section');
  if (sectionTrigger) {
    gsap.from('.gsap-card', {
      scrollTrigger: {
        trigger: sectionTrigger,
        start: 'top 80%'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out'
    });
  }

  const cardEls = document.querySelectorAll('.gsap-card, .list-box, .contact-card, .feature-card, .service-card, .price-row, .page-hero');
  cardEls.forEach((card, index) => {
    gsap.set(card, { transformPerspective: 1000, transformStyle: 'preserve-3d' });

    if (card.tagName !== 'SECTION') {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotateY: px * 8,
          rotateX: -py * 8,
          y: -6,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('pointerleave', () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    }

    gsap.fromTo(card, {
      opacity: 0,
      y: 18,
      rotateX: -6
    }, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      delay: 0.12 + index * 0.06,
      ease: 'power3.out'
    });
  });
}

initLoader();