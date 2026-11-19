(() => {
  const body = document.body;
  const avatarImages = {
    light: {
      front: 'assets/images/optimized/avatar-light.jpg',
      back: 'https://i.pinimg.com/originals/bf/1f/9d/bf1f9d35aba6d574a74aaf7fae9798d7.gif'
    },
    dark: {
      front: 'assets/images/optimized/avatar-dark.jpg',
      back: 'https://upload-os-bbs.hoyolab.com/upload/2026/08/14/112138931/ed7bb8a8d9e31fdb633781e4a7904fab_2956014821842979295.gif'
    }
  };

  function readSavedTheme() {
    try {
      return window.localStorage.getItem('theme');
    } catch (error) {
      console.warn('Could not read the saved theme preference.', error);
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Could not save the theme preference.', error);
    }
  }

  function applyAvatarTheme(isDark) {
    const images = avatarImages[isDark ? 'dark' : 'light'];
    const front = document.getElementById('avatarFront');
    const back = document.getElementById('avatarBack');

    if (front) front.src = images.front;
    if (back) back.src = images.back;
  }

  function initializeBackgroundParticles() {
    const particles = document.querySelectorAll('.pixel-particles span');
    const randomBetween = (min, max) => Math.random() * (max - min) + min;
    const randomPixels = (min, max) => `${Math.round(randomBetween(min, max))}px`;

    particles.forEach(particle => {
      const duration = randomBetween(8, 15);
      const randomizePath = () => {
        particle.style.left = `${randomBetween(5, 95).toFixed(1)}%`;
        particle.style.top = `${randomBetween(5, 95).toFixed(1)}%`;
        particle.style.setProperty('--particle-size', `${5 + Math.floor(Math.random() * 3)}px`);
        particle.style.setProperty('--pixel-drift-x', randomPixels(-36, 36));
        particle.style.setProperty('--pixel-drift-y', randomPixels(-30, -12));

        for (let point = 1; point <= 5; point += 1) {
          particle.style.setProperty(`--firefly-x${point}`, randomPixels(-80, 80));
          particle.style.setProperty(`--firefly-y${point}`, randomPixels(-60, 60));
        }
      };

      particle.style.animationDuration = `${duration.toFixed(1)}s`;
      particle.style.animationDelay = `${(-Math.random() * duration).toFixed(1)}s`;
      randomizePath();
      particle.addEventListener('animationiteration', randomizePath);
    });
  }

  const savedTheme = readSavedTheme();
  if (savedTheme === 'dark') body.classList.add('dark');

  document.addEventListener('DOMContentLoaded', () => {
    initializeBackgroundParticles();
    if (savedTheme === 'dark') applyAvatarTheme(true);

    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      const nextIsDark = !body.classList.contains('dark');
      const applyTheme = () => {
        body.classList.toggle('dark', nextIsDark);
        saveTheme(nextIsDark ? 'dark' : 'light');
        applyAvatarTheme(nextIsDark);
      };
      const reducedMotion = typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const ripple = document.createElement('div');

      if (reducedMotion || typeof ripple.animate !== 'function') {
        applyTheme();
        return;
      }

      const rect = themeToggle.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      const maxX = Math.max(originX, window.innerWidth - originX);
      const maxY = Math.max(originY, window.innerHeight - originY);
      const maxDist = Math.sqrt(maxX * maxX + maxY * maxY) * 2;

      ripple.style.cssText = `
        position: fixed;
        left: ${originX}px;
        top: ${originY}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 99998;
        background: ${body.classList.contains('dark') ? '#eaf4ec' : '#13101f'};
      `;
      body.appendChild(ripple);

      ripple.animate([
        { width: '0px', height: '0px', opacity: 1 },
        { width: `${maxDist}px`, height: `${maxDist}px`, opacity: 1 }
      ], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' })
        .onfinish = () => {
          applyTheme();
          ripple.animate([
            { opacity: 1 },
            { opacity: 0 }
          ], { duration: 300, easing: 'ease', fill: 'forwards' })
            .onfinish = () => ripple.remove();
        };
    });
  });
})();
