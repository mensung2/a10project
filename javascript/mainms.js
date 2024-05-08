//네비바
const getNav = () => {
  fetch("./nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-nav").innerHTML = data;
      console.log("data", data);
    })
    .catch((error) => console.error("Error:", error));
};

getNav();

// 박스오피스 5위 출력
async function getmovielist() {
  await db
    .collection("event")
    .doc("moviesDoc")
    .get()
    .then((doc) => {
      const data = doc.data().movies;
      const top5movie = document.querySelector(".top-5-container-list");
      for (let i = 0; i < 5; i = i + 1) {
        data[i];
        const movie = data[i];
        const movieid = movie.id;
        const movieposter = movie.poster_path;
        const temp_movie = `<a id = 'clickevent 'href = 'detailReview.html?id${movieid}'> 
        <div id=${movieid} class="list-item">
                      <img src="img/rank-${i + 1}.svg" class="rank"></img>
                      <div class="rank-img-container">
                        <img class="rank-img" src="https://image.tmdb.org/t/p/w300${movieposter}" alt />
                      </div>
                    </div>
                    </a>`;
        top5movie.innerHTML += temp_movie;
      }
    });
}
getmovielist();

//리뷰 목록
db.collection("movie-comments").onSnapshot((snapshot) => {
  let count = 0;
  snapshot.docChanges().forEach((change) => {
    if (count > 3) {
      return;
    }
    //담겨있는 문서들. change는 문서 하나하나
    if (change.type === "added") {
      const post = change.doc.data();
      const id = change.doc.id; //파이어베이스 문서 각각의 아이디
      //포스트 리스트에 데이터 추가된 데이터를 받아서 새로운 node로 추가.

      const li = document.createElement("li"); // createElement 메서드를 사용하여 새로운 <li> 요소를 생성
      li.dataset.id = id; // 생성된 <li> 요소에 dataset을 사용하여 데이터 속성을 추가,  id는 파이어베이스 문서에서 가져온 값으로, 이것을 데이터 속성으로 할당하여 나중에 JavaScript에서 사용할 수 있도록 함
      li.classList.add("revBox");
      li.id = "revBox"; // <li> 요소에 id 속성을 추가

      const rvTemplate = `
          <div class="revTop">  
          <h3 id="starPoint">★ ${post.score}</h3>               
      </div>               
      <div class="revMid">
          <p id="revtext">${post.text}</p>
      </div>
      <div class="revBase">
          <p id="revnick">${post.nickname}</p>
      </div>`;

      const reviewContainer = document.getElementById("carousel"); // 원래 review (html:27)
      li.innerHTML = rvTemplate;
      reviewContainer.appendChild(li);

      count = count + 1;
    }
  });
});
