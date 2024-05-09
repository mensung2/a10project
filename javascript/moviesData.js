// import postData from "./firebase";
class Movies {
  #movies;
  constructor() {
    this.#movies = new Map();
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

      getData("event", "moviesDoc", "movies").then((data) =>
        data
          ? console.log("data가 있습니다.")
          : (postData("event", "moviesDoc", this.#movies, "movies"),
            this.#fetchMovieInfo(),
            console.log("재귀"))
      );
    } catch (error) {
      console.error("Error fetching movies:", error.message);
    }
  }

  #parseMovieData(data) {
    data.forEach((item) => {
      if (item.overview !== "" && item.poster_path !== null) {
        this.#movies.set(item.poster_path, item);
      }
    });
  }
}

const movies = new Movies();
movies.initialize();
