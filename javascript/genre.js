// 페이지 로드 후 실행되는 함수
window.onload = async function () {
  getData("event", "moviesDoc", "movies").then((data) => {
    console.log(data);
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

    const image = document.createElement("img");
    image.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    );
    image.setAttribute("alt", movie.title);
    image.classList.add("cardImg");
    card.appendChild(image);

    const title = document.createElement("p");
    title.textContent = movie.title;
    title.classList.add("movieTitle");
    card.appendChild(title);

    container.appendChild(card);
  });
}

// navi바 표시
const getNav = () => {
  fetch("../nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-nav").innerHTML = data;
    })
    .catch((error) => console.error("Error:", error));
};

getNav();
