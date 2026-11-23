document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('movietix_currentUser'));
  if (!currentUser) { alert('Please login to view your profile.'); window.location.href = 'login.html'; return; }

  function getUsers() { return JSON.parse(localStorage.getItem('movietix_users')) || []; }
  function saveUsers(users) { localStorage.setItem('movietix_users', JSON.stringify(users)); }

  const users = getUsers();
  const user = users.find((u) => u.email === currentUser.email);
  if (!user) { alert('Account not found. Please login again.'); localStorage.removeItem('movietix_currentUser'); window.location.href = 'login.html'; return; }

  document.getElementById('userAvatar').textContent = (user.fullname || 'U').charAt(0).toUpperCase();
  document.getElementById('overviewName').textContent = user.fullname;
  document.getElementById('overviewEmail').textContent = user.email;
  const memberSince = user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently';
  document.getElementById('overviewSince').textContent = `Member since ${memberSince}`;
  document.getElementById('nameInput').value = user.fullname;
  document.getElementById('emailInput').value = user.email;
  document.getElementById('phoneInput').value = user.phone || '';

  const allBookings = JSON.parse(localStorage.getItem('movietix_bookings')) || [];
  const myBookings = allBookings.filter((b) => b.userEmail === user.email);
  document.getElementById('statBookings').textContent = myBookings.length;
  document.getElementById('statTickets').textContent = myBookings.reduce((sum, b) => sum + b.seats.length, 0);
  document.getElementById('statSpent').textContent = `₹${myBookings.reduce((sum, b) => sum + b.totalAmount, 0)}`;

  const personalInfoForm = document.getElementById('personalInfoForm');
  const personalMessage = document.getElementById('personalMessage');
  personalInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = document.getElementById('nameInput').value.trim();
    const newEmail = document.getElementById('emailInput').value.trim().toLowerCase();
    const newPhone = document.getElementById('phoneInput').value.trim();

    if (!newName || !newEmail || !newPhone) { personalMessage.textContent = 'Please fill in all fields.'; personalMessage.className = 'form-message error'; return; }
    if (!/^\d{10}$/.test(newPhone)) { personalMessage.textContent = 'Phone number must be exactly 10 digits.'; personalMessage.className = 'form-message error'; return; }
    if (users.some((u) => u.email === newEmail && u.email !== user.email)) { personalMessage.textContent = 'This email is already used by another account.'; personalMessage.className = 'form-message error'; return; }

    const oldEmail = user.email;
    user.fullname = newName; user.email = newEmail; user.phone = newPhone; saveUsers(users);
    localStorage.setItem('movietix_currentUser', JSON.stringify({ name: newName, email: newEmail }));

    if (oldEmail !== newEmail) {
      const updated = allBookings.map((b) => b.userEmail === oldEmail ? { ...b, userEmail: newEmail, userName: newName } : b);
      localStorage.setItem('movietix_bookings', JSON.stringify(updated));
    }

    document.getElementById('overviewName').textContent = newName;
    document.getElementById('overviewEmail').textContent = newEmail;
    document.getElementById('userAvatar').textContent = newName.charAt(0).toUpperCase();
    const greet = document.getElementById('userGreeting'); if (greet) greet.textContent = `Hi, ${newName}`;
    personalMessage.textContent = '✅ Profile updated successfully!'; personalMessage.className = 'form-message success';
    setTimeout(() => { personalMessage.textContent = ''; }, 3000);
  });

  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
  const passwordForm = document.getElementById('passwordForm');

  function openPasswordForm() { passwordForm.style.display = 'block'; togglePasswordBtn.textContent = '✕ Close'; setTimeout(() => { document.getElementById('currentPassword').focus(); }, 100); }
  function closePasswordForm() { passwordForm.style.display = 'none'; passwordForm.reset(); togglePasswordBtn.textContent = 'Change Password'; const msg = document.getElementById('passwordMessage'); if (msg) msg.textContent = ''; }

  togglePasswordBtn.addEventListener('click', () => { const isOpen = passwordForm.style.display === 'block'; if (isOpen) closePasswordForm(); else openPasswordForm(); });
  cancelPasswordBtn.addEventListener('click', closePasswordForm);

  const passwordMessage = document.getElementById('passwordMessage');
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (!currentPassword || !newPassword || !confirmNewPassword) { passwordMessage.textContent = 'Please fill in all fields.'; passwordMessage.className = 'form-message error'; return; }
    if (currentPassword !== user.password) { passwordMessage.textContent = 'Current password is incorrect.'; passwordMessage.className = 'form-message error'; return; }
    if (newPassword.length < 6) { passwordMessage.textContent = 'New password must be at least 6 characters.'; passwordMessage.className = 'form-message error'; return; }
    if (newPassword === currentPassword) { passwordMessage.textContent = 'New password must be different from the current one.'; passwordMessage.className = 'form-message error'; return; }
    if (newPassword !== confirmNewPassword) { passwordMessage.textContent = 'New passwords do not match.'; passwordMessage.className = 'form-message error'; return; }

    user.password = newPassword; saveUsers(users);
    passwordMessage.textContent = '✅ Password updated successfully!'; passwordMessage.className = 'form-message success';
    setTimeout(() => { closePasswordForm(); }, 1500);
  });
});