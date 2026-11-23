document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get('id');
  const confirmationContent = document.getElementById('confirmationContent');
  const errorContent = document.getElementById('errorContent');
  if (!bookingId) { confirmationContent.style.display = 'none'; errorContent.style.display = 'block'; return; }

  const bookings = JSON.parse(localStorage.getItem('movietix_bookings')) || [];
  const booking = bookings.find((b) => b.bookingId === bookingId);
  if (!booking) { confirmationContent.style.display = 'none'; errorContent.style.display = 'block'; return; }

  function getMovies() {
    const stored = localStorage.getItem('movietix_movies');
    if (stored) { try { return JSON.parse(stored); } catch (e) {} }
    return window.MOVIES || [];
  }
  const movies = getMovies();
  const movie = movies.find((m) => m.id === booking.movieId);

  const banner = document.querySelector('.success-banner');
  if (booking.bookingStatus === 'Cancelled') {
    banner.innerHTML = `<div class="success-icon" style="animation:none;">❌</div><h1 style="color:#c62828;">Booking Cancelled</h1><p>This booking has been cancelled. Your refund has been processed.</p>`;
    const refundBanner = document.createElement('div');
    refundBanner.className = 'refund-banner';
    refundBanner.innerHTML = `
      <div class="refund-banner-icon">💸</div>
      <div class="refund-banner-content">
        <h3>Refund Issued</h3>
        <p><strong>₹${booking.refundAmount || 0}</strong> (${booking.refundPercent || 0}% of ₹${booking.totalAmount}) has been credited back to your original payment method.</p>
      </div>
    `;
    banner.parentNode.insertBefore(refundBanner, banner.nextSibling);
    setTimeout(() => { const statusEl = document.querySelector('.ticket-status'); if (statusEl) { statusEl.textContent = 'CANCELLED'; statusEl.style.background = '#ffebee'; statusEl.style.color = '#c62828'; } }, 50);
  }

  document.getElementById('ticketMovie').textContent = booking.movieTitle;
  if (movie) document.getElementById('ticketLanguage').textContent = `${movie.language} • ${movie.genre} • ${movie.duration} min`;

  const showDate = booking.dateDisplay || booking.date;
  if (showDate) document.getElementById('ticketDate').textContent = showDate;
  else {
    const bookingDate = new Date(booking.bookedAt || Date.now());
    document.getElementById('ticketDate').textContent = bookingDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  document.getElementById('ticketTime').textContent = booking.time;
  document.getElementById('ticketTheater').textContent = booking.theaterName;
  document.getElementById('ticketScreen').textContent = booking.screenName;
  document.getElementById('ticketSeats').textContent = booking.seats.join(', ');
  document.getElementById('ticketTotal').textContent = `₹${booking.totalAmount}`;
  document.getElementById('ticketBookingId').textContent = booking.bookingId;

  const methodNames = { card: 'Credit / Debit Card', upi: 'UPI', netbanking: 'Net Banking' };
  document.getElementById('ticketPaymentMethod').textContent = methodNames[booking.paymentMethod] || booking.paymentMethod;

  // Display Extras (Only if they bought them)
  const extrasSection = document.getElementById('extrasSection');
  const parkingInfo = document.getElementById('parkingTicketInfo');
  const snacksInfo = document.getElementById('snacksTicketInfo');
  let hasExtras = false;

  if (booking.parking) {
    parkingInfo.style.display = 'block';
    hasExtras = true;
  }
  if (booking.snacks && booking.snacks.length > 0) {
    const snackText = booking.snacks.map(s => `${s.qty}x ${s.name}`).join(', ');
    snacksInfo.innerHTML = `🍿 Snacks: ${snackText}`;
    hasExtras = true;
  }

  if (hasExtras) {
    extrasSection.style.display = 'block';
  }

  // NEW QR GENERATION (QuickChart API - much more reliable than QRServer)
  const qrData = `MOVIETIX|${booking.bookingId}|${booking.movieTitle}|${booking.seats.join('+')}|${booking.theaterName}|${booking.time}`;
  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=200&margin=1`;
  
  const qrImage = document.getElementById('qrImage');
  qrImage.src = qrUrl;
  
  qrImage.onerror = () => { 
    qrImage.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="%23eee"/><text x="75" y="80" font-size="12" text-anchor="middle" fill="%23999">No Internet</text></svg>'; 
  };
});