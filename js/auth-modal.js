export function initAuthModal() {
  const profileBtns = document.querySelectorAll('.header__btn[aria-label="User Profile"], .header__btn svg path[d*="20 21"]');
  const userBtn = profileBtns[0]?.closest('a') || document.querySelector('.header__actions a:first-child');

  if (!userBtn) return;

  // Разметка модалки по макету
  const modalHtml = `
    <div class="auth-backdrop" id="auth-modal" style="display: none;">
      <div class="auth-modal-window">
        <button type="button" class="auth-modal-close" id="auth-close-btn">&times;</button>
        <form class="auth-form" id="auth-form" novalidate>
          <div class="auth-field">
            <label>Email address <span class="req">*</span></label>
            <input type="email" id="auth-email" class="auth-input" placeholder="example@mail.com" required>
            <span class="auth-error-msg" id="auth-email-error"></span>
          </div>

          <div class="auth-field auth-field--pass">
            <label>Password <span class="req">*</span></label>
            <div class="auth-input-wrap">
              <input type="password" id="auth-password" class="auth-input" required>
              <button type="button" class="auth-eye-btn" id="auth-toggle-pass" aria-label="Toggle password visibility">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <span class="auth-error-msg" id="auth-pass-error"></span>
          </div>

          <div class="auth-options">
            <label class="auth-remember">
              <input type="checkbox" id="auth-remember">
              <span>Remember me</span>
            </label>
            <a href="#" class="auth-forgot">Forgot Your Password?</a>
          </div>

          <button type="submit" class="auth-btn-submit">LOG IN</button>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Стили модалки в точности по макету
  const style = document.createElement('style');
  style.textContent = `
    .auth-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.55);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;
    }
    .auth-modal-window {
      background: #ffffff; padding: 44px 40px; width: 100%; max-width: 480px;
      border-radius: 4px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .auth-modal-close {
      position: absolute; top: 12px; right: 16px; background: none; border: none;
      font-size: 26px; cursor: pointer; color: #888;
    }
    .auth-field { margin-bottom: 22px; }
    .auth-field label { display: block; font-size: 0.95rem; font-weight: 600; color: #111; margin-bottom: 8px; }
    .auth-field .req { color: #B92770; }
    .auth-input-wrap { position: relative; display: flex; align-items: center; }
    .auth-input {
      width: 100%; height: 46px; border: 1px solid #d45d8b; border-radius: 2px;
      padding: 0 14px; font-size: 0.95rem; outline: none; transition: border-color 0.2s;
    }
    .auth-input:focus { border-color: #B92770; }
    .auth-eye-btn {
      position: absolute; right: 12px; background: none; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .auth-error-msg { font-size: 0.78rem; color: #e53935; display: block; margin-top: 4px; min-height: 16px; }
    .auth-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 26px; font-size: 0.88rem; }
    .auth-remember { display: flex; align-items: center; gap: 8px; color: #555; cursor: pointer; }
    .auth-remember input { width: 16px; height: 16px; }
    .auth-forgot { color: #B92770; text-decoration: none; font-weight: 600; }
    .auth-btn-submit {
      width: 100%; height: 48px; background: #B92770; color: #fff; border: none;
      font-size: 0.95rem; font-weight: 800; letter-spacing: 0.05em; cursor: pointer; border-radius: 2px;
    }
    .auth-btn-submit:hover { background: #9c1b59; }
  `;
  document.head.appendChild(style);

  const modal = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('auth-close-btn');
  const form = document.getElementById('auth-form');
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');
  const togglePass = document.getElementById('auth-toggle-pass');
  const emailError = document.getElementById('auth-email-error');
  const passError = document.getElementById('auth-pass-error');

  // Открытие / Закрытие
  userBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Переключение видимости пароля глазиком
  togglePass.addEventListener('click', () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
  });

  // Валидация по RegEx и закрытие при успехе
  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    emailError.textContent = '';
    passError.textContent = '';

    if (!emailRegEx.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address';
      isValid = false;
    }

    if (!passInput.value.trim()) {
      passError.textContent = 'Password is required';
      isValid = false;
    }

    if (isValid) {
      alert('Logged in successfully!');
      modal.style.display = 'none';
      form.reset();
    }
  });
}