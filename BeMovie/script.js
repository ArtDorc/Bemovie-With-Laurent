//TMDB

// const API_KEY = 'baf5d4b4e3feef9b4b6370f738fd0c45';
// const BASE_URL = 'https://api.themoviedb.org/3';

//   fetch('https://api.themoviedb.org/3/authentication', options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));

const options = {
  method: "GET",
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYWY1ZDRiNGUzZmVlZjliNGI2MzcwZjczOGZkMGM0NSIsInN1YiI6IjY2NmIwYzI4MDQwODAyNWQ0NGU5NGVhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.t3XORfyCmyLrcI1xbp0CU_o9kA5x1TsJmLBcj3VFQDk",
  },
};

const fetchAndPopulateSwiper = (index, genreFilter = null) => {
  fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      let movies = data.results;
      const baseImageUrl = "https://image.tmdb.org/t/p/w500";

      // Filter movies based on the provided genreFilter
      if (genreFilter) {
        movies = movies.filter((movie) =>
          movie.genre_ids.includes(genreFilter)
        );
      }

      const swiperWrapper = document.querySelectorAll(".swiper-wrapper")[index];
      swiperWrapper.innerHTML = ``;
      movies.forEach((movie) => {
        const title = movie.title;
        const posterPath = movie.poster_path;
        const posterUrl = `${baseImageUrl}${posterPath}`;
        const releaseDate = movie.release_date;
        const rating = movie.vote_average;
        const categories = movie.genre_ids.join(" / "); // Simplified categories, you might need a mapping of genre IDs to names

        const swiperSlide = document.createElement("div");
        swiperSlide.classList.add("swiper-slide");
        const hoverMovie = document.createElement("div");
        hoverMovie.classList.add("hoverMovie");

        swiperSlide.innerHTML = `
                  <div class="hoverMovie">
                      <h2 class="title">${title}</h2>
                      <p class="date">${new Date(releaseDate).getFullYear()}</p>
                      <p class="categories" id="genreFilmcard" >${categories}</p>
                      <div class="ratings">
                          <img src="star.svg" alt="">
                          <p class="rating">${rating}</p>
                      </div>
                  </div>
                  <img src="${posterUrl}" alt="${title}" width="50px">
              `;
        swiperWrapper.appendChild(swiperSlide);

        document
          .querySelectorAll(".swiper-slide")
          .forEach((item) => item.addEventListener("click", displayMovie));
        document
          .querySelectorAll(".swiper-slide")
          .forEach((item) => item.addEventListener("mouseenter", displayHover));
        document
          .querySelectorAll(".swiper-slide")
          .forEach((item) => item.addEventListener("mouseleave", closeHover));
      });
    })
    .catch((err) => console.error(err));
};

// Fetch genres to get the ID for comedy
fetch("https://api.themoviedb.org/3/genre/movie/list?language=en-US", options)
  .then((response) => response.json())
  .then((data) => {
    const genres = data.genres;
    const comedyGenre = genres.find(
      (genre) => genre.name.toLowerCase() === "comedy"
    );
    const comedyGenreId = comedyGenre ? comedyGenre.id : null;

    // Call the function for both swiper-wrappers
    fetchAndPopulateSwiper(1); // For popular movies
    if (comedyGenreId) {
      fetchAndPopulateSwiper(2, comedyGenreId); // For comedy movies
    }
  })
  .catch((err) => console.error(err));

// list ul 
let swiperP = document.getElementsByClassName("genresList")[0];

// click catégories
const clickGenres = function () {

  document.getElementById("category").innerHTML = this.innerHTML;
};

// li de l'ul
let liElements = swiperP.getElementsByTagName("li");

// event.LI
for (let i = 0; i < liElements.length; i++) {
  liElements[i].addEventListener("click", clickGenres);
}

