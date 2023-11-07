// Consts
const apikey = "1bccf589f75228bfd8642a739bcba287";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPath = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,

  fetchMoviesList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  // https://api.themoviedb.org/3/discover/movie?api_key=7543524441a260664a97044b8e2dc621&with_genres=12

  fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  // searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`
};

// Boots up the app
function init() {
  fetchTrendingMovies();
  fetchAndBuilAllSections();
}

function fetchTrendingMovies() {
  fetchAndbuildMovieSection(apiPath.fetchTrending, "Trending Now")
    .then(list => {
      buildBannerSection(list[5]);
    }).catch(err => {
      console.error(err);
    });
}

function buildBannerSection(movies){
  const bannerCont = document.getElementById('banner-section');
  bannerCont.style.backgroundImage = `url('${imgPath}${movies.backdrop_path}')`;

  const div = document.createElement('div');
  div.innerHTML = `
            <h2 class="banner-title">${movies.title}</h2>
            <p class="banner-info">Trending in movies | Released - ${movies.release_date}</p>
            <p class="banner-overview"> ${movies.overview}</p>
            <div class="action-button-cont">
                <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp; &nbsp; Play</button>
                <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg>  &nbsp;&nbsp; More Info</button>
            </div>
  `;
  div.className ="banner-content container";

  bannerCont.append(div);
}

function fetchAndBuilAllSections() {
  fetch(apiPath.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        // categories.slice(0,2).forEach(category => {
        categories.forEach((category) => {
          fetchAndbuildMovieSection(
            apiPath.fetchMoviesList(category.id),
            category.name
          );
        });
      }
      // console.log(categories);
    })
    .catch((err) => console.log(err));
}

function fetchAndbuildMovieSection(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      // console.table(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMovieSection(movies, categoryName);
      }
      return movies;
    })
    .catch((err) => console.error(err));
}

function buildMovieSection(list, categoryName) {
  console.log(list, categoryName);

  const moviesCont = document.getElementById("movies-cont");

  const moviesListHTML = list
    .map((item) => {
      return `
      <img class="movies-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}">
      `;
    })
    .join("");

  const moviesSectionHTML = `
        <h2 class="movies-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>
    `;

  console.log(moviesSectionHTML);

  const div = document.createElement("div");
  div.className = "movie-section";
  div.innerHTML = moviesSectionHTML;

  //append html into HTML Page Movie Container
  moviesCont.appendChild(div);
}

window.addEventListener("load", function () {
  init();
});
