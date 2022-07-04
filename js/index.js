let KINOLAR = movies.slice(0, 56);
const elForm = document.querySelector('.js-form');
const elCategorySelect = document.querySelector('.category-select');
const elSearchInput = document.querySelector('.js-search');
const elSortSelect = document.querySelector('.js-sort-select');
const elList = document.querySelector('.list');
const elCardTemplate = document.getElementById('card-template').content;
const elPrevBtn = document.querySelector('.prev-btn');
const elNextBtn = document.querySelector('.next-btn');
const elPageCount = document.querySelector('.page-count');
const elBookmarkTemplate = document.getElementById('bookmark-template').content;
const elBookmarkList = document.querySelector('.bookmark-list');
const elModalTitle = document.querySelector('.modal-title');
const elModalSummary = document.querySelector('.modal-summary');
const elLoader = document.querySelector('.js-loading');

let limit = 8;
let page = 1;
let maxPageCount = Math.ceil(KINOLAR.length / limit);
let bookmarks = localStorage.getItem('bookmarks')
  ? JSON.parse(localStorage.getItem('bookmarks'))
  : [];

const sortFunctions = {
  az: (a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    } else {
      return 1;
    }
  },

  za: (a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return 1;
    } else {
      return -1;
    }
  },

  hl: (a, b) => {
    if (a.imdbRating < b.imdbRating) {
      return 1;
    } else {
      return -1;
    }
  },

  lh: (a, b) => {
    if (a.imdbRating < b.imdbRating) {
      return -1;
    } else {
      return 1;
    }
  },

  no: (a, b) => {
    if (a.year < b.year) {
      return -1;
    } else {
      return 1;
    }
  },

  on: (a, b) => {
    if (a.year < b.year) {
      return 1;
    } else {
      return -1;
    }
  },
};

let getMovieGenres = (kinolar) => {
  let categories = [];

  kinolar.forEach((kino) => {
    kino.categories.forEach((category) => {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    });
  });

  return categories;
};

let renderCategories = () => {
  let allCategories = getMovieGenres(KINOLAR);

  allCategories.forEach((category) => {
    let categoryOption = document.createElement('option');

    categoryOption.textContent = category;

    categoryOption.value = category;

    elCategorySelect.appendChild(categoryOption);
  });
};

renderCategories();

let elWrapper = document.createDocumentFragment('');

let renderMovies = (arr) => {
  elLoader.style.display = 'none';
  elList.innerHTML = null;
  arr.forEach((movie) => {
    const elCard = elCardTemplate.cloneNode(true);

    let img = elCard.querySelector('.card-img-top');
    let title = elCard.querySelector('.card-title');
    let bookmark = elCard.querySelector('.js-bookmark');
    let more = elCard.querySelector('.js-more');

    img.src = movie.bigPoster;
    title.textContent = movie.title;
    bookmark.dataset.id = movie.imdbId;
    more.dataset.id = movie.imdbId;

    elWrapper.appendChild(elCard);
  });
  elList.appendChild(elWrapper);
};

let handleFilter = (evt) => {
  evt.preventDefault();
  let filteredMovies = [];

  let category = elCategorySelect.value;
  let searchValue = elSearchInput.value.trim();
  let sort = elSortSelect.value;

  let regex = new RegExp(searchValue, 'gi');

  if (category === 'all') {
    filteredMovies = KINOLAR;
  } else {
    filteredMovies = KINOLAR.filter((movie) =>
      movie.categories.includes(category)
    );
  }

  filteredMovies = filteredMovies.filter((movie) => movie.title.match(regex));

  filteredMovies.sort(sortFunctions[sort]);

  renderMovies(filteredMovies);
};

elPageCount.textContent = page;

let handleNextPage = () => {
  page += 1;

  if (page <= maxPageCount) {
    elPageCount.textContent = page;
    renderMovies(KINOLAR.slice(limit * (page - 1), page * limit));
  }

  if (page === maxPageCount) {
    elNextBtn.disabled = true;
  } else {
    elPrevBtn.disabled = false;
    elNextBtn.disabled = false;
  }
};

elPrevBtn.disabled = true;

let handlePrevPage = () => {
  page -= 1;
  if (page > 0) {
    elPageCount.textContent = page;
    renderMovies(KINOLAR.slice(limit * (page - 1), page * limit));
  }

  if (page === 1) {
    elPrevBtn.disabled = true;
  }
};

let bookmarkWrapper = document.createDocumentFragment();

let renderBookmarks = (arr) => {
  arr.forEach((bookmark) => {
    let bookmarkClone = elBookmarkTemplate.cloneNode(true);

    let title = bookmarkClone.querySelector('.bookmark-title');

    title.textContent = bookmark.title;

    bookmarkWrapper.appendChild(bookmarkClone);
  });

  elBookmarkList.innerHTML = null;

  elBookmarkList.appendChild(bookmarkWrapper);
};

let handleListEvent = (evt) => {
  if (evt.target.matches('.js-bookmark')) {
    const foundMovie = KINOLAR.find(
      (movie) => movie.imdbId === evt.target.dataset.id
    );

    let bookmarkMovie = bookmarks.find(
      (bookmark) => bookmark.imdbId === evt.target.dataset.id
    );

    if (!bookmarkMovie) {
      bookmarks.push(foundMovie);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    renderBookmarks(bookmarks);
  } else if (evt.target.matches('.js-more')) {
    const foundMovie = KINOLAR.find(
      (movie) => movie.imdbId === evt.target.dataset.id
    );

    elModalTitle.textContent = foundMovie.title;
    elModalSummary.textContent = foundMovie.summary;
    console.log(foundMovie);
  }
};

elList.addEventListener('click', handleListEvent);

elPrevBtn.addEventListener('click', handlePrevPage);
elNextBtn.addEventListener('click', handleNextPage);
elForm.addEventListener('submit', handleFilter);
renderMovies(KINOLAR.slice(0, 8));
