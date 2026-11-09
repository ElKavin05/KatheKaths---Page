const form = document.querySelector('#box-form');
const summary = document.querySelector('#summary-text');
const sizeHint = document.querySelector('#size-hint');
const price = document.querySelector('#price-text');
const progress = form.querySelector('.selection-progress');
const progressCount = document.querySelector('#selection-progress-count');
const prices = {
  'Beauty Box': [20, 30, 40],
  'Letter Box': [20, 30, 40],
  'Anime Box': [25, 35, 45],
  'Potter Box': [25],
};
const sizes = ['10 productos', '15 productos', '20 productos'];

function selection() {
  const data = new FormData(form);
  return {
    box: data.get('box'),
    size: data.get('size'),
    idea: (data.get('idea') || '').toString().trim(),
  };
}

function update() {
  const boxType = form.elements.box.value;
  const isPotterBox = boxType === 'Potter Box';
  for (const option of form.querySelectorAll('input[name="size"]')) {
    const unavailable = isPotterBox && option.value === '20 productos';
    if (unavailable) option.checked = false;
    option.disabled = unavailable;
    option.closest('label').hidden = unavailable;
  }
  let hint = 'Elige un tipo de caja para ver las opciones de cantidad.';
  if (isPotterBox) {
    hint = 'Para Potter Box, elige 10 o 15 productos, o selecciona «Más opciones».';
  } else if (boxType === 'Cajas mixtas') {
    hint = 'Para cajas mixtas, elige una cantidad o selecciona «Más opciones» para consultar.';
  } else if (boxType) {
    hint = `Para ${boxType}, elige 10, 15 o 20 productos, o selecciona «Más opciones».`;
  }
  if (sizeHint.textContent !== hint) sizeHint.textContent = hint;
  const { box, size } = selection();
  const count = Number(Boolean(box)) + Number(Boolean(size));
  progress.dataset.count = count;
  progressCount.textContent = `${count} de 2`;
  summary.textContent = [box, size].filter(Boolean).join(' · ') || 'Selecciona una caja y cantidad';

  const amount = prices[box]?.[sizes.indexOf(size)];
  price.textContent = amount
    ? `Precio de referencia: $${amount}. Sujeto a confirmación.`
    : 'El precio y disponibilidad se confirman al consultar.';
}

progress.hidden = false;
update();
form.addEventListener('change', update);
window.addEventListener('pageshow', update);

for (const link of document.querySelectorAll('[data-box]')) {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const box = Array.from(form.elements.box).find((option) => option.value === link.dataset.box);
    if (!box) return;
    box.checked = true;
    update();
    box.focus({ preventScroll: true });
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const { box, size, idea } = selection();
  const lines = [
    'Hola, quisiera consultar sobre una caja de KatheKaths.',
    `Caja: ${box}`,
    size === 'Más opciones' ? 'Quisiera conocer más opciones para esta caja.' : `Cantidad: ${size}`,
  ];
  if (idea) lines.push(`Mi idea: ${idea}`);
  window.location.href = `https://wa.me/50766344468?text=${encodeURIComponent(lines.join('\n'))}`;
});

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (!motionPreference.matches && !entry.target.matches(':focus-within')) {
        entry.target.classList.add('arrive');
      }
    }
  }, { threshold: 0.12 });

  const sections = document.querySelectorAll(
    '.collection .section-heading, .feature-card, .box-list article, ' +
    '.chooser-heading, .personal-inner, .how > div:first-child, .steps article, ' +
    '.delivery-content h3, .delivery-card, .payments h2, .payment-card, .reviews-heading, .review-track, .closing h2',
  );
  for (const section of sections) {
    if (section.getBoundingClientRect().top >= window.innerHeight) observer.observe(section);
  }
}

const reviewTrack = document.querySelector('#review-track');
const reviewControls = document.querySelector('.review-controls');
const reviewCards = Array.from(reviewTrack.querySelectorAll('.review-card'));
const previousReview = reviewControls.querySelector('[data-review-step="-1"]');
const nextReview = reviewControls.querySelector('[data-review-step="1"]');

function updateReviewControls() {
  previousReview.disabled = reviewTrack.scrollLeft <= 1;
  nextReview.disabled = reviewTrack.scrollLeft + reviewTrack.clientWidth >= reviewTrack.scrollWidth - 1;
}

reviewControls.hidden = false;
updateReviewControls();
reviewTrack.addEventListener('scroll', updateReviewControls, { passive: true });
window.addEventListener('resize', updateReviewControls);
reviewControls.addEventListener('click', (event) => {
  const button = event.target.closest('[data-review-step]');
  if (!button) return;
  const stride = reviewCards[1].offsetLeft - reviewCards[0].offsetLeft;
  reviewTrack.scrollBy({
    left: stride * Number(button.dataset.reviewStep),
    behavior: motionPreference.matches ? 'instant' : 'smooth',
  });
});

const reviewDialog = document.querySelector('.review-dialog');
const fullReview = reviewDialog.querySelector('.review-full');
reviewTrack.addEventListener('click', (event) => {
  const link = event.target.closest('.review-image');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (typeof reviewDialog.showModal !== 'function') return;

  event.preventDefault();
  fullReview.alt = link.querySelector('img').alt;
  fullReview.src = link.href;
  reviewDialog.showModal();
});
