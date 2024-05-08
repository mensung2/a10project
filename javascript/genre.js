// 네비바
const getNavs = () => {
  fetch("../nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("external-content").innerHTML = data;
    })
    .catch((error) => console.error("Error:", error));
};

getNavs();

// 페이지 로드 후 실행되는 함수
window.onload = async function () {
  getData("event", "moviesDoc", "movies").then((data) => {
    moviesGenre(data);
  });
};

function moviesGenre(data) {
  const actionMovies = [];
  const comedyMovies = [];
  const romanceMovies = [];
  const horrorMovies = [];

  // 영화 데이터를 장르에 따라 분류
  data.forEach((item) => {
    if (item.genre_ids.includes(28)) {
      actionMovies.push(item);
    }
    if (item.genre_ids.includes(35)) {
      comedyMovies.push(item);
    }
    if (item.genre_ids.includes(10749)) {
      romanceMovies.push(item);
    }
    if (item.genre_ids.includes(27)) {
      horrorMovies.push(item);
    }
  });

  // 분류된 영화 데이터를 화면에 출력
  displayMovies(actionMovies, "action-cards");
  displayMovies(comedyMovies, "comedy-cards");
  displayMovies(romanceMovies, "romance-cards");
  displayMovies(horrorMovies, "horror-cards");
}

function displayMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  movies.slice(0, 4).forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const link = document.createElement("a");
    link.setAttribute("href", `detailReview.html?id${movie.id}`);

    const image = document.createElement("img");
    image.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    );
    image.setAttribute("alt", movie.title);
    image.classList.add("cardImg");
    link.appendChild(image);
    card.appendChild(link);

    const title = document.createElement("p");
    title.textContent = movie.title;
    title.classList.add("movieTitle");
    card.appendChild(title);

    container.appendChild(card);
  });
}

// 카드 poster 클릭시 상세페이지 이동
const updateMovieList = (movies) => {
  const container = document.getElementById("movie-cards");
  container.innerHTML = "";

  movies.forEach((movie) => {
    const title = movie.title;
    const voteAverage = movie.vote_average;
    const overview = movie.overview;
    const posterPath = movie.poster_path;
    const id = movie.id;

    const card = document.createElement("div");
    card.classList.add("movie_card");
    card.id = id;

    card.innerHTML = `
       <div>
          <a id = 'clickevent 'href = 'detailReview.html?id${id}'>
          <img src="https://image.tmdb.org/t/p/w200${posterPath}" id="poster" alt="${title}" /></a>
          <h3>${title}</h3>
          <p id="score">★ ${voteAverage}</p>
          <p id="content">${overview}</p>
       </div>
      `;
    container.appendChild(card);
  });
};
