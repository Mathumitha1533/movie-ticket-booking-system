document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const logoutLink = document.getElementById('logoutLink');
  const userGreeting = document.getElementById('userGreeting');

  if (!loginLink) return;

  const inPages = window.location.pathname.includes('/pages/');
  const homeHref = inPages ? '../index.html' : 'index.html';
  const myBookingsHref = inPages ? 'booking-history.html' : 'pages/booking-history.html';
  const myProfileHref = inPages ? 'profile.html' : 'pages/profile.html';

  const tt = (key, fallback) => {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key);
    }
    return fallback;
  };

  // Tag navigation links for translation
  nav.querySelectorAll('a').forEach((a) => {
    const text = a.textContent.trim();
    if (a.id === 'logoutLink' || text === 'Logout') {
      a.setAttribute('data-i18n', 'common.logout');
    } else if (a.href.includes('index.html') && (text === 'Home' || text === '')) {
      a.setAttribute('data-i18n', 'common.home');
    } else if (a.href.includes('movies.html') && text === 'Movies') {
      a.setAttribute('data-i18n', 'common.movies');
    } else if (a.href.includes('login.html') && text === 'Login') {
      a.setAttribute('data-i18n', 'common.login');
    } else if (a.href.includes('register.html') && text === 'Register') {
      a.setAttribute('data-i18n', 'common.register');
    }
  });

  // Initial translation check
  if (window.i18n && typeof window.i18n.apply === 'function') {
    window.i18n.apply();
  }

  // Handle logged-in user state
  const currentUser = JSON.parse(localStorage.getItem('movietix_currentUser'));

  if (currentUser) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline';
    if (userGreeting) userGreeting.textContent = `Hi, ${currentUser.name}`;

    // Inject My Bookings Link
    if (!document.getElementById('myBookingsLink')) {
      const myBookingsLink = document.createElement('a');
      myBookingsLink.href = myBookingsHref;
      myBookingsLink.id = 'myBookingsLink';
      myBookingsLink.setAttribute('data-i18n', 'common.myBookings');
      myBookingsLink.textContent = tt('common.myBookings', 'My Bookings');
      
      if (logoutLink) nav.insertBefore(myBookingsLink, logoutLink);
      else nav.appendChild(myBookingsLink);
    }

    // Inject My Profile Link
    if (!document.getElementById('myProfileLink')) {
      const myProfileLink = document.createElement('a');
      myProfileLink.href = myProfileHref;
      myProfileLink.id = 'myProfileLink';
      myProfileLink.setAttribute('data-i18n', 'common.myProfile');
      myProfileLink.textContent = tt('common.myProfile', 'My Profile');
      
      if (logoutLink) nav.insertBefore(myProfileLink, logoutLink);
      else nav.appendChild(myProfileLink);
    }

    // Handle Logout
    if (logoutLink && !logoutLink.dataset.bound) {
      logoutLink.dataset.bound = 'true';
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('movietix_currentUser');
        window.location.href = homeHref;
      });
    }
  }

  // Language Switcher Injection
  if (!window.i18n) return;
  if (document.getElementById('langSwitcher')) return;

  const switcher = document.createElement('div');
  switcher.className = 'lang-switcher';
  switcher.id = 'langSwitcher';

  const currentLang = window.i18n.getLang();
  const currentShort = currentLang === 'en' ? 'EN' : currentLang === 'ta' ? 'த' : 'हि';

  switcher.innerHTML = `
    <button type="button" class="lang-current" id="langCurrentBtn" aria-label="Change language">
      <span class="lang-globe">🌐</span>
      <span class="lang-current-label">${currentShort}</span>
      <span class="lang-arrow">▾</span>
    </button>
    <div class="lang-menu" id="langMenu">
      ${window.i18n.languages.map((l) =>
        `<button type="button" class="lang-option ${l.code === currentLang ? 'active' : ''}" data-lang="${l.code}">
          <span class="lang-code">${l.short}</span>
          <span class="lang-name">${l.label}</span>
        </button>`
      ).join('')}
    </div>
  `;

  nav.appendChild(switcher);

  const currentBtn = document.getElementById('langCurrentBtn');

  if (currentBtn) {
    currentBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      switcher.classList.toggle('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (!switcher.contains(e.target)) switcher.classList.remove('open');
  });

  switcher.querySelectorAll('.lang-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      window.i18n.setLang(lang);
      switcher.classList.remove('open');
      
      if (window.showToast) {
        const labels = { en: 'Language: English', ta: 'மொழி: தமிழ்', hi: 'भाषा: हिन्दी' };
        window.showToast(labels[lang] || 'Language changed', 'success');
      }
    });
  });

  // Re-apply translations safely after injected links load
  setTimeout(() => {
    if (window.i18n && typeof window.i18n.apply === 'function') {
      window.i18n.apply();
    }
  }, 200);
});