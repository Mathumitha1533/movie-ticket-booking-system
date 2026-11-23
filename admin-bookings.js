document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('bookingsTable'); const tableBody = document.getElementById('bookingsTableBody');
  const noBookings = document.getElementById('noBookings'); const searchInput = document.getElementById('bookingSearch');
  const statusFilter = document.getElementById('statusFilter');

  function getBookings() { return JSON.parse(localStorage.getItem('movietix_bookings')) || []; }
  function getShowDateTime(booking) {
    if (!booking.date) return null; const timeMatch = booking.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i); if (!timeMatch) return null;
    let hours = parseInt(timeMatch[1], 10); const minutes = parseInt(timeMatch[2], 10); const period = timeMatch[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12; if (period === 'AM' && hours === 12) hours = 0;
    return new Date(`${booking.date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
  }
  function computeStatus(booking) {
    if (booking.bookingStatus === 'Cancelled') return 'Cancelled';
    const showTime = getShowDateTime(booking); if (showTime && showTime < new Date()) return 'Completed'; return 'Confirmed';
  }
  function updateStats(bookings) {
    let confirmed = 0, completed = 0, cancelled = 0;
    bookings.forEach((b) => { const s = computeStatus(b); if (s === 'Confirmed') confirmed++; else if (s === 'Completed') completed++; else if (s === 'Cancelled') cancelled++; });
    document.getElementById('bkTotal').textContent = bookings.length; document.getElementById('bkConfirmed').textContent = confirmed;
    document.getElementById('bkCompleted').textContent = completed; document.getElementById('bkCancelled').textContent = cancelled;
  }

  function renderTable() {
    const allBookings = getBookings().sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
    updateStats(allBookings);
    const search = searchInput.value.trim().toLowerCase(); const filterStatus = statusFilter.value;
    const filtered = allBookings.filter((b) => {
      const status = computeStatus(b); const matchesStatus = !filterStatus || status === filterStatus;
      const searchStr = `${b.bookingId} ${b.userName || ''} ${b.userEmail || ''} ${b.movieTitle || ''}`.toLowerCase(); const matchesSearch = !search || searchStr.includes(search);
      return matchesStatus && matchesSearch;
    });
    tableBody.innerHTML = '';
    if (filtered.length === 0) { table.style.display = 'none'; noBookings.style.display = 'block'; return; }
    table.style.display = 'table'; noBookings.style.display = 'none';

    filtered.forEach((b) => {
      const status = computeStatus(b); let badgeClass = 'badge-green';
      if (status === 'Cancelled') badgeClass = 'badge-red'; else if (status === 'Completed') badgeClass = 'badge-blue';
      const showDate = b.dateDisplay || b.date || '—';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.bookingId}</strong></td><td><strong>${b.userName || 'Guest'}</strong><br><span style="font-size:0.75rem;color:#999;">${b.userEmail || ''}</span></td>
        <td>${b.movieTitle}</td><td style="font-size:0.8rem;">${showDate}<br><span style="color:#777;">${b.time} • ${b.screenName}</span></td>
        <td>${b.seats.join(', ')}</td><td><strong>₹${b.totalAmount}</strong></td><td><span class="badge ${badgeClass}">${status}</span></td>
        <td><div class="table-actions"><button class="icon-btn primary" data-action="view" data-id="${b.bookingId}">👁️ View</button>${status === 'Confirmed' ? `<button class="icon-btn danger" data-action="cancel" data-id="${b.bookingId}">✕ Cancel</button>` : ''}</div></td>
      `;
      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll('[data-action="view"]').forEach((btn) => { btn.addEventListener('click', () => { window.location.href = `admin-booking-view.html?id=${btn.dataset.id}`; }); });
    tableBody.querySelectorAll('[data-action="cancel"]').forEach((btn) => { btn.addEventListener('click', () => adminCancel(btn.dataset.id)); });
  }

  function adminCancel(bookingId) {
    const confirmed = confirm(`Cancel booking ${bookingId}?\n\nFull refund will be issued to the customer.`); if (!confirmed) return;
    const bookings = getBookings(); const index = bookings.findIndex((b) => b.bookingId === bookingId); if (index === -1) return;
    const booking = bookings[index]; const showKey = booking.showKey || [booking.movieId, booking.date, booking.theaterId, booking.screenId, booking.time].join('|');
    const bookedMap = JSON.parse(localStorage.getItem('movietix_bookedSeats')) || {};
    if (bookedMap[showKey]) { const remaining = bookedMap[showKey].filter((s) => !booking.seats.includes(s)); if (remaining.length === 0) delete bookedMap[showKey]; else bookedMap[showKey] = remaining; localStorage.setItem('movietix_bookedSeats', JSON.stringify(bookedMap)); }
    bookings[index].bookingStatus = 'Cancelled'; bookings[index].cancelledAt = new Date().toISOString(); bookings[index].cancelledBy = 'Admin'; bookings[index].refundAmount = bookings[index].totalAmount; bookings[index].refundPercent = 100;
    localStorage.setItem('movietix_bookings', JSON.stringify(bookings)); renderTable();
  }

  searchInput.addEventListener('input', renderTable); statusFilter.addEventListener('change', renderTable); renderTable();
});