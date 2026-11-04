const form = document.querySelector('#box-form');
const summary = document.querySelector('#summary-text');
const price = document.querySelector('#price-text');
const progress = form.querySelector('.selection-progress');
const progressCount = document.querySelector('#selection-progress-count');
const prices = {
  'Beauty Box': [20, 30, 40],
  'Letter Box': [20, 30, 40],
  'Anime Box': [25, 35, 45],
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
    `Cantidad: ${size}`,
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
    '.delivery, .payments h2, .payment-card, .closing h2',
  );
  for (const section of sections) {
    if (section.getBoundingClientRect().top >= window.innerHeight) observer.observe(section);
  }
}
