document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_THEATERS = [
    { id: 'T1', name: 'PVR Cinemas', location: 'Samayapuram, Trichy', screens: [{ id: 'S1', name: 'Screen 1', times: ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'] }, { id: 'S2', name: 'Screen 2', times: ['11:00 AM', '03:30 PM', '07:00 PM'] }] },
    { id: 'T2', name: 'INOX Multiplex', location: 'Srirangam, Trichy', screens: [{ id: 'S1', name: 'Audi 1', times: ['09:00 AM', '01:00 PM', '05:30 PM', '10:00 PM'] }] },
    { id: 'T3', name: 'Ramba Theatre', location: 'Thillai Nagar, Trichy', screens: [{ id: 'S1', name: 'Main Screen', times: ['10:00 AM', '01:30 PM', '06:00 PM', '09:30 PM'] }] }
  ];
  function getTheaters() { const stored = localStorage.getItem('movietix_theaters'); if (stored) { try { return JSON.parse(stored); } catch (e) {} } localStorage.setItem('movietix_theaters', JSON.stringify(DEFAULT_THEATERS)); return JSON.parse(JSON.stringify(DEFAULT_THEATERS)); }
  function saveTheaters(list) { localStorage.setItem('movietix_theaters', JSON.stringify(list)); }

  let theaters = getTheaters(); let editingTheaterId = null; let managingTheaterId = null;
  const list = document.getElementById('theatersList'); const noTheaters = document.getElementById('noTheaters');
  const count = document.getElementById('theaterCount'); const searchInput = document.getElementById('theaterSearch');
  const modal = document.getElementById('theaterModal'); const modalTitle = document.getElementById('theaterModalTitle');
  const form = document.getElementById('theaterForm'); const formMessage = document.getElementById('theaterFormMessage');
  const screensModal = document.getElementById('screensModal'); const screensTitle = document.getElementById('screensModalTitle');
  const screensSubtitle = document.getElementById('screensModalSubtitle'); const screensList = document.getElementById('screensList');

  function updateStats() {
    const totalScreens = theaters.reduce((sum, t) => sum + (t.screens?.length || 0), 0);
    const totalShows = theaters.reduce((sum, t) => sum + (t.screens?.reduce((s, sc) => s + (sc.times?.length || 0), 0) || 0), 0);
    document.getElementById('statTotalTheaters').textContent = theaters.length; document.getElementById('statTotalScreens').textContent = totalScreens; document.getElementById('statTotalShows').textContent = totalShows;
  }

  function renderTheaters() {
    const search = searchInput.value.trim().toLowerCase();
    const filtered = theaters.filter((t) => !search || `${t.name} ${t.location}`.toLowerCase().includes(search));
    list.innerHTML = ''; count.textContent = filtered.length; updateStats();
    if (filtered.length === 0) { noTheaters.style.display = 'block'; return; }
    noTheaters.style.display = 'none';
    filtered.forEach((theater) => {
      const card = document.createElement('div'); card.className = 'theater-admin-card';
      const screensHTML = (theater.screens || []).map((screen) => `<div class="screen-chip"><strong>${screen.name}</strong><span class="screen-times">${screen.times?.length || 0} shows</span></div>`).join('');
      card.innerHTML = `
        <div class="theater-card-main"><div class="theater-icon">🏢</div><div class="theater-info"><div class="theater-card-name">${theater.name}</div><div class="theater-card-location">📍 ${theater.location}</div><div class="theater-screens">${screensHTML || '<em style="color:#999;">No screens added</em>'}</div></div></div>
        <div class="theater-card-actions"><button class="icon-btn primary" data-action="screens" data-id="${theater.id}">🎥 Manage Screens</button><button class="icon-btn primary" data-action="edit" data-id="${theater.id}">✏️ Edit</button><button class="icon-btn danger" data-action="delete" data-id="${theater.id}">🗑️ Delete</button></div>
      `;
      list.appendChild(card);
    });
    list.querySelectorAll('[data-action="edit"]').forEach((btn) => btn.addEventListener('click', () => openEditModal(btn.dataset.id)));
    list.querySelectorAll('[data-action="delete"]').forEach((btn) => btn.addEventListener('click', () => deleteTheater(btn.dataset.id)));
    list.querySelectorAll('[data-action="screens"]').forEach((btn) => btn.addEventListener('click', () => openScreensModal(btn.dataset.id)));
  }

  document.getElementById('addTheaterBtn').addEventListener('click', () => { editingTheaterId = null; modalTitle.textContent = 'Add New Theater'; form.reset(); formMessage.textContent = ''; modal.style.display = 'flex'; });
  function openEditModal(theaterId) {
    const theater = theaters.find((t) => t.id === theaterId); if (!theater) return;
    editingTheaterId = theaterId; modalTitle.textContent = 'Edit Theater'; formMessage.textContent = '';
    document.getElementById('theaterName').value = theater.name; document.getElementById('theaterLocation').value = theater.location; modal.style.display = 'flex';
  }
  function closeModal() { modal.style.display = 'none'; editingTheaterId = null; form.reset(); formMessage.textContent = ''; }
  document.getElementById('theaterModalClose').addEventListener('click', closeModal); document.getElementById('theaterFormCancel').addEventListener('click', closeModal); modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('theaterName').value.trim(); const location = document.getElementById('theaterLocation').value.trim();
    if (!name || !location) { formMessage.textContent = 'Please fill in all fields.'; formMessage.style.color = '#c62828'; return; }
    if (editingTheaterId) { const index = theaters.findIndex((t) => t.id === editingTheaterId); theaters[index] = { ...theaters[index], name, location }; formMessage.textContent = '✅ Theater updated!'; }
    else { const newId = 'T' + Date.now().toString().slice(-6); theaters.push({ id: newId, name, location, screens: [] }); formMessage.textContent = '✅ Theater added!'; }
    formMessage.style.color = '#2e7d32'; saveTheaters(theaters); renderTheaters(); setTimeout(closeModal, 700);
  });

  function deleteTheater(theaterId) {
    const theater = theaters.find((t) => t.id === theaterId); if (!theater) return;
    if (!confirm(`Delete theater "${theater.name}"?\n\nThis will also remove all its screens.`)) return;
    theaters = theaters.filter((t) => t.id !== theaterId); saveTheaters(theaters); renderTheaters();
  }

  function openScreensModal(theaterId) {
    managingTheaterId = theaterId; const theater = theaters.find((t) => t.id === theaterId); if (!theater) return;
    screensTitle.textContent = `Screens — ${theater.name}`; screensSubtitle.textContent = 'Add or remove screens and manage their showtimes.';
    document.getElementById('newScreenName').value = ''; renderScreensList(); screensModal.style.display = 'flex';
  }

  function renderScreensList() {
    const theater = theaters.find((t) => t.id === managingTheaterId); if (!theater) return;
    screensList.innerHTML = '';
    if (!theater.screens || theater.screens.length === 0) { screensList.innerHTML = '<p style="color:#999; text-align:center; padding:1rem;">No screens yet. Add one below.</p>'; return; }
    theater.screens.forEach((screen) => {
      const row = document.createElement('div'); row.className = 'screen-manage-row';
      const timesHTML = (screen.times || []).map((t, i) => `<span class="time-chip">${t}<button type="button" class="time-remove" data-screen="${screen.id}" data-index="${i}" title="Remove">✕</button></span>`).join('');
      row.innerHTML = `
        <div class="screen-row-header"><strong>${screen.name}</strong><button type="button" class="icon-btn danger" data-action="deleteScreen" data-screen="${screen.id}">🗑️ Remove Screen</button></div>
        <div class="screen-times-manage">${timesHTML || '<em style="color:#999; font-size:0.85rem;">No showtimes yet</em>'}</div>
        <div class="add-time-row"><input type="text" placeholder="Add time e.g., 08:00 PM" data-screen="${screen.id}" maxlength="10"><button type="button" class="icon-btn primary" data-action="addTime" data-screen="${screen.id}">+ Add Time</button></div>
      `;
      screensList.appendChild(row);
    });
    screensList.querySelectorAll('[data-action="deleteScreen"]').forEach((btn) => btn.addEventListener('click', () => removeScreen(btn.dataset.screen)));
    screensList.querySelectorAll('[data-action="addTime"]').forEach((btn) => { btn.addEventListener('click', () => { const input = screensList.querySelector(`input[data-screen="${btn.dataset.screen}"]`); addTime(btn.dataset.screen, input); }); });
    screensList.querySelectorAll('.time-remove').forEach((btn) => btn.addEventListener('click', () => removeTime(btn.dataset.screen, parseInt(btn.dataset.index, 10))));
    screensList.querySelectorAll('input[data-screen]').forEach((input) => { input.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); addTime(input.dataset.screen, input); } }); });
  }

  function addScreen() {
    const input = document.getElementById('newScreenName'); const name = input.value.trim(); if (!name) { alert('Enter a screen name.'); return; }
    const theater = theaters.find((t) => t.id === managingTheaterId); if (!theater) return;
    if (!theater.screens) theater.screens = [];
    theater.screens.push({ id: 'S' + Date.now().toString().slice(-6), name, times: [] });
    saveTheaters(theaters); input.value = ''; renderScreensList(); renderTheaters();
  }

  function removeScreen(screenId) {
    const theater = theaters.find((t) => t.id === managingTheaterId); if (!theater) return;
    const screen = theater.screens.find((s) => s.id === screenId); if (!screen) return;
    if (!confirm(`Remove screen "${screen.name}"?`)) return;
    theater.screens = theater.screens.filter((s) => s.id !== screenId); saveTheaters(theaters); renderScreensList(); renderTheaters();
  }

  function addTime(screenId, inputEl) {
    const time = inputEl.value.trim(); if (!time) return;
    if (!/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(time)) { alert('Enter a valid time like "06:30 PM".'); return; }
    const normalized = time.toUpperCase().replace(/\s+/g, ' ');
    const theater = theaters.find((t) => t.id === managingTheaterId); if (!theater) return;
    const screen = theater.screens.find((s) => s.id === screenId); if (!screen) return;
    if (!screen.times) screen.times = [];
    if (screen.times.includes(normalized)) { alert('This time already exists.'); return; }
    screen.times.push(normalized); saveTheaters(theaters); renderScreensList(); renderTheaters();
  }

  function removeTime(screenId, index) {
    const theater = theaters.find((t) => t.id === managingTheaterId); if (!theater) return;
    const screen = theater.screens.find((s) => s.id === screenId); if (!screen) return;
    screen.times.splice(index, 1); saveTheaters(theaters); renderScreensList(); renderTheaters();
  }

  document.getElementById('addScreenBtn').addEventListener('click', addScreen);
  document.getElementById('newScreenName').addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); addScreen(); } });
  function closeScreensModal() { screensModal.style.display = 'none'; managingTheaterId = null; }
  document.getElementById('screensModalClose').addEventListener('click', closeScreensModal); document.getElementById('screensDoneBtn').addEventListener('click', closeScreensModal); screensModal.addEventListener('click', (e) => { if (e.target === screensModal) closeScreensModal(); });

  searchInput.addEventListener('input', renderTheaters);
  renderTheaters();
});