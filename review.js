document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('movietix_currentUser'));
  if (!currentUser) { alert('Please login to submit a review.'); window.location.href = 'login.html'; return; }

  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get('bookingId');
  if (!bookingId) { alert('No booking specified.'); window.location.href = 'booking-history.html'; return; }

  const bookings = JSON.parse(localStorage.getItem('movietix_bookings')) || [];
  const booking = bookings.find((b) => b.bookingId === bookingId && b.userEmail === currentUser.email);
  if (!booking) { alert('Booking not found.'); window.location.href = 'booking-history.html'; return; }

  function getMovies() {
    const stored = localStorage.getItem('movietix_movies');
    if (stored) { try { return JSON.parse(stored); } catch (e) {} }
    return window.MOVIES || [];
  }
  const movies = getMovies();
  const movie = movies.find((m) => m.id === booking.movieId);

  document.getElementById('reviewPoster').innerHTML = movie && movie.posterUrl ? `<img src="${movie.posterUrl}" alt="" />` : (movie ? movie.poster : '🎬');
  document.getElementById('reviewMovieTitle').textContent = booking.movieTitle;
  if (movie) document.getElementById('reviewMovieMeta').textContent = `${movie.genre} • ${movie.language} • ${movie.duration} min`;

  const allReviews = JSON.parse(localStorage.getItem('movietix_reviews')) || [];
  const existingReview = allReviews.find((r) => r.userEmail === currentUser.email && r.movieId === booking.movieId);

  if (existingReview) {
    document.getElementById('reviewCard').style.display = 'none';
    const alreadyBox = document.getElementById('alreadyReviewed'); alreadyBox.style.display = 'block';
    const stars = '★'.repeat(existingReview.rating) + '☆'.repeat(5 - existingReview.rating);
    document.getElementById('existingReviewInfo').innerHTML = `<span style="font-size: 1.5rem; color: #f5a623; letter-spacing: 3px;">${stars}</span><br><br>"${existingReview.text || 'No comment provided'}"`;
    return;
  }

  const stars = document.querySelectorAll('.star');
  const ratingLabel = document.getElementById('ratingLabel');
  const ratingTexts = { 1: '😞 Poor', 2: '😐 Fair', 3: '🙂 Good', 4: '😃 Very Good', 5: '🤩 Excellent!' };
  let selectedRating = 0;

  function highlightStars(count) { stars.forEach((s, i) => { if (i < count) s.classList.add('active'); else s.classList.remove('active'); }); }

  stars.forEach((star) => {
    const value = parseInt(star.dataset.value);
    star.addEventListener('mouseenter', () => { stars.forEach((s, i) => { if (i < value) s.classList.add('hovered'); else s.classList.remove('hovered'); }); });
    star.addEventListener('mouseleave', () => { stars.forEach((s) => s.classList.remove('hovered')); });
    star.addEventListener('click', () => { selectedRating = value; highlightStars(value); ratingLabel.textContent = ratingTexts[value]; ratingLabel.style.color = '#f5a623'; });
  });

  const reviewText = document.getElementById('reviewText');
  const charCount = document.getElementById('charCount');
  reviewText.addEventListener('input', () => { charCount.textContent = `${reviewText.value.length} / 500`; });

  const reviewForm = document.getElementById('reviewForm');
  const reviewMessage = document.getElementById('reviewMessage');
  const submitBtn = document.getElementById('submitReviewBtn');

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (selectedRating === 0) { reviewMessage.textContent = '⚠️ Please select a star rating first.'; reviewMessage.className = 'form-message error'; return; }
    const text = reviewText.value.trim();
    const newReview = { movieId: booking.movieId, movieTitle: booking.movieTitle, userEmail: currentUser.email, userName: currentUser.name, bookingId: booking.bookingId, rating: selectedRating, text: text, createdAt: new Date().toISOString() };
    const reviews = JSON.parse(localStorage.getItem('movietix_reviews')) || [];
    reviews.push(newReview); localStorage.setItem('movietix_reviews', JSON.stringify(reviews));
    
    booking.reviewed = true;
    localStorage.setItem('movietix_bookings', JSON.stringify(bookings));
    
    reviewMessage.textContent = '✅ Thank you! Redirecting to your bookings...'; reviewMessage.className = 'form-message success'; submitBtn.disabled = true;
    setTimeout(() => { window.location.href = 'booking-history.html'; }, 1500);
  });
});