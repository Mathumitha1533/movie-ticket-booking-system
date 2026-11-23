(function () {
  function ensureToastContainer() {
    if (document.querySelector('.toast-container')) return;
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  window.showToast = function (message, type = 'info', duration = 3000) {
    ensureToastContainer();
    const container = document.querySelector('.toast-container');
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 300); }, duration);
  };
  function ensureScrollTopBtn() {
    if (document.querySelector('.scroll-top-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.body.appendChild(btn);
  }
  function initFadeUps() {
    const selectors = ['.genre-tile', '.featured-card', '.why-card', '.admin-stat-card', '.booking-card', '.movie-card', '.stat-item'];
    const elements = document.querySelectorAll(selectors.join(','));
    elements.forEach((el) => el.classList.add('fade-up'));
    if (!('IntersectionObserver' in window)) { elements.forEach((el) => el.classList.add('in-view')); return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    elements.forEach((el) => observer.observe(el));
  }
  window.toastSuccess = (msg) => window.showToast(msg, 'success');
  window.toastError = (msg) => window.showToast(msg, 'error');
  window.toastInfo = (msg) => window.showToast(msg, 'info');
  window.toastWarning = (msg) => window.showToast(msg, 'warning');
  document.addEventListener('DOMContentLoaded', () => {
    ensureToastContainer(); ensureScrollTopBtn(); initFadeUps();
    const refreshInterval = setInterval(initFadeUps, 1500);
    setTimeout(() => clearInterval(refreshInterval), 8000);
  });
  window.addEventListener('scroll', () => {
    const btn = document.querySelector('.scroll-top-btn');
    if (!btn) return;
    if (window.scrollY > 400) btn.classList.add('visible'); else btn.classList.remove('visible');
  });
})();