const getMoviesData = () => {
  const firebaseData = getData("event", "moviesDoc", "movies");
  firebaseData.then((data) => {
    loadThisMovie(data);
  });
};

const clickWriteRvButton = () => {
  const writeRv = document.getElementById("writeRv");
  if (!writeRv) {
    return;
  }
  const writeRev = document.getElementsByClassName("writeRev")[0];
  writeRv.addEventListener("click", (e) => {
    e.preventDefault();
    writeRev.classList.remove("hidden");
    const modalBg = writeRev.parentElement;
    modalBg.classList.remove("hidden");
  });
};

const clickBackSpace = () => {
  const backSpace = document.getElementById("writeRev-backspace");
  if (!backSpace) {
    return;
  }
  backSpace.addEventListener("click", (e) => {
    e.preventDefault();
    writeRev.classList.add("hidden");
    writeRev.parentElement.classList.add("hidden");
  });
};

const clickRevRegist = () => {
  const revRegist = document.getElementById("revRegist");
  if (!revRegist) {
    return;
  }
  revRegist.addEventListener("click", (e) => {
    e.preventDefault();
    writeRev.classList.add("hidden");
    const modalBg = writeRev.parentElement;
    modalBg.classList.add("hidden");
  });
};

const clickEvents = () => {
  clickWriteRvButton();
  clickBackSpace();
  clickRevRegist();
};

const loadThisMovie = (movies) => {
  const container = document.getElementById("detail");
  const card = document.createElement("div");
  card.classList.add("movie_card");
  const prevId = window.location.search;
  const thisPageId = prevId.substr(3);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMWNjN2I5YzczNmEzZDg4MWMwNzUyZTVhNzI1NWE5YiIsInN1YiI6IjY2MjViODQ3MjU4ODIzMDE3ZDkyMmM2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.F6EJrBQXrAlZmikcp8C38XXxn8_UkWZ6PZw0NA9z0a0",
    },
  };

  fetch(`https://api.themoviedb.org/3/movie/${thisPageId}?language=ko-KR`, options)
    .then((movie) => movie.json())
    .then((movie) => {
      const genre = movie.genres;
      const genreList = [];
      genre.forEach((e) => {
        genreList.push(e.name);
      });

      const movieGenre = genreList.join(", ");

      // movie.id는 넘버타입이고, thisPageId는 스트링이라 오류가 발생해 형변환을 해주었다.
      const selectedMovie = movie.id === Number(thisPageId);
      //
      if (selectedMovie) {
        card.innerHTML = `  
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" id="poster" alt="${movie.title}" /></a>           
          <div class="infoBox">
            <h3 id="title">${movie.title}</h3>
            <p id="score">★ ${movie.vote_average}</p>
            <p id="genre">장르: ${movieGenre}</p>
            <p id="releaseDate">개봉일: ${movie.release_date}</p>
            <p id="content">${movie.overview}</p>          
          </div>`;
        container.appendChild(card);
      }
    })
    .catch((err) => console.error(err));
};

const getNav = () => {
  fetch("../nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-nav").innerHTML = data;
    })
    .catch((error) => console.error("Error:", error));
};

clickEvents();
getNav();
getMoviesData();
