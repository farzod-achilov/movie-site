const API_KEY = "3194e30b";
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;
const IMG_URL = `http://img.omdbapi.com/?apikey=${API_KEY}`;

const elForm = document.querySelector("[data-movie-form]");
const elList = document.querySelector("[data-movie-list]");
const elNameInput = document.querySelector("[data-input-name]");
const elPagination = document.querySelector("[data-modal-pagination]");
const elModal = document.querySelector("[data-movie-modal-open]");
const elModalContent = document.querySelector("[data-movie-about]");
const formData = new FormData(elForm);

elNameInput.addEventListener(
  "keyup",
  debounce((evt) => onInputKeyUp(evt), 300)
);

elForm.addEventListener("change", (evt) => {
  evt.preventDefault();

  if (elNameInput.value.length < 3) return;

  searchMovies();
});

document.addEventListener("click", (evt) => {
  onOpenModal(evt);
  onCloseOutsideClick(evt);
  onModalCloseClick(evt);
  onPageClick(evt);
});

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
function onInputKeyUp(evt) {
  if (elNameInput.value.length < 3) return;

  searchMovies();
}

async function searchMovies(page = 1) {
  const { s, y, type } = getFormData();

  elList.innerHTML = `<img src="./img/Bean Eater-1s-200px.svg" alt="Loading"/>`;

  let res = await fetch(`${API_URL}&s=${s}&page=${page}&y=${y}&type=${type}`);
  let searchResult = await res.json();

  if (searchResult.Error) {
    console.log(searchResult.Error);
    return;
  }

  renderMovies(searchResult.Search);

  renderPagination(Math.ceil(+searchResult.totalResults / 10), page);
}

async function getMovie(movieId) {
  let res = await fetch(`${API_URL}&i=${movieId}`);
  return await res.json();
}

function renderMovies(movies) {
  elList.innerHTML = "";
  let html = "";
  movies.forEach((movie) => {
    html += `<div class="cinema"><img class="cinema__img"   height= "440px" width="50" src="${movie.Poster}" alt="${movie.Title}"/>
    <div class="d-flex align-items-center justify-content-between">
    <button type="button" data-movie-modal-open="#test-modal" data-movie-id="${movie.imdbID}" class="btn cinema__btn"><img class="cinema__btn-img" src="./img/more.svg" alt="more">
    </button>
    </div>
        </div>`;
  });

  elList.innerHTML = html;
}

function renderPagination(totalPages, page) {
  elPagination.innerHTML = "";
  let html = "";

  html += ` <li class="page-item${+page === 1 ? " disabled" : ""} ">
  <a class="page-link" data-movie-page=${+page - 1} href="?page=${
    +page - 1
  }" tabindex="-1" aria-disabled="true">Previous</a>
</li>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item${
      +page === i ? " active" : ""
    } "><a class="page-link" data-movie-page=${i} href="?page=${i}">${i}</a></li>`;
  }

  html += ` <li class="page-item${+page === totalPages ? " disabled" : ""}">
  <a class="page-link" data-movie-page=${+page + 1} href="?page=${
    +page + 1
  }"  tabindex="-1" aria-disabled="true">Next</a>
</li>`;

  elPagination.innerHTML = html;
}

function getFormData() {
  const formData = new FormData(elForm);

  return {
    s: formData.get("input-name"),
    y: formData.get("input-year"),
    type: formData.get("select-type"),
  };
}

function onModalCloseClick(evt) {
  let el = evt.target.closest("[data-movie-modal-close]");

  if (!el) return;

  el.parentElement.parentElement.classList.remove("show");
}

async function onOpenModal(evt) {
  const el = evt.target.closest("[data-movie-modal-open]");

  if (!el) return;

  let movieId = el.dataset.movieId;

  await fillModal(movieId);

  let modalSelector = el.dataset.movieModalOpen;
  document.querySelector(modalSelector).classList.add("show");
}

function onCloseOutsideClick(evt) {
  const el = evt.target;

  if (!el.matches("[data-movie-modal]")) return;

  el.classList.remove("show");
}

function onPageClick(evt) {
  const el = evt.target.closest("[data-movie-modal-close]");

  if (!el) return;

  evt.preventDefault();

  searchMovies(el.dataset.movieModalClose);
}

async function fillModal(movieId) {
  const movie = await getMovie(movieId);
  let html = "";

  html += `
  <div class="movie__modal">
  <div class="movie__modal-img">
    <img src="${movie.Poster}" alt="${movie.Title}" />
  </div>
  <div>
    <h2 class="movie__modal-name">${movie.Title}</h2>
    <p>Actors: ${movie.Actors}</p>
    <p>Country: ${movie.Country}</p>
    <p>Awards: ${movie.Awards}</p>
    <p>Language: ${movie.Language}</p>
    <p>Language: ${movie.Language}</p>
    <p>Language: ${movie.Released}</p>
    <p>Genre: ${movie.Genre}</p>
    <p>Director: ${movie.Director}</p
  </div>
</div>
`;
  console.log(movie);
  elModalContent.innerHTML = html;
}
