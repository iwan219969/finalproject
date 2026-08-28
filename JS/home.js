
const movieGrid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');
const resultCount = document.getElementById('resultCount');
const filterButtons = document.querySelectorAll('.chip');
const selectionBar = document.getElementById('selectionBar');
const selectedTitle = document.getElementById('selectedTitle');
const selectedShowtime = document.getElementById('selectedShowtime');
const continueBtn = document.getElementById('continueBtn');

let activeFilter = 'All';
let selectedMovie = null;
let selectedTime = '';

function getVisibleMovies() {
  const text = searchInput.value.trim().toLowerCase();

  return movies.filter((movie) => {
    const byFilter = activeFilter === 'All' || movie.genre === activeFilter;
    const byText = !text || movie.title.toLowerCase().includes(text) || movie.genre.toLowerCase().includes(text);
    return byFilter && byText;
  });
}

function updateSelection() {
  if (!selectedMovie) {
    selectionBar.classList.add('hidden');
    selectedTitle.textContent = '—';
    selectedShowtime.textContent = 'Choose a showtime below';
    continueBtn.disabled = true;
    return;
  }

  selectionBar.classList.remove('hidden');
  selectedTitle.textContent = selectedMovie.title;
  selectedShowtime.textContent = selectedTime ? `Selected time: ${selectedTime}` : 'Choose a showtime below';
  continueBtn.disabled = !selectedTime;
}

function renderMovies() {
  const items = getVisibleMovies();
  resultCount.textContent = `${items.length} movie${items.length === 1 ? '' : 's'}`;

  if (!items.length) {
    movieGrid.innerHTML = `
      <div class="no-results">
        <h3>No movies found</h3>
        <p>Try another title or category.</p>
      </div>
    `;
    return;
  }

  movieGrid.innerHTML = items.map((movie) => {
    const buttons = movie.times.map((time) => {
      const chosen = selectedMovie && selectedMovie.title === movie.title && selectedTime === time;
      return `<button class="showtime ${chosen ? 'selected' : ''}" data-title="${movie.title}" data-time="${time}">${time}</button>`;
    }).join('');

    return `
      <article class="movie-card">
        <div class="movie-poster">
          <span class="rating">${movie.rating}</span>
          <div class="movie-placeholder">${movie.title.slice(0, 2).toUpperCase()}</div>
        </div>
        <div class="movie-info">
          <div>
            <h3>${movie.title}</h3>
            <p>${movie.genre} <span>•</span> ${movie.year}</p>
          </div>
          <div class="showtimes">${buttons}</div>
        </div>
      </article>
    `;
  }).join('');

  document.querySelectorAll('.showtime').forEach((button) => {
    button.addEventListener('click', () => {
      const movie = movies.find((item) => item.title === button.dataset.title);
      selectedMovie = movie || null;
      selectedTime = button.dataset.time;
      updateSelection();
      renderMovies();
    });
  });
}

searchInput.addEventListener('input', renderMovies);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    renderMovies();
  });
});

continueBtn.addEventListener('click', () => {
  if (!selectedMovie || !selectedTime) return;
  localStorage.setItem('movieBooking', JSON.stringify({ title: selectedMovie.title, time: selectedTime }));
  window.location.href = 'seats.html';
});

renderMovies();
updateSelection();
