document.addEventListener('DOMContentLoaded', () => {
  function getMovies() {
    const stored = localStorage.getItem('movietix_movies');
    if (stored) { try { return JSON.parse(stored); } catch (e) {} }
    return window.MOVIES || [];
  }
  const movies = getMovies();
  const currentUser = JSON.parse(localStorage.getItem('movietix_currentUser'));
  if (currentUser) {
    document.querySelectorAll('a[href*="register.html"]').forEach((el) => { el.style.display = 'none'; });
  }
  const featured = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const grid = document.getElementById('featuredMovies');
  if (!grid) return;
  featured.forEach((movie) => {
    const card = document.createElement('a');
    card.href = `pages/movie-details.html?id=${movie.id}`;
    card.className = 'featured-card';
    const posterHTML = movie.posterUrl ? `<img src="${movie.posterUrl}" alt="${movie.title}" />` : `<span style="font-size:5rem;">${movie.poster || '🎬'}</span>`;
    card.innerHTML = `
      <div class="featured-poster">${posterHTML}<span class="featured-rating-badge">⭐ ${movie.rating}</span></div>
      <div class="featured-info">
        <div class="featured-title">${movie.title}</div>
        <div class="featured-meta">${movie.genre} • ${movie.language}</div>
        <div class="featured-meta">${movie.duration} min</div>
        <div class="featured-cta">Book Now →</div>
      </div>
    `;
    grid.appendChild(card);
  });
});