// API url
const getMoviesData1 = () => {
  const firebaseData = getData("event", "moviesDoc", "movies");
  firebaseData.then((data) => {
    console.log("data", data);
    updateMovieList(data);
  });
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
        <a id = 'clickevent 'href = 'detailReview.html?id${id}'> 
        <img src="https://image.tmdb.org/t/p/w200${posterPath}" id="poster" alt="${title}" /></a>
        <h3>${title}</h3>
        <p id="score">★ ${voteAverage}</p>
        <p id="content">${overview}</p>               
     </div>
    `;
    container.appendChild(card);
  });
};

getMoviesData1();

// searchBox.addEventListener("keyup", (e) => {
//   if(e.key === 'Enter'){
//     document.getElementById("searchBtn").click();
//   }
// })

// fetchShowMvlist();
