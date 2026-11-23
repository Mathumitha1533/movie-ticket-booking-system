document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  function getUsers() { const users = localStorage.getItem('movietix_users'); return users ? JSON.parse(users) : []; }
  function saveUsers(users) { localStorage.setItem('movietix_users', JSON.stringify(users)); }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const message = document.getElementById('loginMessage');

      if (!email || !password) { message.textContent = 'Please fill in all fields.'; message.className = 'form-message error'; return; }

      const users = getUsers();
      const user = users.find((u) => u.email === email);

      if (!user) { message.textContent = '❌ Email not registered. Please register first.'; message.className = 'form-message error'; return; }
      if (user.password !== password) { message.textContent = '❌ Incorrect password. Please try again.'; message.className = 'form-message error'; return; }

      localStorage.setItem('movietix_currentUser', JSON.stringify({ name: user.fullname, email: user.email }));
      message.textContent = `✅ Welcome back, ${user.fullname}! Redirecting...`;
      message.className = 'form-message success';

      setTimeout(() => { window.location.href = '../index.html'; }, 1200);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullname = document.getElementById('fullname').value.trim();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const phone = document.getElementById('phone').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const message = document.getElementById('registerMessage');

      if (!fullname || !email || !phone || !password || !confirmPassword) { message.textContent = 'Please fill in all fields.'; message.className = 'form-message error'; return; }
      if (!/^\d{10}$/.test(phone)) { message.textContent = 'Phone number must be exactly 10 digits.'; message.className = 'form-message error'; return; }
      if (password.length < 6) { message.textContent = 'Password must be at least 6 characters.'; message.className = 'form-message error'; return; }
      if (password !== confirmPassword) { message.textContent = 'Passwords do not match.'; message.className = 'form-message error'; return; }

      const users = getUsers();
      if (users.some((u) => u.email === email)) { message.textContent = '❌ This email is already registered. Please login.'; message.className = 'form-message error'; return; }

      users.push({ fullname, email, phone, password, joinedAt: new Date().toISOString() });
      saveUsers(users);

      message.textContent = '✅ Registration successful! Redirecting to login...';
      message.className = 'form-message success';
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    });
  }
});