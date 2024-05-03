// import postData from "./firebase";
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
    // firbase에 넣을 땐 Custome된 Map객체는 post가 안된다.
    const firebaseData = getData("event", "moviesDoc", "movies");
    // firebaseData.then((data) => console.log("data", data));
    postData("event", "moviesDoc", results, "movies");
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
  }
}

const movies = new Movies();
movies.initialize();
// const data = movies.getMoviesInfo();
