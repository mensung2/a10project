const getMoviesData = () => {
  const firebaseData = getData("event", "moviesDoc", "movies");
  firebaseData.then((data) => {
    loadThisMovie(data);
  });
};

const clickWriteRvButton = () => {  
  const writeRv = document.getElementById("writeRv");
  if(!writeRv){
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
  if(!backSpace){
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
  if(!revRegist){
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
  // movie.id는 넘버타입이고, thisPageId는 스트링이라 오류가 발생해 형변환을 해주었다.
  movies.forEach((movie, id) => {
    const selectedMovie = movie.id === Number(thisPageId);

    if (selectedMovie) {
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

// const getNav = () => {
//   fetch("../nav.html") // 질문하기!!
//     .then((response) => response.text())
//     .then((data) => {
//       document.getElementById("eventGuide-nav").innerHTML = data;
//     })
//     .catch((error) => console.error("Error:", error));
// };

clickEvents();
//getNav();
getMoviesData();
