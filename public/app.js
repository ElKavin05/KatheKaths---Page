const form = document.querySelector('#box-form');
const summary = document.querySelector('#summary-text');
const price = document.querySelector('#price-text');
const prices = {'Beauty Box': [20,30,40], 'Letter Box': [20,30,40], 'Anime Box': [25,35,45]};
function selection() { const data = new FormData(form); return {box: data.get('box'), size: data.get('size'), idea: (data.get('idea') || '').toString().trim()}; }
function update() { const {box,size} = selection(); summary.textContent = box && size ? `${box} · ${size}` : 'Selecciona una caja y cantidad'; const idx = ['10 productos','15 productos','20 productos'].indexOf(size); price.textContent = box && prices[box] && idx >= 0 ? `Precio de referencia: $${prices[box][idx]}. Sujeto a confirmación.` : 'El precio y disponibilidad se confirman al consultar.'; }
form.addEventListener('change', update);
form.addEventListener('submit', event => { event.preventDefault(); if (!form.reportValidity()) return; const {box,size,idea} = selection(); const lines = ['Hola, quisiera consultar sobre una caja de KatheKaths.', `Caja: ${box}`, `Cantidad: ${size}`]; if (idea) lines.push(`Mi idea: ${idea}`); window.location.href = `https://wa.me/50766344468?text=${encodeURIComponent(lines.join('\n'))}`; });
