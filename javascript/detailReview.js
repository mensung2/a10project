const apiUrl =
  "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZWJhNTBjM2QzYmNkM2MwYTFlNTY5ODQ3MjVjOGI5YiIsInN1YiI6IjY2Mjc5YzdmNjNkOTM3MDE2NDczNjE0YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cFMshiEk0fPnYsxW-pIEyfKvjmANU7gtPKy8-zEO-OE",
  },
};

const fetchThisMovie = async () => {
  fetch(apiUrl, options)
    .then((response) => response.json())
    .then((response) => {
      const movies = response.results;
      // id와 동일한 데이터만 화면에 로드
      loadThisMovie(movies);

    })
    .catch((err) => console.error(err));
};

fetchThisMovie();

const prevId = window.location.search;
const thisPageId = prevId.substr(3);
console.log(prevId);
console.log(thisPageId);

const loadThisMovie = (movies) => {
  const container = document.getElementById("detail");
  const card = document.createElement("div");
  card.classList.add("movie_card");
  console.log(movies);

  // movie.id는 넘버타입이고, thisPageId는 스트링이라 오류가 발생해 형변환을 해주었다.
  movies.forEach((movie) => {
    const selectedMovie = movie.id === Number(thisPageId);

    if(selectedMovie) {
      card.innerHTML = `  
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" id="poster" alt="${movie.title}" /></a>           
          <div class="infoBox">
            <h3 id="title">${movie.title}</h3>
            <p id="score">★ ${movie.vote_average}</p>
            <p id="genre">장르: ${movie.genre_ids}</p>
            <p id="releaseDate">개봉일: ${movie.release_date}</p>
            <p id="content">${movie.overview}</p>          
          </div>`;
      container.appendChild(card);      
    }
  });
};

//container.innerHTML = "";  //
//const selectedMovie = movies.find(movie => movie.id === thisPageId);
//movies는 배열인데, 배열 속 요소 하나하나가 객체라서 배열 메서드인 find가 먹히지 않음.
//console.log(selectedMovie);
