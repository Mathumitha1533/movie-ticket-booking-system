document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('usersTable'); const tableBody = document.getElementById('usersTableBody');
  const noUsers = document.getElementById('noUsers'); const searchInput = document.getElementById('userSearch');
  const modal = document.getElementById('userModal'); const modalContent = document.getElementById('userModalContent'); const modalClose = document.getElementById('userModalClose');

  function getUsers() { return JSON.parse(localStorage.getItem('movietix_users')) || []; }
  function getBookings() { return JSON.parse(localStorage.getItem('movietix_bookings')) || []; }

  function getUserStats(email) {
    const bookings = getBookings().filter((b) => b.userEmail === email); const active = bookings.filter((b) => b.bookingStatus !== 'Cancelled');
    const totalSpent = active.reduce((sum, b) => sum + b.totalAmount, 0); const tickets = active.reduce((sum, b) => sum + b.seats.length, 0);
    return { totalBookings: bookings.length, activeBookings: active.length, cancelledBookings: bookings.length - active.length, totalSpent, tickets };
  }

  function updateStats(users) {
    const bookings = getBookings(); const today = new Date().toISOString().split('T')[0];
    const usersWithBookings = users.filter((u) => bookings.some((b) => b.userEmail === u.email)).length;
    const todayUsers = users.filter((u) => { if (!u.joinedAt) return false; return u.joinedAt.split('T')[0] === today; }).length;
    const totalSpentAll = bookings.filter((b) => b.bookingStatus !== 'Cancelled').reduce((sum, b) => sum + b.totalAmount, 0);
    const avgSpend = users.length > 0 ? Math.round(totalSpentAll / users.length) : 0;
    document.getElementById('usrTotal').textContent = users.length; document.getElementById('usrToday').textContent = todayUsers;
    document.getElementById('usrWithBookings').textContent = usersWithBookings; document.getElementById('usrAvgSpend').textContent = `₹${avgSpend}`;
  }

  function renderTable() {
    const users = getUsers().sort((a, b) => { const da = a.joinedAt ? new Date(a.joinedAt) : 0; const db = b.joinedAt ? new Date(b.joinedAt) : 0; return db - da; });
    updateStats(users);
    const search = searchInput.value.trim().toLowerCase();
    const filtered = users.filter((u) => !search || `${u.fullname} ${u.email} ${u.phone || ''}`.toLowerCase().includes(search));
    tableBody.innerHTML = '';
    if (filtered.length === 0) { table.style.display = 'none'; noUsers.style.display = 'block'; return; }
    table.style.display = 'table'; noUsers.style.display = 'none';

    filtered.forEach((user) => {
      const stats = getUserStats(user.email);
      const joined = user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
      const initials = (user.fullname || 'U').charAt(0).toUpperCase();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><div style="display:flex; align-items:center; gap:0.7rem;"><div class="table-poster" style="border-radius:50%; background:linear-gradient(135deg,#e94560,#c73650); color:white; font-weight:800;">${initials}</div><strong>${user.fullname}</strong></div></td>
        <td>${user.email}</td><td>${user.phone || '—'}</td><td>${joined}</td>
        <td><strong>${stats.totalBookings}</strong> (${stats.activeBookings} active)</td><td><strong>₹${stats.totalSpent}</strong></td>
        <td><div class="table-actions"><button class="icon-btn primary" data-action="view" data-email="${user.email}">👁️ View</button><button class="icon-btn danger" data-action="delete" data-email="${user.email}">🗑️ Delete</button></div></td>
      `;
      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll('[data-action="view"]').forEach((btn) => { btn.addEventListener('click', () => openUserModal(btn.dataset.email)); });
    tableBody.querySelectorAll('[data-action="delete"]').forEach((btn) => { btn.addEventListener('click', () => deleteUser(btn.dataset.email)); });
  }

  function openUserModal(email) {
    const user = getUsers().find((u) => u.email === email); if (!user) return;
    const stats = getUserStats(email); const bookings = getBookings().filter((b) => b.userEmail === email).sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
    const joined = user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
    const bookingsHTML = bookings.length === 0 ? '<p style="color:#999; text-align:center; padding:1rem;">No bookings yet.</p>' : bookings.slice(0, 5).map((b) => `<div style="display:flex; justify-content:space-between; padding:0.6rem 0; border-bottom:1px solid #f0f0f0; font-size:0.9rem;"><div><strong>${b.movieTitle}</strong><br><span style="font-size:0.75rem; color:#999;">${b.bookingId} • ${b.dateDisplay || b.date}</span></div><div style="text-align:right;"><strong style="color:#e94560;">₹${b.totalAmount}</strong><br><span style="font-size:0.7rem; color:${b.bookingStatus === 'Cancelled' ? '#c62828' : '#2e7d32'};">${b.bookingStatus || 'Confirmed'}</span></div></div>`).join('');

    modalContent.innerHTML = `
      <div style="text-align:center; margin-bottom:1.5rem;"><div style="width:70px; height:70px; border-radius:50%; background:linear-gradient(135deg,#e94560,#c73650); color:white; font-size:1.8rem; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 0.8rem;">${(user.fullname || 'U').charAt(0).toUpperCase()}</div><h2 style="margin:0 0 0.3rem; font-size:1.3rem; color:#1a1a2e;">${user.fullname}</h2><p style="color:#777; font-size:0.9rem; margin:0 0 0.2rem;">${user.email}</p><p style="color:#999; font-size:0.85rem; margin:0;">📱 ${user.phone || 'Not provided'}</p><p style="color:#999; font-size:0.8rem; margin:0.3rem 0 0;">Joined ${joined}</p></div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.7rem; margin-bottom:1.5rem; padding:1rem 0; border-top:1px solid #eee; border-bottom:1px solid #eee; text-align:center;"><div><div style="font-size:1.4rem; font-weight:800; color:#1a1a2e;">${stats.totalBookings}</div><div style="font-size:0.7rem; color:#999; text-transform:uppercase; font-weight:600;">Bookings</div></div><div><div style="font-size:1.4rem; font-weight:800; color:#1a1a2e;">${stats.tickets}</div><div style="font-size:0.7rem; color:#999; text-transform:uppercase; font-weight:600;">Tickets</div></div><div><div style="font-size:1.4rem; font-weight:800; color:#e94560;">₹${stats.totalSpent}</div><div style="font-size:0.7rem; color:#999; text-transform:uppercase; font-weight:600;">Spent</div></div></div>
      <h3 style="font-size:1rem; color:#1a1a2e; margin-bottom:0.5rem;">Recent Bookings</h3>${bookingsHTML}
    `;
    modal.style.display = 'flex';
  }

  function closeModal() { modal.style.display = 'none'; }
  modalClose.addEventListener('click', closeModal); modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  function deleteUser(email) {
    const user = getUsers().find((u) => u.email === email); if (!user) return;
    if (!confirm(`Delete user "${user.fullname}" (${email})?\n\nThis will NOT delete their bookings. Proceed?`)) return;
    const users = getUsers().filter((u) => u.email !== email); localStorage.setItem('movietix_users', JSON.stringify(users)); renderTable();
  }

  searchInput.addEventListener('input', renderTable); renderTable();
});