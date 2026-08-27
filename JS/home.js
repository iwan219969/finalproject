const movies = [
  {
    id: 1,
    title: "Dune: Part Two",
    genre: "Sci-Fi",
    duration: "2h 46min",
    rating: "8.7",
    image:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    showtimes: ["14:30", "17:20", "20:15"]
  },
  {
    id: 2,
    title: "Oppenheimer",
    genre: "Drama",
    duration: "3h 00min",
    rating: "8.6",
    image:
      "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    showtimes: ["15:00", "18:30", "21:00"]
  },
  {
    id: 3,
    title: "John Wick 4",
    genre: "Action",
    duration: "2h 49min",
    rating: "7.6",
    image:
      "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    showtimes: ["13:20", "16:10", "19:30"]
  },
  {
    id: 4,
    title: "Interstellar",
    genre: "Sci-Fi",
    duration: "2h 49min",
    rating: "8.7",
    image:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    showtimes: ["14:00", "17:30", "20:45"]
  }
];

const movieGrid = document.getElementById("movieGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const resultCount = document.getElementById("resultCount");

const selectionBar = document.getElementById("selectionBar");
const selectedTitle = document.getElementById("selectedTitle");
const selectedShowtime = document.getElementById("selectedShowtime");
const continueBtn = document.getElementById("continueBtn");

let selectedMovie = null;
let selectedTime = null;
let currentFilter = "All";


// =========================
// Render movies
// =========================

function renderMovies() {
  const search = searchInput.value.toLowerCase().trim();

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(search) ||
      movie.genre.toLowerCase().includes(search);

    const matchesFilter =
      currentFilter === "All" || movie.genre === currentFilter;

    return matchesSearch && matchesFilter;
  });

  movieGrid.innerHTML = "";

  resultCount.textContent = `${filteredMovies.length} movies`;

  if (filteredMovies.length === 0) {
    movieGrid.innerHTML = `
      <div class="no-results">
        <h3>No movies found</h3>
        <p>Try another title or genre.</p>
      </div>
    `;

    return;
  }

  filteredMovies.forEach((movie) => {
    const movieCard = document.createElement("article");

    movieCard.className = "movie-card";

    movieCard.innerHTML = `
      <div class="movie-poster">
        <img src="${movie.image}" alt="${movie.title}">
        <span class="rating">★ ${movie.rating}</span>
      </div>

      <div class="movie-info">
        <div>
          <h3>${movie.title}</h3>

          <p>
            ${movie.genre}
            <span>•</span>
            ${movie.duration}
          </p>
        </div>

        <div class="showtimes">
          ${movie.showtimes
            .map(
              (time) => `
                <button
                  class="showtime"
                  data-movie="${movie.id}"
                  data-time="${time}"
                >
                  ${time}
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    `;

    movieGrid.appendChild(movieCard);
  });

  addShowtimeListeners();
}


// =========================
// Showtime selection
// =========================

function addShowtimeListeners() {
  const buttons = document.querySelectorAll(".showtime");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const movieId = Number(button.dataset.movie);
      const time = button.dataset.time;

      selectedMovie = movies.find((movie) => movie.id === movieId);
      selectedTime = time;

      document
        .querySelectorAll(".showtime")
        .forEach((btn) => btn.classList.remove("selected"));

      button.classList.add("selected");

      updateSelection();
    });
  });
}


// =========================
// Selection bar
// =========================

function updateSelection() {
  if (!selectedMovie || !selectedTime) {
    selectionBar.classList.add("hidden");
    continueBtn.disabled = true;
    return;
  }

  selectionBar.classList.remove("hidden");

  selectedTitle.textContent = selectedMovie.title;

  selectedShowtime.textContent = `Today at ${selectedTime}`;

  continueBtn.disabled = false;
}


// =========================
// Search
// =========================

searchInput.addEventListener("input", () => {
  renderMovies();
});


// =========================
// Filters
// =========================

filters.addEventListener("click", (event) => {
  const button = event.target.closest(".chip");

  if (!button) return;

  document
    .querySelectorAll(".chip")
    .forEach((chip) => chip.classList.remove("active"));

  button.classList.add("active");

  currentFilter = button.dataset.filter;

  renderMovies();
});


// =========================
// Continue
// =========================

continueBtn.addEventListener("click", () => {
  if (!selectedMovie || !selectedTime) return;

  const bookingData = {
    movieId: selectedMovie.id,
    movieTitle: selectedMovie.title,
    showtime: selectedTime
  };

  localStorage.setItem(
    "cinemaBooking",
    JSON.stringify(bookingData)
  );

  window.location.href = "seats.html";
});


// =========================
// Start
// =========================

renderMovies();