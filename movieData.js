(function () {
  function generatePosterSVG(title, emoji, seed) {
    const palettes = [
      ['#1e3a8a', '#4c1d95'], ['#7f1d1d', '#b91c1c'], ['#065f46', '#047857'],
      ['#78350f', '#d97706'], ['#4c1d95', '#7c3aed'], ['#0c4a6e', '#0284c7'],
      ['#831843', '#be185d'], ['#164e63', '#0891b2'], ['#581c87', '#9333ea'],
      ['#991b1b', '#dc2626']
    ];
    const [c1, c2] = palettes[seed % palettes.length];
    const safeTitle = String(title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const words = safeTitle.split(' ');
    let line1 = '', line2 = '';
    words.forEach((w) => {
      if ((line1 + ' ' + w).trim().length <= 14) line1 = (line1 + ' ' + w).trim();
      else line2 = (line2 + ' ' + w).trim();
    });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs>
      <rect width="400" height="600" fill="url(#g)"/><circle cx="200" cy="250" r="90" fill="rgba(255,255,255,0.08)"/>
      <text x="200" y="280" font-size="110" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
      <text x="200" y="430" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif">${line1}</text>
      ${line2 ? `<text x="200" y="465" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif">${line2}</text>` : ''}
      <text x="200" y="520" font-size="14" fill="rgba(255,255,255,0.55)" text-anchor="middle" font-family="Arial, sans-serif" letter-spacing="3">MOVIETIX</text>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  const movies = [
    { id: 'M201', title: 'Avengers: Endgame', genre: 'Action', language: 'English', duration: 181, rating: 8.4, poster: '🎬', description: 'The Avengers assemble one final time to undo Thanos\' snap.' },
    { id: 'M202', title: 'Leo', genre: 'Action', language: 'Tamil', duration: 164, rating: 7.8, poster: '🎥', description: 'A cafe owner is forced to confront his violent past.' },
    { id: 'M203', title: 'Interstellar', genre: 'Sci-Fi', language: 'English', duration: 169, rating: 8.7, poster: '🚀', description: 'Explorers travel through a wormhole to save humanity.' },
    { id: 'M204', title: 'Jawan', genre: 'Action', language: 'Hindi', duration: 169, rating: 7.5, poster: '🔥', description: 'A man driven by personal vendetta rectifies wrongs in society.' },
    { id: 'M205', title: 'Vikram', genre: 'Thriller', language: 'Tamil', duration: 174, rating: 8.3, poster: '🕵️', description: 'A special agent investigates a series of murders.' },
    { id: 'M206', title: 'Inception', genre: 'Sci-Fi', language: 'English', duration: 148, rating: 8.8, poster: '🌀', description: 'A thief plants an idea through dreams.' },
    { id: 'M207', title: '3 Idiots', genre: 'Comedy', language: 'Hindi', duration: 170, rating: 8.4, poster: '🎓', description: 'Two friends search for their long-lost companion.' },
    { id: 'M208', title: 'Baahubali 2', genre: 'Drama', language: 'Telugu', duration: 167, rating: 8.2, poster: '⚔️', description: 'Shiva sets out to reclaim his kingdom.' },
    { id: 'M209', title: 'Toy Story 4', genre: 'Animation', language: 'English', duration: 100, rating: 7.7, poster: '🧸', description: 'Woody and the gang embark on a road trip.' },
    { id: 'M210', title: 'Master', genre: 'Action', language: 'Tamil', duration: 179, rating: 7.2, poster: '💥', description: 'An alcoholic professor clashes with a gangster.' },
    { id: 'M211', title: 'Dune: Part Two', genre: 'Sci-Fi', language: 'English', duration: 166, rating: 8.6, poster: '🏜️', description: 'Paul Atreides unites with the Fremen for revenge.' },
    { id: 'M212', title: 'Oppenheimer', genre: 'Drama', language: 'English', duration: 180, rating: 8.5, poster: '⚛️', description: 'The story of the man behind the atomic bomb.' },
    { id: 'M213', title: 'Barbie', genre: 'Comedy', language: 'English', duration: 114, rating: 7.9, poster: '💗', description: 'Barbie ventures into the real world.' },
    { id: 'M214', title: 'RRR', genre: 'Action', language: 'Telugu', duration: 187, rating: 8.0, poster: '🐯', description: 'Two warriors fight for freedom.' },
    { id: 'M215', title: 'KGF Chapter 2', genre: 'Action', language: 'Kannada', duration: 168, rating: 8.2, poster: '⛏️', description: 'Rocky rules the gold mines of Kolar.' },
    { id: 'M216', title: 'Ponniyin Selvan', genre: 'Drama', language: 'Tamil', duration: 167, rating: 8.1, poster: '👑', description: 'The rise of the Chola dynasty.' },
    { id: 'M217', title: 'Pathaan', genre: 'Action', language: 'Hindi', duration: 146, rating: 7.0, poster: '🕶️', description: 'A RAW agent races to stop a rogue threat.' },
    { id: 'M218', title: 'Animal', genre: 'Thriller', language: 'Hindi', duration: 201, rating: 7.4, poster: '🐺', description: 'A son\'s obsessive love for his father.' },
    { id: 'M219', title: 'The Dark Knight', genre: 'Action', language: 'English', duration: 152, rating: 9.0, poster: '🦇', description: 'Batman faces the Joker.' },
    { id: 'M220', title: 'Fight Club', genre: 'Drama', language: 'English', duration: 139, rating: 8.8, poster: '🥊', description: 'An insomniac forms an underground fight club.' },
    { id: 'M221', title: 'Parasite', genre: 'Thriller', language: 'Korean', duration: 132, rating: 8.5, poster: '🏠', description: 'A poor family infiltrates a wealthy household.' },
    { id: 'M222', title: 'Spirited Away', genre: 'Animation', language: 'Japanese', duration: 125, rating: 8.6, poster: '🐉', description: 'A girl wanders into a world of spirits.' },
    { id: 'M223', title: 'Your Name', genre: 'Animation', language: 'Japanese', duration: 106, rating: 8.4, poster: '🌌', description: 'Two teenagers mysteriously swap bodies.' },
    { id: 'M224', title: 'Top Gun: Maverick', genre: 'Action', language: 'English', duration: 130, rating: 8.3, poster: '✈️', description: 'Maverick trains a new generation of pilots.' },
    { id: 'M225', title: 'John Wick 4', genre: 'Action', language: 'English', duration: 169, rating: 7.8, poster: '🔫', description: 'John Wick takes the fight to the High Table.' },
    { id: 'M226', title: 'Everything Everywhere', genre: 'Sci-Fi', language: 'English', duration: 139, rating: 8.0, poster: '🥯', description: 'A woman connects with parallel versions of herself.' },
    { id: 'M227', title: 'The Godfather', genre: 'Drama', language: 'English', duration: 175, rating: 9.2, poster: '🎩', description: 'The aging patriarch of an organized crime dynasty.' },
    { id: 'M228', title: 'Pulp Fiction', genre: 'Thriller', language: 'English', duration: 154, rating: 8.9, poster: '🍔', description: 'Lives of two mob hitmen intertwine.' },
    { id: 'M229', title: 'The Matrix', genre: 'Sci-Fi', language: 'English', duration: 136, rating: 8.7, poster: '💊', description: 'A hacker discovers reality is a simulation.' },
    { id: 'M230', title: 'Forrest Gump', genre: 'Drama', language: 'English', duration: 142, rating: 8.8, poster: '🍫', description: 'The life journey of a kind-hearted man.' },
    { id: 'M231', title: 'Gladiator', genre: 'Action', language: 'English', duration: 155, rating: 8.5, poster: '🗡️', description: 'A Roman general seeks revenge as a gladiator.' },
    { id: 'M232', title: 'Titanic', genre: 'Drama', language: 'English', duration: 194, rating: 7.9, poster: '🚢', description: 'A love story aboard the ill-fated Titanic.' },
    { id: 'M233', title: 'The Lion King', genre: 'Animation', language: 'English', duration: 88, rating: 8.5, poster: '🦁', description: 'A lion cub flees his kingdom after tragedy.' },
    { id: 'M234', title: 'Frozen II', genre: 'Animation', language: 'English', duration: 103, rating: 7.4, poster: '❄️', description: 'Elsa and Anna journey to save Arendelle.' },
    { id: 'M235', title: 'Coco', genre: 'Animation', language: 'English', duration: 105, rating: 8.4, poster: '🎸', description: 'A boy travels to the Land of the Dead.' },
    { id: 'M236', title: 'Soul', genre: 'Animation', language: 'English', duration: 100, rating: 8.0, poster: '🎹', description: 'A jazz musician finds himself in the Great Before.' },
    { id: 'M237', title: 'Encanto', genre: 'Animation', language: 'English', duration: 102, rating: 7.2, poster: '🌺', description: 'A magical family in Colombia.' },
    { id: 'M238', title: 'Kantara', genre: 'Action', language: 'Kannada', duration: 148, rating: 8.3, poster: '🐗', description: 'A folklore-driven clash between man and nature.' },
    { id: 'M239', title: 'Pushpa: The Rise', genre: 'Action', language: 'Telugu', duration: 179, rating: 7.6, poster: '🪓', description: 'A laborer rises in the red sandalwood trade.' },
    { id: 'M240', title: 'Drishyam 2', genre: 'Thriller', language: 'Hindi', duration: 140, rating: 8.2, poster: '🔍', description: 'A man protects his family from a reopened case.' },
    { id: 'M241', title: 'Andhadhun', genre: 'Thriller', language: 'Hindi', duration: 139, rating: 8.2, poster: '🎼', description: 'A blind pianist witnesses a murder.' },
    { id: 'M242', title: 'Baahubali: The Beginning', genre: 'Drama', language: 'Telugu', duration: 159, rating: 8.0, poster: '🏔️', description: 'A young man discovers his royal lineage.' },
    { id: 'M243', title: 'The Kashmir Files', genre: 'Drama', language: 'Hindi', duration: 170, rating: 8.0, poster: '🏔️', description: 'The story of Kashmiri Pandits.' },
    { id: 'M244', title: 'Bhool Bhulaiyaa 2', genre: 'Comedy', language: 'Hindi', duration: 143, rating: 6.5, poster: '👻', description: 'A comedy of errors with a haunted mansion.' },
    { id: 'M245', title: 'Soorarai Pottru', genre: 'Drama', language: 'Tamil', duration: 153, rating: 8.4, poster: '✈️', description: 'A man dreams of affordable air travel.' },
    { id: 'M246', title: 'Asuran', genre: 'Action', language: 'Tamil', duration: 141, rating: 8.4, poster: '🔪', description: 'A farmer protects his family from a powerful clan.' },
    { id: 'M247', title: 'Kaithi', genre: 'Thriller', language: 'Tamil', duration: 145, rating: 8.4, poster: '🚚', description: 'An ex-convict helps police during a drug bust.' },
    { id: 'M248', title: 'Jai Bhim', genre: 'Drama', language: 'Tamil', duration: 164, rating: 8.7, poster: '⚖️', description: 'A lawyer fights for a tribal woman\'s husband.' },
    { id: 'M249', title: 'Spider-Man: No Way Home', genre: 'Action', language: 'English', duration: 148, rating: 8.3, poster: '🕷️', description: 'Spider-Man faces villains from other universes.' },
    { id: 'M250', title: 'Doctor Strange 2', genre: 'Sci-Fi', language: 'English', duration: 126, rating: 7.0, poster: '🔮', description: 'Doctor Strange battles a multiversal threat.' },
    { id: 'M251', title: 'Black Panther', genre: 'Action', language: 'English', duration: 134, rating: 7.3, poster: '🐆', description: 'The new king of Wakanda faces a challenger.' },
    { id: 'M252', title: 'The Batman', genre: 'Thriller', language: 'English', duration: 176, rating: 7.8, poster: '🦇', description: 'Batman hunts the Riddler in Gotham.' },
    { id: 'M253', title: 'Tenet', genre: 'Sci-Fi', language: 'English', duration: 150, rating: 7.3, poster: '⏳', description: 'A protagonist learns to manipulate time.' },
    { id: 'M254', title: 'Shutter Island', genre: 'Thriller', language: 'English', duration: 138, rating: 8.2, poster: '🏝️', description: 'A marshal investigates a disappearance at an asylum.' },
    { id: 'M255', title: 'The Prestige', genre: 'Thriller', language: 'English', duration: 130, rating: 8.5, poster: '🎩', description: 'Two rival magicians engage in a dangerous feud.' }
  ];

  movies.forEach((m, i) => { m.posterUrl = generatePosterSVG(m.title, m.poster, i); });
  window.MOVIES = movies;

  const DATA_VERSION = 2;
  const storedVersion = parseInt(localStorage.getItem('movietix_movies_version') || '0', 10);
  if (storedVersion < DATA_VERSION) {
    localStorage.setItem('movietix_movies', JSON.stringify(movies));
    localStorage.setItem('movietix_movies_version', String(DATA_VERSION));
  }
})();