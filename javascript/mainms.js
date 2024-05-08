function nextevent() {
    const element = document.getElementById('review1');
    element.style.cssText= `display: none;`
    const element2 = document.getElementById('review2');
    element2.style.cssText= `display: flex;
    flex-grow: 1;
    justify-content: space-around;
    position: relative;`
    const element3 = document.getElementById('next');
    element3.style.cssText= `background-color: white;`
}

function prevevent() {
  const element = document.getElementById('review1');
  element.style.cssText= `display: none;`
  const element2 = document.getElementById('review2');
  element2.style.cssText= `display: flex;
  flex-grow: 1;
  justify-content: space-around;
  position: relative;`
  const element3 = document.getElementById('next');
  element3.style.cssText= `background-color: white;`
}

// const options = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YzRiYTFiZTljMWM0YzdhZGI2N2ZhMjEzY2YyN2MzMCIsInN1YiI6IjY2MmEwM2Y4OGZkZGE5MDExY2RjZDM1MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aFwI9AajUE9ZVmUbTs1RLCc3dlm_Vypd49LqOMLyXqA",
//   },
// };
// fetch(
//   "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
//   options
// )
//   .then((response) => response.json())
//   .then((response) => {
//     const data = response.results;
//     const length = data.length;
//     const top5movie = document.querySelector(".top-5-container-list");
//     for (let i = 0; i < 5; i = i + 1) {
//       data[i];
//       const movie = data[i];
//       console.log(movie);
//       const movieid = movie.id;
//       const movieposter = movie.poster_path;
//       console.log(movieid);
//       console.log(movieposter);
//       const temp_movie = `<div id=${movieid} class="list-item">
//               <img src="img/rank-${i + 1}.svg" class="rank"></img>
//               <div class="rank-img-container" onclick="location.href='detailReview.html';">
//                 <img class="rank-img" src="https://image.tmdb.org/t/p/w300${movieposter}" alt />
//               </div>
//             </div>`;
//       top5movie.innerHTML += temp_movie;
//     }
//   })
//   .catch((err) => console.error(err));

async function getmovielist() {
  await db
    .collection("event")
    .doc("moviesDoc")
    .get()
    .then((doc) => {
      const data = doc.data().movies
      const top5movie = document.querySelector(".top-5-container-list");
      for (let i = 0; i < 5; i = i + 1) {
              data[i];
              const movie = data[i];
              console.log(movie);
              const movieid = movie.id;
              const movieposter = movie.poster_path;
              console.log(movieid);
              console.log(movieposter);
              const temp_movie = `<div id=${movieid} class="list-item">
                      <img src="img/rank-${i + 1}.svg" class="rank"></img>
                      <div class="rank-img-container" onclick="location.href='detailReview.html';">
                        <img class="rank-img" src="https://image.tmdb.org/t/p/w300${movieposter}" alt />
                      </div>
                    </div>`;
              top5movie.innerHTML += temp_movie;
}});
}

getmovielist()



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
        <a id = 'clickevent 'href = 'detailReview.html?id=${id}'> 
        <img src="https://image.tmdb.org/t/p/w200${posterPath}" id="poster" alt="${title}" /></a>
        <h3>${title}</h3>
        <p id="score">★ ${voteAverage}</p>
        <p id="content">${overview}</p>               
     </div>
    `;
    container.appendChild(card);
  });
};
