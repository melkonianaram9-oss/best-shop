import { updateCartBadge } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  updateCartBadge();

  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('contact-success-msg');
  const submitBtn = document.getElementById('contact-submit-btn');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    setTimeout(() => {
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 4000);
      }
    }, 800);
  });
});