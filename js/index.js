let KINOLAR = movies.slice(0, 56);
const elForm = document.querySelector(".js-form");
const elCategorySelect = document.querySelector(".category-select");
const elSearchInput = document.querySelector(".js-search");
const elSortSelect = document.querySelector(".js-sort-select");
const elList = document.querySelector(".list");
const elCardTemplate = document.getElementById("card-template").content;
const elPageCount = document.querySelector(".page-count");

const elPrevBtn = document.querySelector(".prev-btn");
const elNextBtn = document.querySelector(".next-btn");

let limit = 8;
let page = 1;
let maxPageCount = Math.ceil(KINOLAR.length / limit);

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
    let categoryOption = document.createElement("option");

    categoryOption.textContent = category;

    categoryOption.value = category;

    elCategorySelect.appendChild(categoryOption);
  });
};

renderCategories();

let renderMovies = (arr) => {
  elList.innerHTML = null;
  arr.forEach((movie) => {
    const elCard = elCardTemplate.cloneNode(true);

    let img = elCard.querySelector(".card-img-top");
    let title = elCard.querySelector(".card-title");

    title.textContent = movie.title;
    img.src = movie.bigPoster;

    elList.appendChild(elCard);
  });
};

let handleFilter = (evt) => {
  evt.preventDefault();
  let filteredMovies = [];

  let category = elCategorySelect.value;
  let searchValue = elSearchInput.value.trim();
  let sort = elSortSelect.value;

  let regex = new RegExp(searchValue, "gi");

  if (category === "all") {
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

  if (page === 0) {
    elPrevBtn.disabled = true;
  }
};

elPrevBtn.addEventListener("click", handlePrevPage);
elNextBtn.addEventListener("click", handleNextPage);
elForm.addEventListener("submit", handleFilter);
renderMovies(KINOLAR.slice(0, 8));
