const galleryItems = document.querySelectorAll('.gallery-page .gallery-item');

if ('IntersectionObserver' in window) {
  const galleryObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  galleryItems.forEach(item => {
    const finishReveal = event => {
      if (event.target !== item || event.propertyName !== 'opacity') return;
      item.classList.add('reveal-complete');
      item.removeEventListener('transitionend', finishReveal);
    };
    item.addEventListener('transitionend', finishReveal);
    galleryObserver.observe(item);
  });
} else {
  galleryItems.forEach(item => {
    item.classList.add('visible');
    item.classList.add('reveal-complete');
  });
}
