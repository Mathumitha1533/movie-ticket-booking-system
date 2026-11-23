document.addEventListener('DOMContentLoaded', () => {
  const selectedShow = JSON.parse(localStorage.getItem('movietix_selectedShow'));
  if (!selectedShow) { alert('Please select a movie and showtime first.'); window.location.href = 'movies.html'; return; }

  const showKey = [selectedShow.movieId, selectedShow.date, selectedShow.theaterId, selectedShow.screenId, selectedShow.time].join('|');
  document.getElementById('showTitle').textContent = selectedShow.movieTitle;
  document.getElementById('showDetails').textContent = `${selectedShow.dateDisplay || selectedShow.date} • ${selectedShow.theaterName} • ${selectedShow.screenName} • ${selectedShow.time}`;
  const backLink = document.getElementById('backLink');
  if (backLink && selectedShow.movieId) backLink.href = `movie-details.html?id=${selectedShow.movieId}`;

  const SEAT_PRICE = 200;
  const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const COLS = 10;

  function hashString(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function seededRandom(seed) { let t = seed + 0x6D2B79F5; return function () { t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  function getOrCreateBookedSeatsForShow() {
    const map = JSON.parse(localStorage.getItem('movietix_bookedSeats')) || {};
    if (!map[showKey]) {
      const rand = seededRandom(hashString(showKey));
      const total = ROWS.length * COLS;
      const bookRatio = 0.15 + rand() * 0.15;
      const numberToBook = Math.floor(total * bookRatio);
      const allSeats = [];
      ROWS.forEach((r) => { for (let c = 1; c <= COLS; c++) allSeats.push(`${r}${c}`); });
      for (let i = allSeats.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [allSeats[i], allSeats[j]] = [allSeats[j], allSeats[i]]; }
      map[showKey] = allSeats.slice(0, numberToBook);
      localStorage.setItem('movietix_bookedSeats', JSON.stringify(map));
    }
    return new Set(map[showKey]);
  }

  const bookedSeats = getOrCreateBookedSeatsForShow();
  const seatGrid = document.getElementById('seatGrid');
  seatGrid.innerHTML = ''; seatGrid.style.display = 'block';

  ROWS.forEach((row) => {
    const rowWrapper = document.createElement('div'); rowWrapper.className = 'seat-row-wrapper';
    const leftLabel = document.createElement('div'); leftLabel.className = 'row-label'; leftLabel.innerHTML = `<span class="row-letter">${row}</span>`;
    const seatsRow = document.createElement('div'); seatsRow.className = 'seat-row';
    for (let col = 1; col <= COLS; col++) {
      const seatId = `${row}${col}`;
      const seat = document.createElement('div'); seat.classList.add('seat'); seat.textContent = seatId;
      seat.dataset.seatId = seatId; seat.dataset.price = SEAT_PRICE; seat.dataset.row = row; seat.dataset.col = col;
      if (bookedSeats.has(seatId)) { seat.classList.add('booked'); seat.title = 'Already booked'; }
      else {
        seat.classList.add('available'); seat.title = `Available • ₹${SEAT_PRICE}`;
        seat.addEventListener('click', () => { if (seat.classList.contains('selected')) seat.classList.remove('selected'); else seat.classList.add('selected'); updateSummary(); });
      }
      seatsRow.appendChild(seat);
    }
    rowWrapper.appendChild(leftLabel); rowWrapper.appendChild(seatsRow); seatGrid.appendChild(rowWrapper);
  });

  function scoreSeat(row, col) { const rS = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 5, G: 4, H: 3 }; const cS = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1 }; return rS[row] + cS[col]; }

  // NEW: Get all valid groups sorted by best score
  function getAllGroups(count) {
    const availableByRow = {};
    document.querySelectorAll('.seat.available').forEach((s) => {
      if (s.classList.contains('booked')) return;
      const row = s.dataset.row; if (!availableByRow[row]) availableByRow[row] = [];
      availableByRow[row].push({ el: s, col: parseInt(s.dataset.col, 10), seatId: s.dataset.seatId });
    });

    let allGroups = [];
    Object.entries(availableByRow).forEach(([row, seats]) => {
      seats.sort((a, b) => a.col - b.col);
      for (let i = 0; i <= seats.length - count; i++) {
        let contiguous = true;
        for (let k = 1; k < count; k++) { if (seats[i + k].col !== seats[i + k - 1].col + 1) { contiguous = false; break; } }
        if (!contiguous) continue;
        const group = seats.slice(i, i + count); 
        const score = group.reduce((sum, s) => sum + scoreSeat(row, s.col), 0);
        allGroups.push({ seats: group, score: score });
      }
    });

    // Sort highest score first
    allGroups.sort((a, b) => b.score - a.score);
    return allGroups;
  }

  const ticketModal = document.getElementById('ticketCountModal');
  const ticketCountInput = document.getElementById('ticketCountInput');
  const ticketConfirmBtn = document.getElementById('ticketConfirmBtn');
  const ticketCancelBtn = document.getElementById('ticketCancelBtn');
  const changeCountBtn = document.getElementById('changeCountBtn');
  let desiredTickets = 0;
  let recommendationIndex = 0; // NEW: Tracks which recommendation we are showing

  function openTicketModal() { ticketCountInput.value = desiredTickets || 1; ticketModal.style.display = 'flex'; setTimeout(() => ticketCountInput.focus(), 100); }
  function closeTicketModal() { ticketModal.style.display = 'none'; }
  function applyTicketCount(count) { 
    desiredTickets = Math.max(1, Math.min(count, 20)); 
    recommendationIndex = 0; // Reset index when ticket count changes
    const cd = document.getElementById('desiredCountDisplay'); if (cd) cd.textContent = desiredTickets; 
    applyRecommendation(); 
  }

  ticketConfirmBtn.addEventListener('click', () => {
    const n = parseInt(ticketCountInput.value, 10);
    if (isNaN(n) || n < 1) { alert('Please enter a number between 1 and 20.'); return; }
    if (n > 20) { alert('Maximum 20 tickets per booking.'); return; }
    applyTicketCount(n); closeTicketModal();
  });
  ticketCancelBtn.addEventListener('click', () => { if (desiredTickets === 0) { window.location.href = 'movie-details.html?id=' + selectedShow.movieId; return; } closeTicketModal(); });
  if (changeCountBtn) changeCountBtn.addEventListener('click', openTicketModal);
  document.getElementById('counterMinus').addEventListener('click', () => { ticketCountInput.value = Math.max(1, (parseInt(ticketCountInput.value, 10) || 1) - 1); });
  document.getElementById('counterPlus').addEventListener('click', () => { ticketCountInput.value = Math.min(20, (parseInt(ticketCountInput.value, 10) || 1) + 1); });

  function applyRecommendation() {
    document.querySelectorAll('.seat.recommended').forEach((s) => s.classList.remove('recommended'));
    if (desiredTickets < 1) return;
    
    const allGroups = getAllGroups(desiredTickets);
    const bannerText = document.getElementById('recommendBannerText');

    if (allGroups.length === 0) { 
      if (bannerText) bannerText.innerHTML = `⚠️ No adjacent seats available for this show.`; 
      window.__recommendedSeats = []; 
      return; 
    }

    // If index goes past the end, loop back to 0
    if (recommendationIndex >= allGroups.length) recommendationIndex = 0;
    
    const result = allGroups[recommendationIndex];
    result.seats.forEach((s) => s.el.classList.add('recommended'));
    
    const ids = result.seats.map((s) => s.seatId).join(', ');
    if (bannerText) bannerText.innerHTML = `Option ${recommendationIndex + 1} of ${allGroups.length} — Best seats: <strong>${ids}</strong>`;
    
    window.__recommendedSeats = result.seats.map(s => s.el);
  }

  function analyzeSelection() {
    const selected = Array.from(document.querySelectorAll('.seat.selected'));
    if (selected.length === 0) return { status: 'empty', adjacent: false };
    if (selected.length === 1) return { status: 'single', adjacent: true };
    const rows = new Set(selected.map((s) => s.dataset.row)); if (rows.size > 1) return { status: 'multi-row', adjacent: false };
    const cols = selected.map((s) => parseInt(s.dataset.col, 10)).sort((a, b) => a - b);
    let contiguous = true; for (let i = 1; i < cols.length; i++) { if (cols[i] !== cols[i - 1] + 1) { contiguous = false; break; } }
    return { status: contiguous ? 'adjacent' : 'gaps', adjacent: contiguous, row: Array.from(rows)[0] };
  }

  const selectedSeatsText = document.getElementById('selectedSeatsText');
  const totalPriceText = document.getElementById('totalPriceText');
  const proceedBtn = document.getElementById('proceedBtn');
  const groupStatusEl = document.getElementById('groupStatus');

  function updateSummary() {
    const selected = document.querySelectorAll('.seat.selected'); const count = selected.length;
    if (count === 0) { selectedSeatsText.textContent = 'No seats selected'; totalPriceText.textContent = 'Total: ₹0'; proceedBtn.disabled = true; updateGroupStatus(); return; }
    const seatNames = Array.from(selected).map((s) => s.dataset.seatId).join(', '); const total = count * SEAT_PRICE;
    selectedSeatsText.textContent = `Selected (${count}): ${seatNames}`; totalPriceText.textContent = `Total: ₹${total}`; proceedBtn.disabled = false;
    updateGroupStatus();
  }

  function updateGroupStatus() {
    if (!groupStatusEl) return; const info = analyzeSelection(); const count = document.querySelectorAll('.seat.selected').length;
    if (info.status === 'empty') { groupStatusEl.style.display = 'none'; return; }
    groupStatusEl.style.display = 'flex';
    if (info.status === 'single') { groupStatusEl.className = 'group-status info'; groupStatusEl.innerHTML = `ℹ️ <span>1 seat selected. Add more to form a group.</span>`; return; }
    if (info.adjacent) { groupStatusEl.className = 'group-status success'; groupStatusEl.innerHTML = `✓ <span>Group of <strong>${count}</strong> adjacent seats in row <strong>${info.row}</strong> — you'll sit together!</span>`; return; }
    groupStatusEl.className = 'group-status warning';
    groupStatusEl.innerHTML = `<span>⚠️ <strong>Seats not adjacent.</strong> Friends/family will sit apart.</span><button type="button" id="autoArrangeBtn" class="auto-arrange-btn">✨ Auto-arrange ${count} seats</button>`;
    const autoBtn = document.getElementById('autoArrangeBtn');
    if (autoBtn) autoBtn.addEventListener('click', autoArrange);
  }

  function autoArrange() {
    const currentCount = document.querySelectorAll('.seat.selected').length; if (currentCount === 0) return;
    const allGroups = getAllGroups(currentCount);
    if (allGroups.length === 0) { alert(`No adjacent seats available.`); return; }
    
    const result = allGroups[0]; // Pick the absolute best
    document.querySelectorAll('.seat.selected').forEach((s) => s.classList.remove('selected'));
    result.seats.forEach((s) => { if (!s.el.classList.contains('booked')) s.el.classList.add('selected'); });
    updateSummary();
  }

  const selectRecBtn = document.getElementById('selectRecommendedBtn');
  const refreshRecBtn = document.getElementById('refreshRecommendedBtn');
  
  if (selectRecBtn) selectRecBtn.addEventListener('click', () => {
    if (!window.__recommendedSeats || window.__recommendedSeats.length === 0) { alert('No recommendations available.'); return; }
    document.querySelectorAll('.seat.selected').forEach((s) => s.classList.remove('selected'));
    window.__recommendedSeats.forEach((s) => { if (!s.classList.contains('booked')) s.classList.add('selected'); });
    updateSummary();
  });
  
  // NEW: Refresh logic cycles to the next best group
  if (refreshRecBtn) refreshRecBtn.addEventListener('click', () => {
    recommendationIndex++; 
    applyRecommendation();
  });

  proceedBtn.addEventListener('click', () => {
    const selected = document.querySelectorAll('.seat.selected'); const info = analyzeSelection();
    if (!info.adjacent && selected.length > 1) { const proceed = confirm('Your seats are not adjacent. Friends/family may sit apart.\n\nContinue anyway?'); if (!proceed) return; }
    const seatNames = Array.from(selected).map((s) => s.dataset.seatId); const total = seatNames.length * SEAT_PRICE;
    
    const bookingDetails = { ...selectedShow, showKey: showKey, seats: seatNames, totalAmount: total, bookingDate: new Date().toISOString() };
    localStorage.setItem('movietix_bookingDetails', JSON.stringify(bookingDetails));
    
    window.location.href = 'payment.html';
  });

  openTicketModal();
});