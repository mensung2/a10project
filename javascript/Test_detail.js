// API url
const apiUrl =
  "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1";

// API 요청에 사용
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZWJhNTBjM2QzYmNkM2MwYTFlNTY5ODQ3MjVjOGI5YiIsInN1YiI6IjY2Mjc5YzdmNjNkOTM3MDE2NDczNjE0YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cFMshiEk0fPnYsxW-pIEyfKvjmANU7gtPKy8-zEO-OE",
  },
};

// 영화 데이터 가져와서 화면에 보여주는 fetch 함수
const fetchShowMvlist = async () => {
  await fetch(apiUrl, options)
    .then((response) => response.json())
    .then((data) => {
      const movies = data.results;
      updateMovieList(movies);
      searchBtn.addEventListener("click", searchMovies);
    })
    .catch((err) => console.error("데이터 불러오기 중 에러 발생!"));
};

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

    // 이미지 클릭하면 해당 영화의 id값을 가진 페이지로 이동하도록 <a> 태그 추가
    card.innerHTML = `
     <div>  
        <a href = 'detailReview.html?id${id}'> 
        <img src="https://image.tmdb.org/t/p/w200${posterPath}" id="poster" alt="${title}" /></a>
        <h3>${title}</h3>
        <p id="score">★ ${voteAverage}</p>
        <p id="content">${overview}</p>               
     </div>
    `;
    container.appendChild(card);
  });
};

const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");

const searchMovies = () => {
  const keyword = searchBox.value.trim().toLowerCase();  
  const cards = document.querySelectorAll(".movie_card");
  cards.forEach((card) => {
    const titleElement = card.querySelector("h3");
    const title = titleElement.textContent.trim().toLowerCase();

    if (title.includes(keyword)) {
      card.style.display = "block";
    } else {    
      card.style.display = "none";
    }
  });
};

// searchBox.addEventListener("keyup", (e) => {
//   if(e.key === 'Enter'){
//     document.getElementById("searchBtn").click();
//   }
// })

fetchShowMvlist();
