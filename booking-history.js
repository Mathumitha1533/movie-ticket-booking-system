document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('movietix_currentUser'));
  if (!currentUser) { alert('Please login to view your bookings.'); window.location.href = 'login.html'; return; }

  function getBookings() { return JSON.parse(localStorage.getItem('movietix_bookings')) || []; }
  function getBookedSeatsMap() { return JSON.parse(localStorage.getItem('movietix_bookedSeats')) || {}; }

  function releaseSeatsForBooking(booking) {
    const showKey = booking.showKey || [booking.movieId, booking.date, booking.theaterId, booking.screenId, booking.time].join('|');
    const map = getBookedSeatsMap();
    if (!map[showKey]) return;
    const remaining = map[showKey].filter((s) => !booking.seats.includes(s));
    if (remaining.length === 0) delete map[showKey]; else map[showKey] = remaining;
    localStorage.setItem('movietix_bookedSeats', JSON.stringify(map));
  }

  const allBookings = getBookings();
  const myBookings = allBookings.filter((b) => b.userEmail === currentUser.email).sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
  const statsBar = document.getElementById('statsBar');
  const bookingsList = document.getElementById('bookingsList');
  const emptyState = document.getElementById('emptyState');

  if (myBookings.length === 0) { bookingsList.style.display = 'none'; emptyState.style.display = 'block'; return; }
  statsBar.style.display = 'grid';

  const active = myBookings.filter((b) => b.bookingStatus !== 'Cancelled');
  const totalTickets = active.reduce((s, b) => s + b.seats.length, 0);
  const totalSpent = active.reduce((s, b) => s + b.totalAmount, 0);
  document.getElementById('totalBookings').textContent = myBookings.length;
  document.getElementById('totalTickets').textContent = totalTickets;
  document.getElementById('totalSpent').textContent = `₹${totalSpent}`;

  function getShowDateTime(b) {
    if (!b.date) return null;
    const m = b.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i); if (!m) return null;
    let h = parseInt(m[1], 10); const min = parseInt(m[2], 10); const p = m[3].toUpperCase();
    if (p === 'PM' && h !== 12) h += 12; if (p === 'AM' && h === 12) h = 0;
    return new Date(`${b.date}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`);
  }
  function isShowPast(b) { const t = getShowDateTime(b); return t && t < new Date(); }

  function calculateRefund(b) {
    const t = getShowDateTime(b);
    if (!t) return { percent: 0, amount: 0, eligible: false, reason: 'Invalid show time' };
    const hours = (t - new Date()) / 3600000;
    if (hours <= 0) return { percent: 0, amount: 0, eligible: false, reason: 'Show has already started' };
    let percent = hours >= 24 ? 100 : hours >= 2 ? 80 : 50;
    return { percent, amount: Math.round((b.totalAmount * percent) / 100), eligible: true, reason: `${percent}% refund available` };
  }

  const movies = (function () { const stored = localStorage.getItem('movietix_movies'); if (stored) { try { return JSON.parse(stored); } catch (e) {} } return window.MOVIES || []; })();

  function renderBookings() {
    bookingsList.innerHTML = '';
    const refreshed = getBookings().filter((b) => b.userEmail === currentUser.email).sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
    refreshed.forEach((booking) => {
      const movie = movies.find((m) => m.id === booking.movieId);
      const poster = movie && movie.posterUrl ? `<img src="${movie.posterUrl}" alt="" />` : (movie ? movie.poster : '🎬');
      const card = document.createElement('div'); card.className = 'booking-card';
      if (booking.bookingStatus === 'Cancelled') card.classList.add('cancelled');
      const showDate = booking.dateDisplay || booking.date || 'N/A';
      const past = isShowPast(booking); const cancelled = booking.bookingStatus === 'Cancelled'; const reviewed = booking.reviewed;

      let actionHTML = '';
      if (cancelled) {
        actionHTML = `<div class="action-buttons-inline"><span class="refund-info" data-i18n="history.refund">💸 Refund:</span> <span class="refund-info">₹${booking.refundAmount || 0} (${booking.refundPercent || 0}%)</span><a href="booking-confirmation.html?id=${booking.bookingId}" class="view-ticket-btn secondary" data-i18n="history.viewTicket">View Ticket</a></div>`;
      } else if (past && !reviewed) {
        actionHTML = `<div class="action-buttons-inline"><a href="booking-confirmation.html?id=${booking.bookingId}" class="view-ticket-btn secondary" data-i18n="history.viewTicket">View Ticket</a><a href="review.html?bookingId=${booking.bookingId}" class="rate-movie-btn" data-i18n="history.rateMovie">⭐ Rate Movie</a></div>`;
      } else if (past && reviewed) {
        actionHTML = `<div class="action-buttons-inline"><span class="reviewed-badge" data-i18n="history.reviewed">✅ Reviewed</span><a href="booking-confirmation.html?id=${booking.bookingId}" class="view-ticket-btn secondary" data-i18n="history.viewTicket">View Ticket</a></div>`;
      } else {
        actionHTML = `<div class="action-buttons-inline"><a href="booking-confirmation.html?id=${booking.bookingId}" class="view-ticket-btn secondary" data-i18n="history.viewTicket">View Ticket</a><button class="cancel-booking-btn" data-booking-id="${booking.bookingId}" data-i18n="history.cancel">✕ Cancel</button></div>`;
      }

      let statusText = booking.bookingStatus || 'Confirmed'; let statusClass = '';
      if (cancelled) { statusText = 'Cancelled'; statusClass = 'cancelled'; }
      else if (past) { statusText = 'Completed'; statusClass = 'past'; }

      card.innerHTML = `
        <div class="booking-poster">${poster}</div>
        <div class="booking-body">
          <div class="booking-top">
            <div><div class="booking-title">${booking.movieTitle}</div><div class="booking-id-label">ID: ${booking.bookingId}</div></div>
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>
          <div class="booking-info-row">
            <div class="info-chip">📅 <strong>${showDate}</strong></div><div class="info-chip">🕐 <strong>${booking.time}</strong></div>
            <div class="info-chip">🏢 <strong>${booking.theaterName}</strong></div><div class="info-chip">🎥 <strong>${booking.screenName}</strong></div>
          </div>
          <div class="booking-info-row"><div class="info-chip">💺 <span data-i18n="payment.seats">Seats:</span> <strong>${booking.seats.join(', ')}</strong></div></div>
          <div class="booking-bottom"><span class="booking-total">₹${booking.totalAmount}</span>${actionHTML}</div>
        </div>`;
      bookingsList.appendChild(card);
    });

    if (window.i18n) window.i18n.apply();
    document.querySelectorAll('.cancel-booking-btn').forEach((btn) => { btn.addEventListener('click', () => openCancelModal(btn.dataset.bookingId)); });
  }

  const modal = document.getElementById('cancelModal');
  const modalBody = document.getElementById('cancelModalBody');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  let pendingCancel = null;

  function openCancelModal(bookingId) {
    const bookings = getBookings(); const booking = bookings.find((b) => b.bookingId === bookingId); if (!booking) return;
    const refund = calculateRefund(booking);
    if (!refund.eligible) {
      modalBody.innerHTML = `<div class="modal-icon error-icon">⚠️</div><h3>Cannot Cancel</h3><p class="modal-text">${refund.reason}</p>`;
      modalConfirmBtn.style.display = 'none'; pendingCancel = null;
    } else {
      modalBody.innerHTML = `<div class="modal-icon">❓</div><h3>Cancel Booking?</h3><p class="modal-text">Are you sure you want to cancel this booking?</p><div class="refund-summary"><div class="refund-row"><span>Original Amount:</span><strong>₹${booking.totalAmount}</strong></div><div class="refund-row"><span>Refund Percentage:</span><strong>${refund.percent}%</strong></div><div class="refund-row highlight"><span>You will receive:</span><strong>₹${refund.amount}</strong></div></div><p class="modal-note">Refund will be processed to your original payment method within 5-7 business days.</p>`;
      modalConfirmBtn.style.display = 'inline-block'; modalConfirmBtn.textContent = `Confirm Cancellation (₹${refund.amount})`;
      pendingCancel = { bookingId, refund };
    }
    modal.style.display = 'flex';
  }

  function closeModal() { modal.style.display = 'none'; pendingCancel = null; }
  modalCloseBtn.addEventListener('click', closeModal); modalCancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  modalConfirmBtn.addEventListener('click', () => {
    if (!pendingCancel) return; const { bookingId, refund } = pendingCancel;
    const bookings = getBookings(); const idx = bookings.findIndex((b) => b.bookingId === bookingId); if (idx === -1) return;
    releaseSeatsForBooking(bookings[idx]);
    bookings[idx].bookingStatus = 'Cancelled'; bookings[idx].cancelledAt = new Date().toISOString(); bookings[idx].refundAmount = refund.amount; bookings[idx].refundPercent = refund.percent;
    localStorage.setItem('movietix_bookings', JSON.stringify(bookings));
    closeModal(); renderBookings(); updateStats();
  });

  function updateStats() {
    const refreshed = getBookings().filter((b) => b.userEmail === currentUser.email);
    const a = refreshed.filter((b) => b.bookingStatus !== 'Cancelled');
    document.getElementById('totalBookings').textContent = refreshed.length;
    document.getElementById('totalTickets').textContent = a.reduce((s, b) => s + b.seats.length, 0);
    document.getElementById('totalSpent').textContent = `₹${a.reduce((s, b) => s + b.totalAmount, 0)}`;
  }

  const resetBtn = document.getElementById('resetSeatsBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (!confirm('Clear ALL booked-seat records?\n\nBookings history stays.')) return;
    localStorage.removeItem('movietix_bookedSeats');
    if (window.showToast) window.showToast('Seat records cleared', 'success');
    setTimeout(() => location.reload(), 800);
  });

  renderBookings();
});