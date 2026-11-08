const CART_STORAGE_KEY = 'best_shop_cart';

// Начальные товары по макету, если в localStorage пусто
const DEFAULT_ITEMS = [
  {
    id: 'SU001',
    name: 'Nomad Haven',
    price: 250,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'SU002',
    name: 'WanderWay Kid',
    price: 690,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'SU003',
    name: 'Crossroads Elite',
    price: 1200,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80'
  }
];

export function getCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(DEFAULT_ITEMS));
    return DEFAULT_ITEMS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_ITEMS;
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badges = document.querySelectorAll('.header__cart-badge, .js-cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalCount;
  });
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => String(item.id).toLowerCase() === String(product.id).toLowerCase());
  if (existing) {
    existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
  } else {
    cart.push({
      id: product.id,
      name: product.name || 'Travel Suitcase',
      price: Number(product.price) || 250,
      quantity: product.quantity || 1,
      imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=150&q=80'
    });
  }
  saveCart(cart);
}

// Автообновление счетчика при загрузке любой страницы
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});