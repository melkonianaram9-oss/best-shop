import { addToCart, updateCartBadge, initBurgerMenu } from './cart.js';


function createProductCard(product) {
  const isSale = product.salesStatus ? `<span class="product-card__badge">Sale</span>` : '';

  return `
    <article class="product-card" data-id="${product.id}">
      ${isSale}
      <a href="/src/html/product-details.html?id=${product.id}" class="product-card__image-link">
        <img class="product-card__image" src="${product.imageUrl}" alt="${product.name}" onerror="this.src='https://placehold.co/400x300?text=Suitcase'">
      </a>
      <div class="product-card__body">
        <div class="product-card__meta">
          <span>${product.category || 'Suitcases'}</span>
          <span>★ ${product.rating}</span>
        </div>
        <h3 class="product-card__title">
          <a href="/src/html/product-details.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-card__bottom">
          <span class="product-card__price">$${product.price}</span>
          <button class="product-card__btn js-add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

async function loadHomeProducts() {
  updateCartBadge();

  try {
    const res = await fetch('/src/assets/data.json');
    const json = await res.json();
    const products = json.data || [];

    const newArrivals = document.getElementById('new-arrivals-grid');
    const selected = document.getElementById('selected-products-grid');

    if (newArrivals) {
     const arrivals = products.filter(p => p.blocks?.includes('New Products Arrival'));
      newArrivals.innerHTML = arrivals.map(createProductCard).join('');
    }

    if (selected) {
      const selectedList = products.filter(p => p.blocks?.includes('Selected Products'));
      selected.innerHTML = selectedList.map(createProductCard).join('');
    }
  } catch (err) {
    console.error('Error loading home products:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  loadHomeProducts();
  


  document.querySelector('.main-content')?.addEventListener('click', (e) => {
    const button = e.target.closest('.js-add-to-cart');
    if (!button) return;

    addToCart(button.dataset.id);

    const originalText = button.textContent;
    button.textContent = 'Added! ✓';
    button.style.backgroundColor = '#2e7d32';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
    }, 600);
  });
});


  