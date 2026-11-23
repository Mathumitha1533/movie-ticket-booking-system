document.addEventListener('DOMContentLoaded', () => {
  function getMovies() { const stored = localStorage.getItem('movietix_movies'); if (stored) { try { return JSON.parse(stored); } catch (e) {} } return window.MOVIES || []; }
  const movies = getMovies();
  const users = JSON.parse(localStorage.getItem('movietix_users')) || [];
  const bookings = JSON.parse(localStorage.getItem('movietix_bookings')) || [];
  const reviews = JSON.parse(localStorage.getItem('movietix_reviews')) || [];

  const activeBookings = bookings.filter((b) => b.bookingStatus !== 'Cancelled');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalTickets = activeBookings.reduce((sum, b) => sum + b.seats.length, 0);

  document.getElementById('statMovies').textContent = movies.length;
  document.getElementById('statUsers').textContent = users.length;
  document.getElementById('statBookings').textContent = bookings.length;
  document.getElementById('statRevenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
  document.getElementById('statTickets').textContent = totalTickets;
  document.getElementById('statReviews').textContent = reviews.length;

  const recentBody = document.getElementById('recentBookingsBody');
  const noRecent = document.getElementById('noRecentBookings');
  const recentBookings = [...bookings].sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)).slice(0, 5);

  if (recentBookings.length === 0) { 
    document.getElementById('recentBookingsTable').style.display = 'none'; 
    noRecent.style.display = 'block'; 
  } else {
    recentBookings.forEach((b) => {
      const tr = document.createElement('tr'); 
      let badgeClass = 'badge-green';
      if (b.bookingStatus === 'Cancelled') badgeClass = 'badge-red';

      // NEW: Build Extras string
      let extrasText = '';
      if (b.parking) extrasText += '🚗 Parking ';
      if (b.snacks && b.snacks.length > 0) {
        extrasText += '🍿 ' + b.snacks.map(s => `${s.qty}x${s.name}`).join(', ');
      }
      if (!extrasText) extrasText = '<span style="color:#ccc;">None</span>';

      tr.innerHTML = `
        <td><strong>${b.bookingId}</strong></td>
        <td>${b.userName || 'Guest'}</td>
        <td>${b.movieTitle}</td>
        <td>${b.seats.join(', ')}</td>
        <td style="font-size:0.8rem;">${extrasText}</td>
        <td><strong>₹${b.totalAmount}</strong></td>
        <td><span class="badge ${badgeClass}">${b.bookingStatus || 'Confirmed'}</span></td>
      `;
      recentBody.appendChild(tr);
    });
  }

  // Top Rated Movies Section
  const topBody = document.getElementById('topMoviesBody');
  const noTop = document.getElementById('noTopMovies');
  const ratingsByMovie = {};
  reviews.forEach((r) => { if (!ratingsByMovie[r.movieId]) { ratingsByMovie[r.movieId] = { total: 0, count: 0, movieTitle: r.movieTitle }; } ratingsByMovie[r.movieId].total += r.rating; ratingsByMovie[r.movieId].count += 1; });
  const topMovies = Object.entries(ratingsByMovie).map(([movieId, data]) => ({ movieId, title: data.movieTitle, avg: data.total / data.count, count: data.count })).sort((a, b) => b.avg - a.avg).slice(0, 5);

  if (topMovies.length === 0) { 
    document.getElementById('topMoviesTable').style.display = 'none'; 
    noTop.style.display = 'block'; 
  } else {
    topMovies.forEach((m) => {
      const movie = movies.find((mv) => mv.id === m.movieId); const genre = movie ? movie.genre : '—';
      const stars = '★'.repeat(Math.round(m.avg)) + '☆'.repeat(5 - Math.round(m.avg));
      const tr = document.createElement('tr'); 
      tr.innerHTML = `<td><strong>${m.title}</strong></td><td>${genre}</td><td><span style="color:#f5a623; font-weight:700;">${m.avg.toFixed(1)}</span> <span style="color:#f5a623;">${stars}</span></td><td>${m.count} review${m.count > 1 ? 's' : ''}</td>`;
      topBody.appendChild(tr);
    });
  }
});