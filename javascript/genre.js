// 카드 클릭을 처리하고 상세 리뷰 페이지로 리다이렉트하는 함수
const handleCardClick = (movieId) => {
  window.location.href = `detailReview.html?id=${movieId}`;
};

// 장르 섹션에 영화를 표시하는 함수
function displayMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  movies.slice(0, 4).forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("card");

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

    // 각 카드에 클릭 이벤트 리스너를 추가합니다.
    card.addEventListener("click", () => {
      // 클릭 시 해당 영화의 ID를 사용하여 handleCardClick 함수를 호출합니다.
      handleCardClick(movie.id);
    });

    container.appendChild(card);
  });
}

// 영화 데이터를 로드하고 장르별로 표시하는 함수
window.onload = async function () {
  getData("event", "moviesDoc", "movies").then((data) => {
    console.log(data);
    moviesGenre(data);
  });
};

// 영화를 장르별로 분류하고 표시하는 함수
function moviesGenre(data) {
  const actionMovies = [];
  const comedyMovies = [];
  const romanceMovies = [];
  const horrorMovies = [];

  // 장르별로 영화를 분류합니다.
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

  // 분류된 영화를 표시합니다.
  displayMovies(actionMovies, "action-cards");
  displayMovies(comedyMovies, "comedy-cards");
  displayMovies(romanceMovies, "romance-cards");
  displayMovies(horrorMovies, "horror-cards");
}
