// 여기 아래 잘못했음.. 장르를 뽑아오는지 몰라서 다시 해야함
// Firebase에서 데이터 가져오기

// 페이지 로드 후 실행되는 함수
window.onload = async function () {
  getData("event", "moviesDoc", "movies").then((data) => {
    console.log(data);

    displayMoviesByGenre(data);
  });
  // 각 장르별로 데이터를 가져와서 HTML에 표시 ==> 이것도 필터로 변경
};

function displayMoviesByGenre(data) {
  const genres = { 액션: 28, 코미디: 35, 로맨스: 10749, 공포: 27 };
  // container id = '액션'
  const actionMovie = [];
  const comedyMovie = [];
  const romanceMovie = [];
  const horrorMovie = [];

  data.forEach((item) => {
    item.genre_ids.filter((element) =>
      element === 28 ? actionMovie.push(item) : null
    );
  });
  data.forEach((item) => {
    item.genre_ids.filter((element) =>
      element === 35 ? comedyMovie.push(item) : null
    );
  });
  data.forEach((item) => {
    item.genre_ids.filter((element) =>
      element === 10749 ? romanceMovie.push(item) : null
    );
  });
  data.forEach((item) => {
    item.genre_ids.filter((element) =>
      element === 27 ? horrorMovie.push(item) : null
    );
  });

  console.log("actionMovie", actionMovie);
  console.log("comedyMovie", comedyMovie);
  console.log("romanceMovie", romanceMovie);
  console.log("horrorMovie", horrorMovie);

  // 해당 장르의 데이터 필터링==> id일치로 가야하는데??

  // 최대 4개의 영화 카드 생성
  // genreData.slice(0, 4).forEach((movie) => {
  //   const card = document.createElement("div");
  //   card.classList.add("card");

  //   // 영화 포스터 이미지 생성
  //   const img = document.createElement("img");
  //   img.classList.add("cardImg");
  //   img.src = movie.poster_path;
  //   card.appendChild(img);

  //   // 영화 제목 생성
  //   const title = document.createElement("p");
  //   title.classList.add("movieTitle");
  //   title.textContent = movie.title;
  //   card.appendChild(title);

  //   // 카드를 카드 컨테이너에 추가
  //   cardsContainer.appendChild(card);
  // });
}
displayMoviesByGenre();
