import { firebaseConfig } from "./firebase.js"; // firebase.js에서 API 키를 가져옵니다.

// API 요청을 보낼 URL(요건 어디서??)

// API 요청에 사용될 옵션
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTE1ZGI5NjFjY2UyZDQ1YjM1N2Y1MDdmOGExMDEwYSIsInN1YiI6IjY2Mjc2ZTRkY2I2ZGI1MDE2M2FmOGRlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AumeVPf1je9qpW9jXrLZ-5ZzGR32is2q861ifuW91cY",
  },
};

fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));

// 여기 아래 잘못했음.. 장르를 뽑아오는지 몰라서 다시 해야함
// Firebase에서 데이터 가져오기
const firebaseData = getData("event", "moviesDoc", "movies");

// 페이지 로드 후 실행되는 함수
window.onload = async function () {
  const data = await firebaseData;

  // 각 장르별로 데이터를 가져와서 HTML에 표시 ==> 이것도 필터로 변경
  const genres = ["액션", "코미디", "로맨스", "공포"];
  genres.forEach((genre) => {
    displayMoviesByGenre(genre, data);
  });
};

// 각 장르별로 영화 데이터를 HTML에 표시하는 함수
function displayMoviesByGenre(genre, data) {
  const section = document.getElementById(genre.toLowerCase());
  const cardsContainer = section.querySelector(".cards");

  // 해당 장르의 데이터 필터링==> id일치로 가야하는데??
  const genreData = data.filter((item) => item.genre === genre);

  // 최대 4개의 영화 카드 생성
  genreData.slice(0, 4).forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // 영화 포스터 이미지 생성
    const img = document.createElement("img");
    img.classList.add("cardImg");
    img.src = movie.poster_path;
    card.appendChild(img);

    // 영화 제목 생성
    const title = document.createElement("p");
    title.classList.add("movieTitle");
    title.textContent = movie.title;
    card.appendChild(title);

    // 카드를 카드 컨테이너에 추가
    cardsContainer.appendChild(card);
  });
}
