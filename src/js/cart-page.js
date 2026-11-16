import { getCart, saveCart, updateCartBadge, initBurgerMenu } from './cart.js';


const itemsContainer = document.getElementById('cart-items-container');
const cartContent = document.getElementById('cart-content');
const emptyMessage = document.getElementById('cart-empty-message');
const totalItemsEl = document.getElementById('summary-items-count');
const totalPriceEl = document.getElementById('summary-total-price');

let catalogData = [];

// Рендер позиций
// Рендер позиций
function renderCart() {
  updateCartBadge();
  const cart = getCart();

  const layout = document.getElementById('cart-content') || document.querySelector('.cart-layout');
  const empty = document.getElementById('cart-empty-message') || document.querySelector('.cart-empty');

  if (cart.length === 0) {
    if (itemsContainer) itemsContainer.innerHTML = '';
    if (layout) layout.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }

  if (layout) layout.style.display = 'grid';
  if (empty) empty.style.display = 'none';

  let totalItemsCount = 0;
  let totalPrice = 0;

  itemsContainer.innerHTML = cart.map(item => {
    const product = catalogData.find(p => p.id === item.id);
    if (!product) return '';

    const itemTotal = product.price * item.quantity;
    totalItemsCount += item.quantity;
    totalPrice += itemTotal;

    return `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item__image" src="${product.imageUrl}" alt="${product.name}" onerror="this.src='https://placehold.co/100x100?text=Suitcase'">
        <div class="cart-item__info">
          <h3 class="cart-item__title">${product.name}</h3>
          <p class="cart-item__price">$${product.price} each</p>
        </div>
        <div class="cart-item__controls">
          <button type="button" class="cart-item__btn-qty js-qty-decrease" data-id="${item.id}">−</button>
          <span class="cart-item__qty">${item.quantity}</span>
          <button type="button" class="cart-item__btn-qty js-qty-increase" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item__total">$${itemTotal}</div>
        <button type="button" class="cart-item__btn-remove js-remove-item" data-id="${item.id}" aria-label="Remove item">✕</button>
      </div>
    `;
  }).join('');

  if (totalItemsEl) totalItemsEl.textContent = totalItemsCount;
  if (totalPriceEl) totalPriceEl.textContent = `$${totalPrice}`;
}

// Изменение количества
function updateQuantity(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart(cart);
  renderCart();
}

// Удаление товара
function removeItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
}

// Инициализация
async function init() {
  try {
    const res = await fetch('/src/assets/data.json');
    const json = await res.json();
    catalogData = json.data || [];
    renderCart();
  } catch (error) {
    console.error('Failed to load data for cart:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  init();

  itemsContainer?.addEventListener('click', (e) => {
    const increaseBtn = e.target.closest('.js-qty-increase');
    const decreaseBtn = e.target.closest('.js-qty-decrease');
    const removeBtn = e.target.closest('.js-remove-item');

    if (increaseBtn) {
      updateQuantity(increaseBtn.dataset.id, 1);
    } else if (decreaseBtn) {
      updateQuantity(decreaseBtn.dataset.id, -1);
    } else if (removeBtn) {
      removeItem(removeBtn.dataset.id);
    }
  });
});