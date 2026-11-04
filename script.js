const SERVICES = [
  { id: 'uiux', label: 'Дизайн интерфейса', price: 150 },
  { id: 'frontend', label: 'Фронтенд-разработка', price: 200 },
  { id: 'seo', label: 'SEO-оптимизация', price: 80 },
  { id: 'content', label: 'Написание контента', price: 60 },
];

const priceById = Object.fromEntries(SERVICES.map(({ id, price }) => [id, price]));

const pagesInput = document.getElementById('pages');
const pagesValue = document.getElementById('pagesValue');
const urgencySelect = document.getElementById('urgency');
const totalEl = document.getElementById('total');
const servicesGrid = document.getElementById('servicesGrid');

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

let displayedValue = 0;
let frameId = null;

// Render service checkboxes from config
function renderServices() {
  servicesGrid.innerHTML = SERVICES.map(({ id, label, price }) => `
    <label class="checkbox">
      <input type="checkbox" data-service="${id}">
      <span>${label}</span>
      <span class="checkbox-price">$${price}</span>
    </label>
  `).join('');
}

// Compute total: (sum of services) × pages × urgency
function calculate() {
  const base = [...servicesGrid.querySelectorAll('input:checked')]
    .reduce((sum, input) => sum + priceById[input.dataset.service], 0);
  const pages = Number(pagesInput.value);
  const urgency = Number(urgencySelect.value);
  return base * pages * urgency;
}

// Animate counter from current displayed value to target
function animateTo(target, duration = 300) {
  if (frameId) cancelAnimationFrame(frameId);

  const from = displayedValue;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    displayedValue = from + (target - from) * eased;
    totalEl.textContent = currency.format(Math.round(displayedValue));

    if (progress < 1) {
      frameId = requestAnimationFrame(tick);
    } else {
      displayedValue = target;
      totalEl.textContent = currency.format(target);
      frameId = null;
    }
  };

  frameId = requestAnimationFrame(tick);
}

// Update total cost on input change
function update() {
  pagesValue.textContent = pagesInput.value;
  animateTo(calculate());
}

// Wire up events and init
function init() {
  renderServices();
  servicesGrid.addEventListener('change', update);
  pagesInput.addEventListener('input', update);
  urgencySelect.addEventListener('change', update);
  update();
}

init();