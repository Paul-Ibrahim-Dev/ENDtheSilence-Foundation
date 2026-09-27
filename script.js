// Shared navigation, scroll effects, counters, and email-form behavior.
const menuButton = document.querySelector('.menu');
const navigation = document.querySelector('.navlinks');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});
navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navigation.classList.remove('open'));
});

// Reveal sections, headings, and cards as they enter the viewport.
const revealItems = document.querySelectorAll(
  '.hero, .page-hero, main .section, .section h2, .section h3, .card'
);
revealItems.forEach((item, index) => {
  item.classList.add('reveal');
  if (item.classList.contains('card')) {
    item.style.setProperty('--reveal-delay', ((index % 4) * 70) + 'ms');
  }
});
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => revealObserver.observe(item));

// Reading progress for long pages.
const progressBar = document.querySelector('.scroll-progress__bar');
const updateProgress = () => {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = distance > 0 ? window.scrollY / distance : 0;
  if (progressBar) progressBar.style.transform = 'scaleX(' + progress + ')';
};
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// Animate real numeric impact figures when verified values are supplied.
// Existing dash placeholders remain unchanged until the foundation adds data-count.
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.count);
    if (!Number.isFinite(target)) return observer.unobserve(counter);
    const start = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(counter);
  });
}, { threshold: 0.6 });
counters.forEach((counter) => countObserver.observe(counter));

// Forms open a draft in the visitor's email app; they never send automatically.
document.querySelectorAll('form[data-mailto]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = [...new FormData(form)];
    const body = fields.map(([name, value]) => name + ': ' + value).join('\r\n');
    const subject = encodeURIComponent(form.dataset.subject || 'Website enquiry');
    window.location.href =
      'mailto:endthesilencefoundation@gmail.com?subject=' + subject +
      '&body=' + encodeURIComponent(body);
  });
});
