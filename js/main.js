const API_KEY = "3194e30b";
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;
const IMG_URL = `http://img.omdbapi.com/?apikey=${API_KEY}`;

const elForm = document.querySelector("[data-movie-form]");
const elList = document.querySelector("[data-movie-list]");
const elModal = document.querySelector("[data-movie-modal-open]");
const elModalContent = document.querySelector("[data-movie-content]")

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formdata = new FormData(elForm);
  const name = formdata.get("name");
  searchMovies(name);
});

async function searchMovies(quary) {
  const res = await fetch(`${API_URL}&s=${quary}`);
  const searchResult = await res.json();

  renderMovies(searchResult.Search);
}

function renderMovies(movies) {
  elList.innerHTML = "";
  let html = "";
  movies.forEach((movie) => {
    html += `<div class="cinema"><img class="cinema__img" width="50" src="${movie.Poster}" alt="${movie.Title}"/>
    <div class="d-flex align-items-center justify-content-between">
    <h2>${movie.Title}-${movie.Year} </h2>
    <button type="button" data-movie-modal-open="#test-modal" data-movie-id="${movie.imdbID}" class="btn cinema__btn"><img class="cinema__btn-img" src="./img/more.svg" alt="more"></button>
    </div>
        </div>`;

    // elList.append(fillModal(movie));
  });

  elList.innerHTML = html;
}
document.addEventListener("click", (evt) => {
  onOpenModal(evt);
  onCloseOutsideClick(evt);
  onModalCloseClick(evt);
});

function onOpenModal(evt) {
  const el = evt.target.closest("[data-movie-modal-open]");

  if (!el) return;

  const modalSel = el.dataset.movieModalOpen;
  const movieId = el.dataset.movieId

  fillModal(movieId)
  document.querySelector(modalSel).classList.add("show");
}

function onCloseOutsideClick(evt) {
  const el = evt.target

  if (!el.matches("[data-movie-modal]")) return;

  el.classList.remove("show");
}

function onModalCloseClick(evt) {
  const el = evt.target.closest("[data-movie-modal-close]");

  if (!el) return;

  el.parentElement.parentElement.classList.remove("show");
}

async function fillModal(movieId) {
  const movie = await getMovie(movieId);

 elModalContent.querySelector("[data-title]").textContent = movie.Title;
 elModalContent.querySelector("[data-year]").textContent = movie.Year;
 elModalContent.querySelector("[data-rated]").textContent = movie.Rated;
 elModalContent.querySelector("[data-released]").textContent = movie.Released;
 elModalContent.querySelector("[data-runtime]").textContent = movie.Runtime;
 elModalContent.querySelector("[data-genre]").textContent = movie.Genre;
 elModalContent.querySelector("[data-director]").textContent = movie.Director;
 elModalContent.querySelector("[data-metascore]").textContent = movie.Metascore;
 elModalContent.querySelector("[data-imdbrating]").textContent = movie.imdbrating;
 elModalContent.querySelector("[data-type]").textContent = movie.Type;
 elModalContent.querySelector("[data-id]").textContent = movie.imdbID;
}
