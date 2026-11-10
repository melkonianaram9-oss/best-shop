import { addToCart, updateCartBadge } from './cart.js';
// Функция создания HTML-разметки одной карточки
function createProductCard(product) {
  const isSale = product.salesStatus ? `<span class="product-card__badge">Sale</span>` : '';

  return `
    <article class="product-card" data-id="${product.id}">
      ${isSale}
      <a href="html/product-details.html?id=${product.id}" class="product-card__image-link">
        <img class="product-card__image" src="${product.imageUrl}" alt="${product.name}" onerror="this.src='https://placehold.co/400x300?text=Suitcase'">
      </a>
      <div class="product-card__body">
        <div class="product-card__meta">
          <span>${product.category}</span>
          <span>★ ${product.rating}</span>
        </div>
        <h3 class="product-card__title">
          <a href="html/product-details.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-card__bottom">
          <span class="product-card__price">$${product.price}</span>
          <button class="product-card__btn js-add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

// Загрузка и рендер данных
async function loadProducts() {
  try {
    const response = await fetch('/src/assets/data.json');
    const result = await response.json();
    const products = result.data || [];

    const newArrivalsContainer = document.getElementById('new-arrivals-grid');
    const selectedContainer = document.getElementById('selected-products-grid');

    if (newArrivalsContainer) {
      const arrivals = products.filter(p => p.blocks ?. p.blocks.includes('New Products Arrival'));
      newArrivalsContainer.innerHTML = arrivals.map(createProductCard).join('');
    }

    if (selectedContainer) {
      const selected = products.filter(p => p.blocks ?.| p.blocks.includes('Selected Products'));
      selectedContainer.innerHTML = selected.map(createProductCard).join('');
    }
  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  loadProducts();
});
document.querySelector('.main-content')?.addEventListener('click', (e) => {
  const button = e.target.closest('.js-add-to-cart');
  if (!button) return;

  const productId = button.dataset.id;
  addToCart(productId);

  // Визуальный отклик на кнопке (на полсекунды)
  const originalText = button.textContent;
  button.textContent = 'Added! ✓';
  button.style.backgroundColor = '#2e7d32';

  setTimeout(() => {
    button.textContent = originalText;
    button.style.backgroundColor = '';
  }, 600);
});