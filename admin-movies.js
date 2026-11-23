document.addEventListener('DOMContentLoaded', () => {
  function getMovies() { const stored = localStorage.getItem('movietix_movies'); if (stored) return JSON.parse(stored); const defaults = window.MOVIES || []; localStorage.setItem('movietix_movies', JSON.stringify(defaults)); return defaults; }
  function saveMovies(list) { localStorage.setItem('movietix_movies', JSON.stringify(list)); }

  let movies = getMovies(); let editingMovieId = null;
  const tableBody = document.getElementById('moviesTableBody');
  const table = document.getElementById('moviesTable');
  const noMovies = document.getElementById('noMovies');
  const movieCount = document.getElementById('movieCount');
  const searchInput = document.getElementById('movieSearch');
  const modal = document.getElementById('movieModal');
  const modalTitle = document.getElementById('movieModalTitle');
  const form = document.getElementById('movieForm');
  const formMessage = document.getElementById('movieFormMessage');

  function renderTable(filter = '') {
    const filtered = movies.filter((m) => m.title.toLowerCase().includes(filter.toLowerCase()));
    tableBody.innerHTML = ''; movieCount.textContent = filtered.length;
    if (filtered.length === 0) { table.style.display = 'none'; noMovies.style.display = 'block'; return; }
    table.style.display = 'table'; noMovies.style.display = 'none';

    filtered.forEach((movie) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><div class="table-poster">${movie.posterUrl ? `<img src="${movie.posterUrl}" />` : movie.poster}</div></td>
        <td><strong>${movie.title}</strong><br><span style="font-size:0.75rem;color:#999;">ID: ${movie.id}</span></td>
        <td>${movie.genre}</td><td>${movie.language}</td><td>${movie.duration} min</td>
        <td><span style="color:#f5a623;font-weight:700;">⭐ ${movie.rating}</span></td>
        <td><div class="table-actions"><button class="icon-btn primary" data-action="edit" data-id="${movie.id}">✏️ Edit</button><button class="icon-btn danger" data-action="delete" data-id="${movie.id}">🗑️ Delete</button></div></td>
      `;
      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll('[data-action="edit"]').forEach((btn) => { btn.addEventListener('click', () => openEditModal(btn.dataset.id)); });
    tableBody.querySelectorAll('[data-action="delete"]').forEach((btn) => { btn.addEventListener('click', () => deleteMovie(btn.dataset.id)); });
  }

  document.getElementById('addMovieBtn').addEventListener('click', () => { editingMovieId = null; modalTitle.textContent = 'Add New Movie'; form.reset(); formMessage.textContent = ''; modal.style.display = 'flex'; });
  function openEditModal(movieId) {
    const movie = movies.find((m) => m.id === movieId); if (!movie) return;
    editingMovieId = movieId; modalTitle.textContent = 'Edit Movie'; formMessage.textContent = '';
    document.getElementById('movieFormTitle').value = movie.title; document.getElementById('movieFormGenre').value = movie.genre;
    document.getElementById('movieFormLanguage').value = movie.language; document.getElementById('movieFormDuration').value = movie.duration;
    document.getElementById('movieFormRating').value = movie.rating; document.getElementById('movieFormPoster').value = movie.poster;
    document.getElementById('movieFormDescription').value = movie.description; modal.style.display = 'flex';
  }
  function closeModal() { modal.style.display = 'none'; editingMovieId = null; form.reset(); formMessage.textContent = ''; }
  document.getElementById('movieModalClose').addEventListener('click', closeModal); document.getElementById('movieFormCancel').addEventListener('click', closeModal); modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('movieFormTitle').value.trim(); const genre = document.getElementById('movieFormGenre').value;
    const language = document.getElementById('movieFormLanguage').value; const duration = parseInt(document.getElementById('movieFormDuration').value, 10);
    const rating = parseFloat(document.getElementById('movieFormRating').value); const poster = document.getElementById('movieFormPoster').value.trim();
    const description = document.getElementById('movieFormDescription').value.trim();

    if (!title || !genre || !language || !duration || isNaN(rating) || !poster || !description) { formMessage.textContent = 'Please fill in all fields.'; formMessage.style.color = '#c62828'; return; }
    if (rating < 0 || rating > 10) { formMessage.textContent = 'Rating must be between 0 and 10.'; formMessage.style.color = '#c62828'; return; }

    if (editingMovieId) {
      const index = movies.findIndex((m) => m.id === editingMovieId); movies[index] = { ...movies[index], title, genre, language, duration, rating, poster, description };
      formMessage.textContent = '✅ Movie updated!'; formMessage.style.color = '#2e7d32';
    } else {
      const newId = 'M' + (Date.now().toString().slice(-6)); movies.push({ id: newId, title, genre, language, duration, rating, poster, description });
      formMessage.textContent = '✅ Movie added!'; formMessage.style.color = '#2e7d32';
    }
    saveMovies(movies); renderTable(searchInput.value); setTimeout(closeModal, 800);
  });

  function deleteMovie(movieId) {
    const movie = movies.find((m) => m.id === movieId); if (!movie) return;
    if (!confirm(`Are you sure you want to delete "${movie.title}"?`)) return;
    movies = movies.filter((m) => m.id !== movieId); saveMovies(movies); renderTable(searchInput.value);
  }

  searchInput.addEventListener('input', () => { renderTable(searchInput.value); });
  renderTable();
});