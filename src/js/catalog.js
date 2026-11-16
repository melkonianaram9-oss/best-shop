import { addToCart, updateCartBadge, initBurgerMenu } from './cart.js';

let allProducts = [];
let filteredProducts = [];

// Подхватывает как новые ID из верстки макета, так и старые
const gridContainer = 
  document.getElementById('catalog-products-container') || 
  document.getElementById('catalog-products-grid');

const countElement = 
  document.getElementById('products-count') || 
  document.querySelector('.catalog-toolbar__count');

const searchInput = 
  document.getElementById('catalog-search-input') || 
  document.getElementById('search-input');

const sortSelect = document.getElementById('sort-select');

// Генерация карточки чемодана по макету
function createProductCard(product) {
  const isSale = product.salesStatus ? `<span class="product-card__badge">Sale</span>` : '';

  return `
    <article class="product-card" data-id="${product.id}">
      ${isSale}
      <a href="/src/html/product-details.html?id=${product.id}" class="product-card__image-link">
        <img class="product-card__image" src="${product.imageUrl}" alt="${product.name}" onerror="this.src='https://placehold.co/400x300?text=Suitcase'">
      </a>
      <div class="product-card__body">
        <h3 class="product-card__title">
          <a href="/src/html/product-details.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-card__bottom">
          <span class="product-card__price">$${product.price}</span>
          <button class="product-card__btn js-add-to-cart" data-id="${product.id}">Add To Cart</button>
        </div>
      </div>
    </article>
  `;
}

// Отрисовка товаров
function renderProducts(products) {
  if (!gridContainer) return;

  if (products.length === 0) {
    gridContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #777777; padding: 40px 0;">No suitcases found.</p>`;
  } else {
    gridContainer.innerHTML = products.map(createProductCard).join('');
  }

  if (countElement) {
    countElement.innerHTML = `Showing 1-${products.length} Of ${allProducts.length} Results`;
  }
}

// Фильтрация и сортировка
function applyFiltersAndSort() {
  const query = searchInput?.value.trim().toLowerCase() || '';

  filteredProducts = allProducts.filter(item => {
    return item.name.toLowerCase().includes(query);
  });

  const sortBy = sortSelect?.value || 'default';
  switch (sortBy) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    default:
      break;
  }

  renderProducts(filteredProducts);
}

// Загрузка данных
async function initCatalog() {
  updateCartBadge();

  try {
    const res = await fetch('/src/assets/data.json');
    const json = await res.json();
    allProducts = json.data || [];
    applyFiltersAndSort();
  } catch (error) {
    console.error('Failed to load catalog data:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initCatalog();

  searchInput?.addEventListener('input', applyFiltersAndSort);
  sortSelect?.addEventListener('change', applyFiltersAndSort);

  // Добавление в корзину
  gridContainer?.addEventListener('click', (e) => {
    const button = e.target.closest('.js-add-to-cart');
    if (!button) return;

    const productId = button.dataset.id;
    addToCart(productId);

    const originalText = button.textContent;
    button.textContent = 'Added! ✓';
    button.style.backgroundColor = '#2e7d32';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
    }, 600);
  });
});