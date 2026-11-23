(function () {
  const adminSession = localStorage.getItem('movietix_adminSession');
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'admin-login.html') return;
  if (!adminSession) { alert('Admin access required. Please login.'); window.location.href = 'admin-login.html'; return; }
  document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(adminSession);
    const greeting = document.getElementById('adminGreeting');
    if (greeting) greeting.textContent = `Hi, ${session.name}`;
    const logoutLink = document.getElementById('adminLogoutLink');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault(); localStorage.removeItem('movietix_adminSession'); window.location.href = 'admin-login.html';
      });
    }
  });
})();