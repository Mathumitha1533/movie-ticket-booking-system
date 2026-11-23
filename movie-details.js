document.addEventListener('DOMContentLoaded', () => {
  function getMovies() {
    const stored = localStorage.getItem('movietix_movies');
    if (stored) { try { return JSON.parse(stored); } catch (e) {} }
    return window.MOVIES || [];
  }
  const movies = getMovies();
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get('id');
  const movie = movies.find((m) => m.id === movieId);

  if (!movie) {
    document.getElementById('movieTitle').textContent = 'Movie not found';
    document.getElementById('movieMeta').textContent = 'Please go back and select a movie.';
    document.getElementById('theaterList').innerHTML = '';
    document.getElementById('dateSelector').style.display = 'none';
    document.getElementById('reviewsSection').style.display = 'none';
    return;
  }

  const heroPosterEl = document.getElementById('heroPoster');
  if (movie.posterUrl) {
    heroPosterEl.innerHTML = `<img src="${movie.posterUrl}" alt="${movie.title}" />`;
    heroPosterEl.style.padding = '0'; heroPosterEl.style.overflow = 'hidden';
  } else {
    heroPosterEl.textContent = movie.poster || '🎬';
  }

  document.getElementById('movieTitle').textContent = movie.title;
  document.getElementById('movieMeta').textContent = `${movie.genre} • ${movie.language} • ${movie.duration} min`;
  document.getElementById('movieRating').textContent = `⭐ ${movie.rating} / 10`;
  document.getElementById('movieDesc').textContent = movie.description;

  const trailerBtn = document.getElementById('trailerBtn');
  if (trailerBtn) {
    const searchQuery = encodeURIComponent(`${movie.title} ${movie.language} official trailer`);
    trailerBtn.href = `https://www.youtube.com/results?search_query=${searchQuery}`;
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  function formatDateObj(d, index = -1) {
    return { fullDate: d.toISOString().split('T')[0], dayName: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : dayNames[d.getDay()], dayNum: d.getDate(), month: monthNames[d.getMonth()], year: d.getFullYear() };
  }

  const dates = []; const today = new Date();
  for (let i = 0; i < 7; i++) { const d = new Date(today); d.setDate(today.getDate() + i); dates.push(formatDateObj(d, i)); }

  const dateSelector = document.getElementById('dateSelector');
  let selectedDate = dates[0].fullDate;
  let selectedShow = null;

  function getDateInfo(fullDateStr) {
    const existing = dates.find((d) => d.fullDate === fullDateStr);
    if (existing) return existing;
    const d = new Date(fullDateStr);
    return { fullDate: fullDateStr, dayName: dayNames[d.getDay()], dayNum: d.getDate(), month: monthNames[d.getMonth()], year: d.getFullYear() };
  }

  function renderDateTabs() {
    dateSelector.innerHTML = '';
    dates.forEach((date) => {
      const btn = document.createElement('button');
      btn.className = 'date-tab';
      if (date.fullDate === selectedDate) btn.classList.add('selected');
      btn.dataset.date = date.fullDate;
      btn.innerHTML = `<span class="date-day">${date.dayName}</span><span class="date-num">${date.dayNum}</span><span class="date-month">${date.month}</span>`;
      btn.addEventListener('click', () => {
        selectedDate = date.fullDate; selectedShow = null; updateContinueBar(); renderDateTabs(); renderTheaters();
      });
      dateSelector.appendChild(btn);
    });

    const moreBtn = document.createElement('button');
    moreBtn.className = 'date-tab more-dates-tab';
    moreBtn.innerHTML = `<span class="date-day">More</span><span class="date-num">📅</span><span class="date-month">Dates</span>`;
    moreBtn.addEventListener('click', () => {
      const input = document.getElementById('customDateInput');
      input.min = new Date().toISOString().split('T')[0]; input.max = '2027-12-31';
      if (input.showPicker) input.showPicker(); else input.click();
    });
    dateSelector.appendChild(moreBtn);

    let customInput = document.getElementById('customDateInput');
    if (!customInput) {
      customInput = document.createElement('input'); customInput.type = 'date'; customInput.id = 'customDateInput';
      customInput.style.position = 'absolute'; customInput.style.opacity = '0'; customInput.style.pointerEvents = 'none';
      dateSelector.appendChild(customInput);
      customInput.addEventListener('change', (e) => {
        const picked = e.target.value; if (!picked) return;
        if (picked < new Date().toISOString().split('T')[0]) { alert('Please pick today or a future date.'); return; }
        if (!dates.find((d) => d.fullDate === picked)) { dates.push(getDateInfo(picked)); dates.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate)); }
        selectedDate = picked; selectedShow = null; updateContinueBar(); renderDateTabs(); renderTheaters();
      });
    }
  }

  function getTheaters() {
    const DEFAULT_THEATERS = [
      { id: 'T1', name: 'PVR Cinemas', location: 'Samayapuram, Trichy', screens: [{ id: 'S1', name: 'Screen 1', times: ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'] }, { id: 'S2', name: 'Screen 2', times: ['11:00 AM', '03:30 PM', '07:00 PM'] }] },
      { id: 'T2', name: 'INOX Multiplex', location: 'Srirangam, Trichy', screens: [{ id: 'S1', name: 'Audi 1', times: ['09:00 AM', '01:00 PM', '05:30 PM', '10:00 PM'] }] },
      { id: 'T3', name: 'Ramba Theatre', location: 'Thillai Nagar, Trichy', screens: [{ id: 'S1', name: 'Main Screen', times: ['10:00 AM', '01:30 PM', '06:00 PM', '09:30 PM'] }] }
    ];
    const stored = localStorage.getItem('movietix_theaters');
    if (stored) { try { const parsed = JSON.parse(stored); if (Array.isArray(parsed) && parsed.length > 0) return parsed; } catch (e) {} }
    localStorage.setItem('movietix_theaters', JSON.stringify(DEFAULT_THEATERS));
    return JSON.parse(JSON.stringify(DEFAULT_THEATERS));
  }

  const theaters = getTheaters();
  const theaterList = document.getElementById('theaterList');

  function renderTheaters() {
    theaterList.innerHTML = '';
    theaters.forEach((theater) => {
      const card = document.createElement('div');
      card.className = 'theater-card';
      let timesHTML = '';
      theater.screens.forEach((screen) => {
        timesHTML += `<div style="margin-bottom: 0.5rem;"><div style="font-size:0.85rem;color:#555;font-weight:600;margin-bottom:0.3rem;">${screen.name}</div><div class="show-times">${screen.times.map((time) => `<button class="show-time-btn" data-theater-id="${theater.id}" data-theater-name="${theater.name}" data-screen-id="${screen.id}" data-screen-name="${screen.name}" data-time="${time}">${time}</button>`).join('')}</div></div>`;
      });
      card.innerHTML = `<div class="theater-name">${theater.name}</div><div class="theater-location">📍 ${theater.location}</div>${timesHTML}`;
      theaterList.appendChild(card);
    });
    attachShowTimeHandlers();
  }

  const selectedInfo = document.getElementById('selectedInfo');
  const continueBtn = document.getElementById('continueBtn');

  function updateContinueBar() {
    if (selectedShow) { selectedInfo.textContent = `Selected: ${selectedShow.dateDisplay} • ${selectedShow.theaterName} • ${selectedShow.screenName} • ${selectedShow.time}`; continueBtn.disabled = false; }
    else { selectedInfo.textContent = 'No show selected yet'; continueBtn.disabled = true; }
  }

  function attachShowTimeHandlers() {
    document.querySelectorAll('.show-time-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const isAlreadySelected = btn.classList.contains('selected');
        document.querySelectorAll('.show-time-btn').forEach((b) => b.classList.remove('selected'));
        if (isAlreadySelected) { selectedShow = null; updateContinueBar(); }
        else {
          btn.classList.add('selected');
          const dateObj = getDateInfo(selectedDate);
          const displayDate = `${dateObj.dayName}, ${dateObj.dayNum} ${dateObj.month} ${dateObj.year}`;
          selectedShow = { movieId: movie.id, movieTitle: movie.title, date: selectedDate, dateDisplay: displayDate, theaterId: btn.dataset.theaterId, theaterName: btn.dataset.theaterName, screenId: btn.dataset.screenId, screenName: btn.dataset.screenName, time: btn.dataset.time, price: 200 };
          updateContinueBar();
        }
      });
    });
  }

  continueBtn.addEventListener('click', () => {
    if (!selectedShow) return;
    const currentUser = JSON.parse(localStorage.getItem('movietix_currentUser'));
    if (!currentUser) { alert('Please login first to continue booking.'); window.location.href = 'login.html'; return; }
    localStorage.setItem('movietix_selectedShow', JSON.stringify(selectedShow));
    window.location.href = 'seat-selection.html';
  });

  const allReviews = JSON.parse(localStorage.getItem('movietix_reviews')) || [];
  const movieReviews = allReviews.filter((r) => r.movieId === movie.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const reviewsList = document.getElementById('reviewsList');
  const noReviews = document.getElementById('noReviews');

  if (movieReviews.length === 0) {
    document.getElementById('avgRatingNumber').textContent = '0.0';
    document.getElementById('avgRatingStars').textContent = '☆☆☆☆☆';
    document.getElementById('avgRatingCount').textContent = 'No reviews yet';
    noReviews.style.display = 'block';
  } else {
    const total = movieReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = (total / movieReviews.length).toFixed(1);
    const fullStars = Math.round(avg);
    document.getElementById('avgRatingNumber').textContent = avg;
    document.getElementById('avgRatingStars').textContent = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
    document.getElementById('avgRatingCount').textContent = `${movieReviews.length} review${movieReviews.length > 1 ? 's' : ''}`;
    noReviews.style.display = 'none';

    movieReviews.forEach((review) => {
      const card = document.createElement('div');
      card.className = 'review-item';
      const date = new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      card.innerHTML = `
        <div class="review-item-header">
          <div class="review-avatar">${(review.userName || 'U').charAt(0).toUpperCase()}</div>
          <div class="review-user-info"><div class="review-user-name">${review.userName}</div><div class="review-date">${date}</div></div>
          <div class="review-stars-small">${'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}</div>
        </div>
        ${review.text ? `<p class="review-text">"${review.text}"</p>` : '<p class="review-text empty">No comment provided.</p>'}
      `;
      reviewsList.appendChild(card);
    });
  }

  renderDateTabs();
  renderTheaters();
  updateContinueBar(); 
});