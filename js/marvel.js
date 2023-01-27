// PRIVATEKEY = `aaa48316379abee3e253d565d626c799a8958a41`
// PUBLICKEY = `2916c9e0417f61774e61f7a9ba72d384`

const apikey = "2916c9e0417f61774e61f7a9ba72d384";
const ts = "25/01/2023, 05:58:15";
const hash = "4c1b759a2e5f993858c77f6c20f934b6";
const url = `https://gateway.marvel.com:443/v1/public/characters?apikey=${apikey}&ts=${ts}&hash=${hash}&limit=30`;

const elFormMarvel = document.querySelector("[data-movie-form]");
const elListMarvel = document.querySelector("[data-marvel-list]");
elModal;
const elMarvelModalContent = document.querySelector("[data-marvel-content]");
const elMarvelAbout = document.querySelector("[data-marvel-about]");

elFormMarvel.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formdata = new FormData(elFormMarvel);
  const name = formdata.get("input-name");
  searchMarvel(name);
});

async function searchMarvel(quary) {
  const res = await fetch(`${url}&nameStartsWith=${quary}`);
  const searchResult = await res.json();
  renderMarvel(searchResult.data.results);
  // renderPaginetionMarvel(Math.ceil(+searchResult.totalResults / 10));
}

async function getMovieMarvel(movieId) {
  const res = await fetch(`${url}&id=${movieId}`);

  return await res.json();
}

function renderMarvel(movies) {
  elListMarvel.innerHTML = "";
  let html = "";
  movies.forEach((movie) => {
    html += `
    <div class="marvel">
  <button
    type="button"
    data-movie-id="${+movie.id}"
    data-marvel-modal-open="#test-marvel"
  >
    <img
      src="${movie.thumbnail.path}.${movie.thumbnail.extension}"
      alt="${movie.name}"
    />
  </button>
</div>
    `;
  });

  elListMarvel.innerHTML = html;
}

document.addEventListener("click", (evt) => {
  onOpenMarvelModal(evt);
  onCloseOutsideClickMarvel(evt);
  onMarvelModalCloseClick(evt);
});

function onOpenMarvelModal(evt) {
  const el = evt.target.closest("[data-marvel-modal-open]");

  if (!el) return;

  const modalSel = el.dataset.marvelModalOpen;
  const movieId = el.dataset.movieId;
  const elModal = document.querySelector(modalSel);

  fillMarvelModal(movieId);

  elModal.classList.add("show");
}

function onCloseOutsideClickMarvel(evt) {
  const el = evt.target;

  if (!el.matches("[data-marvel-modal]")) return;

  el.classList.remove("show");
}

function onMarvelModalCloseClick(evt) {
  const el = evt.target.closest("[data-marvel-modal-close]");

  if (!el) return;

  el.parentElement.parentElement.classList.remove("show");
}

// function onPageClick(evt) {
//   const el = evt.target.closest("[data-movie-page]");

//   if (!el) return;
//   evt.preventDefault();
// }

async function fillMarvelModal(movieId) {
  const movie = await getMovieMarvel(movieId);
  const marvelCharacters = movie.data.results[0];
  let html = "";

  html += `<div class="d-flex justify-content-evenly">
            <div>
              <img class="marvel__modal-img" src="${marvelCharacters.thumbnail.path}.${marvelCharacters.thumbnail.extension}" alt="${marvelCharacters.name}">
            </div>
            <div class="marvel__modal-content">
              <h3 class="marvel__modal-name">${marvelCharacters.name}</h3>
              <p class="marvel__modal-description">${marvelCharacters.description}</p>
            </div>
          </div>`;
  elMarvelAbout.innerHTML = html;
}
