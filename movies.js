document.addEventListener('DOMContentLoaded', () => {
  function getMovies() {
    const stored = localStorage.getItem('movietix_movies');
    if (stored) { try { return JSON.parse(stored); } catch (e) {} }
    return window.MOVIES || [];
  }
  const movies = getMovies();
  const movieGrid = document.getElementById('movieGrid');
  const noResults = document.getElementById('noResults');
  const searchInput = document.getElementById('searchInput');
  const genreFilter = document.getElementById('genreFilter');
  const languageFilter = document.getElementById('languageFilter');

  const params = new URLSearchParams(window.location.search);
  if (params.get('genre')) genreFilter.value = params.get('genre');
  if (params.get('language')) languageFilter.value = params.get('language');
  if (params.get('search')) searchInput.value = params.get('search');

  function renderMovies(list) {
    movieGrid.innerHTML = '';
    if (list.length === 0) { noResults.style.display = 'block'; return; }
    noResults.style.display = 'none';

    list.forEach((movie) => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      
      const posterHTML = movie.posterUrl 
        ? `<img src="${movie.posterUrl}" alt="${movie.title}" />` 
        : `<span style="font-size: 5rem;">${movie.poster || '🎬'}</span>`;

      card.innerHTML = `
        <div class="movie-poster" style="background: linear-gradient(135deg, #1a1a2e, #16213e); display:flex; align-items:center; justify-content:center; padding:0; overflow:hidden;">${posterHTML}</div>
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-meta">${movie.genre} • ${movie.language} • ${movie.duration} min</p>
          <p class="movie-rating">⭐ ${movie.rating} / 10</p>
          <button class="btn-primary" data-id="${movie.id}">Book Now</button>
        </div>
      `;
      movieGrid.appendChild(card);
    });

    document.querySelectorAll('.movie-card .btn-primary').forEach((btn) => {
      btn.addEventListener('click', () => { window.location.href = `movie-details.html?id=${btn.getAttribute('data-id')}`; });
    });
  }

  function applyFilters() {
    const search = searchInput.value.trim().toLowerCase();
    const genre = genreFilter.value;
    const language = languageFilter.value;
    const filtered = movies.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(search);
      const matchesGenre = !genre || movie.genre === genre;
      const matchesLanguage = !language || movie.language === language;
      return matchesSearch && matchesGenre && matchesLanguage;
    });
    renderMovies(filtered);
  }

  searchInput.addEventListener('input', applyFilters);
  genreFilter.addEventListener('change', applyFilters);
  languageFilter.addEventListener('change', applyFilters);
  applyFilters();
});