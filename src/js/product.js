import { addToCart, updateCartBadge, initBurgerMenu } from './cart.js';

let currentProduct = null;

// Клик по превьюшкам галереи
function initGallery() {
  const mainImg = document.getElementById('main-product-img');
  const thumbs = document.querySelectorAll('.product-gallery__thumb');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const img = thumb.querySelector('img');
      if (img && mainImg) {
        mainImg.src = img.src;
      }
    });
  });
}

// Переключение табов DETAILS / REVIEWS / SHIPPING POLICY
function initTabs() {
  const tabs = document.querySelectorAll('.js-tab-btn');
  const panes = document.querySelectorAll('.product-tabs__pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(`tab-${tab.dataset.tab}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// Счетчик количества [ - 1 + ]
function initQuantity() {
  const minusBtn = document.querySelector('.js-qty-minus');
  const plusBtn = document.querySelector('.js-qty-plus');
  const qtyInput = document.querySelector('.js-qty-value');

  if (!qtyInput) return;

  minusBtn?.addEventListener('click', () => {
    let val = parseInt(qtyInput.value) || 1;
    if (val > 1) qtyInput.value = val - 1;
  });

  plusBtn?.addEventListener('click', () => {
    let val = parseInt(qtyInput.value) || 1;
    qtyInput.value = val + 1;
  });
}

// Загрузка чемодана по ID из адреса (?id=SU001)
async function loadProductData() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'SU001';

  try {
    const res = await fetch('/best-shop/src/assets/data.json');
    const json = await res.json();
    const products = json.data || [];
    currentProduct = products.find(p => p.id === id) || products[0];

    if (currentProduct) {
      const titleEl = document.getElementById('product-title');
      const priceEl = document.getElementById('product-price');
      const imgEl = document.getElementById('main-product-img');

      if (titleEl) titleEl.textContent = currentProduct.name;
      if (priceEl) priceEl.textContent = `$${currentProduct.price}`;
      if (imgEl && currentProduct.imageUrl) imgEl.src = currentProduct.imageUrl;

      // Отрисовка You May Also Like (4 товара)
      const related = products.filter(p => p.id !== currentProduct.id).slice(0, 4);
      const relatedContainer = document.getElementById('related-products-grid');
      if (relatedContainer) {
        relatedContainer.innerHTML = related.map(p => `
          <article class="product-card" data-id="${p.id}">
            ${p.salesStatus ? '<span class="product-card__badge">Sale</span>' : ''}
            <a href="/best-shop/src/html/product-details.html?id=${p.id}" class="product-card__image-link">
              <img class="product-card__image" src="${p.imageUrl}" alt="${p.name}">
            </a>
            <div class="product-card__body">
              <h3 class="product-card__title">
                <a href="/best-shop/src/html/product-details.html?id=${p.id}">${p.name}</a>
              </h3>
              <div class="product-card__bottom">
                <span class="product-card__price">$${p.price}</span>
                <button class="product-card__btn js-add-to-cart" data-id="${p.id}">Add To Cart</button>
              </div>
            </div>
          </article>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Failed to load product:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  updateCartBadge();
  initTabs();
  initQuantity();
  initGallery();
  loadProductData();

  // Добавление в корзину с учетом выбранного количества
  document.querySelector('.js-details-add-to-cart')?.addEventListener('click', () => {
    if (!currentProduct) return;
    const qtyInput = document.querySelector('.js-qty-value');
    const count = parseInt(qtyInput?.value) || 1;

    for (let i = 0; i < count; i++) {
      addToCart(currentProduct.id);
    }

    const btn = document.querySelector('.js-details-add-to-cart');
    btn.textContent = 'Added! ✓';
    btn.style.backgroundColor = '#2e7d32';
    setTimeout(() => {
      btn.textContent = 'Add To Cart';
      btn.style.backgroundColor = '';
    }, 600);
  });

  // Клик по товарам из блока You May Also Like
  document.getElementById('related-products-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-add-to-cart');
    if (!btn) return;
    addToCart(btn.dataset.id);
    btn.textContent = 'Added! ✓';
    btn.style.backgroundColor = '#2e7d32';
    setTimeout(() => {
      btn.textContent = 'Add To Cart';
      btn.style.backgroundColor = '';
    }, 600);
  });
});