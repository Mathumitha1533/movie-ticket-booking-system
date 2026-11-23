document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search); const bookingId = params.get('id');
  const bookingContent = document.getElementById('bookingContent'); const errorContent = document.getElementById('errorContent');
  if (!bookingId) { bookingContent.style.display = 'none'; errorContent.style.display = 'block'; return; }

  const bookings = JSON.parse(localStorage.getItem('movietix_bookings')) || []; const booking = bookings.find((b) => b.bookingId === bookingId);
  if (!booking) { bookingContent.style.display = 'none'; errorContent.style.display = 'block'; return; }

  function getShowDateTime(b) {
    if (!b.date) return null; const m = b.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i); if (!m) return null;
    let h = parseInt(m[1], 10); const min = parseInt(m[2], 10); const p = m[3].toUpperCase();
    if (p === 'PM' && h !== 12) h += 12; if (p === 'AM' && h === 12) h = 0;
    return new Date(`${b.date}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`);
  }
  let status = booking.bookingStatus || 'Confirmed';
  if (status !== 'Cancelled') { const showTime = getShowDateTime(booking); if (showTime && showTime < new Date()) status = 'Completed'; }

  const statusBadge = document.getElementById('adminStatusBadge'); const ticketStatusText = document.getElementById('ticketStatusText');
  statusBadge.textContent = status; ticketStatusText.textContent = status.toUpperCase();
  if (status === 'Cancelled') { statusBadge.className = 'badge badge-red'; ticketStatusText.style.background = '#ffebee'; ticketStatusText.style.color = '#c62828'; }
  else if (status === 'Completed') { statusBadge.className = 'badge badge-blue'; ticketStatusText.style.background = '#e3f2fd'; ticketStatusText.style.color = '#1565c0'; }

  document.getElementById('custName').textContent = booking.userName || 'Guest'; document.getElementById('custEmail').textContent = booking.userEmail || '—';
  document.getElementById('custBookingId').textContent = booking.bookingId;
  const movies = JSON.parse(localStorage.getItem('movietix_movies')) || window.MOVIES || []; const movie = movies.find((m) => m.id === booking.movieId);
  document.getElementById('ticketMovie').textContent = booking.movieTitle;
  if (movie) document.getElementById('ticketLanguage').textContent = `${movie.language} • ${movie.genre} • ${movie.duration} min`;

  document.getElementById('ticketDate').textContent = booking.dateDisplay || booking.date || '—'; document.getElementById('ticketTime').textContent = booking.time;
  document.getElementById('ticketTheater').textContent = booking.theaterName; document.getElementById('ticketScreen').textContent = booking.screenName;
  document.getElementById('ticketSeats').textContent = booking.seats.join(', '); document.getElementById('ticketTotal').textContent = `₹${booking.totalAmount}`;
  document.getElementById('ticketBookingId').textContent = booking.bookingId;
  const methodNames = { card: 'Credit / Debit Card', upi: 'UPI', netbanking: 'Net Banking' }; document.getElementById('ticketPaymentMethod').textContent = methodNames[booking.paymentMethod] || booking.paymentMethod;

  if (status === 'Cancelled' && booking.refundAmount !== undefined) {
    document.getElementById('refundBox').style.display = 'block'; document.getElementById('refundAmt').textContent = booking.refundAmount;
    document.getElementById('refundPct').textContent = booking.refundPercent || 0; document.getElementById('refundBy').textContent = booking.cancelledBy === 'Admin' ? 'Cancelled by admin — full refund' : 'Cancelled by customer';
  }

  const qrData = encodeURIComponent(`MOVIETIX|${booking.bookingId}|${booking.movieTitle}|${booking.seats.join('+')}|${booking.theaterName}|${booking.time}`);
  const qrImage = document.getElementById('qrImage'); qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;
  qrImage.onerror = () => { qrImage.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="%23eee"/><text x="75" y="80" font-size="12" text-anchor="middle" fill="%23999">QR</text></svg>'; };

  const cancelBtn = document.getElementById('adminCancelBtn'); if (status !== 'Confirmed') cancelBtn.style.display = 'none';
  cancelBtn.addEventListener('click', () => {
    if (!confirm(`Cancel booking ${bookingId}?\n\nFull refund will be issued to the customer.`)) return;
    const allBookings = JSON.parse(localStorage.getItem('movietix_bookings')) || []; const idx = allBookings.findIndex((b) => b.bookingId === bookingId); if (idx === -1) return;
    const b = allBookings[idx]; const showKey = b.showKey || [b.movieId, b.date, b.theaterId, b.screenId, b.time].join('|');
    const bookedMap = JSON.parse(localStorage.getItem('movietix_bookedSeats')) || {};
    if (bookedMap[showKey]) { const remaining = bookedMap[showKey].filter((s) => !b.seats.includes(s)); if (remaining.length === 0) delete bookedMap[showKey]; else bookedMap[showKey] = remaining; localStorage.setItem('movietix_bookedSeats', JSON.stringify(bookedMap)); }
    allBookings[idx].bookingStatus = 'Cancelled'; allBookings[idx].cancelledAt = new Date().toISOString(); allBookings[idx].cancelledBy = 'Admin'; allBookings[idx].refundAmount = allBookings[idx].totalAmount; allBookings[idx].refundPercent = 100;
    localStorage.setItem('movietix_bookings', JSON.stringify(allBookings)); window.location.href = 'admin-bookings.html';
  });
});