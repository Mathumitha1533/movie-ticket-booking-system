document.addEventListener('DOMContentLoaded', () => {
  const ADMIN_EMAIL = 'admin@movietix.com';
  const ADMIN_PASSWORD = 'admin123';
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (!adminLoginForm) return;

  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim().toLowerCase();
    const password = document.getElementById('adminPassword').value;
    const message = document.getElementById('adminLoginMessage');

    if (!email || !password) { message.textContent = 'Please fill in all fields.'; message.className = 'form-message error'; return; }
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) { message.textContent = '❌ Invalid admin credentials. Access denied.'; message.className = 'form-message error'; return; }

    localStorage.setItem('movietix_adminSession', JSON.stringify({ email: ADMIN_EMAIL, name: 'Admin', loggedInAt: new Date().toISOString() }));
    message.textContent = '✅ Welcome, Admin! Redirecting to dashboard...'; message.className = 'form-message success';
    setTimeout(() => { window.location.href = 'admin-dashboard.html'; }, 1200);
  });
});