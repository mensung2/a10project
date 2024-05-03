class Movies {
  #movies;
  #context;
  constructor() {
    this.#movies = new Map();
    this.#context = [
      {
        ID: 1,
        password: 1234,
        name: "Joseph",
        title: "쿵푸팬더 4",
        content: "너무 재밌어요!",
        voteAverage: 10,
        Date: new Date("2024-04-21"),
      },
      {
        ID: 2,
        password: 1234,
        name: "Jiin",
        title: "고질라 X 콩: 뉴 엠파이어",
        content: "흠...그정돈가",
        voteAverage: 5,
        Date: new Date("2024-04-25"),
      },
    ];
  }

  async initialize() {
    await this.#fetchMovieInfo();
    this.#renderMovieCards(this.#movies);
  }

  getMoviesInfo() {
    return this.#movies;
  }

  async #fetchMovieInfo() {
    let pageNum = 1;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMmQ0Nzk2MDhlMTQyMzllYWJlN2FhNjhjOGVkMTQ1ZiIsInN1YiI6IjY2MjcwNzRmMmRkYTg5MDE4N2U0NWFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E20d8N0N0gg-zMHnAxjXvz6vV51ClYT-dZsc5lYY25g",
      },
    };
    let datas = [];
    try {
      while (true) {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?region=KR&language=ko-KR&page=${pageNum}`,
          options
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        pageNum++;
        if (data.results.length === 0) break;

        datas = datas.concat(...data.results);
      }

      this.#parseMovieData(datas);
    } catch (error) {
      console.error("Error fetching movies:", error.message);
    }
  }

  #findMovieContext() {
    this.#movies.forEach((movieItem) => {
      const context = this.#context.filter((item) => {
        return item.title === movieItem.title;
      });
      if (context) movieItem.context = context[0];
    });
  }

  #parseMovieData(results) {
    console.log(results);
    // 아래는 기준 별 정렬
    // results.sort((a, b) => b.popularity - a.popularity); 유명도
    // results.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)); 날짜
    // vote average는 같은 값이 너무 많음.

    results.forEach((item) => {
      if (item.overview !== "" && item.poster_path !== null) {
        this.#movies.set(item.poster_path, item);
      }
    });
    this.#findMovieContext();
    this.#makeContext();
  }

  // 영화 리뷰를 생성 시 미리 생성된 영화 배열의 인덱스 값에 해당 context를 덮어씌어준다.
  // 이때 생성되는 idx로 각 영화마다 여러 리뷰가 있을텐데 이 부분을 반복돌릴 수 있도록 중복 생성을 안시킬 수 있다.
  // 메인 페이지에서는 this.#movies 데이터의 context부분을 가지고 표현을 해주게 되면 끝이다.

  #makeContext() {
    let movieIndex = 0;

    this.#movies.entries().forEach(([key, value], idx) => {
      if (value.title === "쿵푸팬더 4") return (value.context = "음냐링");
    });

    console.log(this.#movies);
  }

  #renderMovieCards(movies) {
    const container = document.getElementById("movie-list");
    container.innerHTML = "";
    movies.forEach((value) => {
      const card = document.createElement("div");
      card.classList.add("movie-card");

      const posterImg = document.createElement("img");
      posterImg.src = `https://image.tmdb.org/t/p/w500${value.poster_path}`;
      posterImg.alt = value.title;
      posterImg.classList.add("movie-poster");

      const title = document.createElement("h2");
      title.textContent = value.title;
      title.classList.add("movie-title");

      const overview = document.createElement("p");
      overview.textContent = value.overview;
      overview.classList.add("movie-overview");

      card.appendChild(posterImg);
      card.appendChild(title);
      card.appendChild(overview);

      container.appendChild(card);
    });
  }

  searchMovies(keyword) {
    const filteredMovies = new Map();
    let isShowing = false;
    this.#movies.forEach((movie, poster_path) => {
      if (movie.title.toLowerCase().includes(keyword.trim().toLowerCase())) {
        //같은 이름의 다른 영화가 있더라도 데이터가 덮어 씌어진다.
        console.log(movie);
        filteredMovies.set(poster_path, movie);
        isShowing = true;
      }
    });
    if (isShowing === false) alert("해당 영화는 현재 상영중이지 않습니다.");
    if (filteredMovies.size === 0) return this.#renderMovieCards(this.#movies);

    return this.#renderMovieCards(filteredMovies);
  }
}

// const movies = new Movies();
// movies.initialize();

// const searchInput = document.getElementById("search-input");
// const searchButton = document.getElementById("search-button");
// searchInput.addEventListener("keyup", (e) => {
//   const keyword = e.target.value;
//   if (e.keyCode === 13) {
//     movies.searchMovies(keyword);
//   }
// });

// searchButton.addEventListener("click", (e) => {
//   const keyword = searchInput.value;

//   movies.searchMovies(keyword);
// });
