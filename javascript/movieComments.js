// const postData = async (dbCollection, dataName, data, key) => {
//     const docRef = await db
//       .collection(dbCollection)
//       .doc(dataName)
//       .set({
//         [key]: data,
//         date: new Date(),
//       });

//     return docRef;
//   };

const reviewRegist = document.getElementById("revRegist"); //form
console.log(reviewRegist);

reviewRegist.addEventListener("click", (e) => {
  e.preventDefault();

  const nickname = document.getElementById("nickName").value;
  const password = document.getElementById("passWord").value;
  const revpoint = document.getElementById("revPoint").value;
  const revcontent = document.getElementById("revContent").value;

  const prevId = window.location.search;
  const thisPageId = prevId.substr(3);

  db.collection("movie-comments").add({
    movieId: thisPageId,
    nickname: nickname,
    password: password,
    text: revcontent,
    score: revpoint,
  });
});

db.collection("movie-comments").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const post = change.doc.data();
      const id = change.doc.id;
      console.log(post, id); //파이어베이스 문서 각각의 아이디
      //포스트 리스트에 데이터 추가된 데이터를 받아서 새로운 node로 추가.

      const li = document.createElement("li");
      li.dataset.id = id;
      li.id = "revBox";

      const rvTemplate = `
      <li data-id=${id} id="revBox">
      <div class="revTop">
          <h3 id="revName">${post.nickname}</h3>
          <h3 id="starPoint">★ ${post.score}</h3>                    
      </div>               
      <div class="revMid">
          <p class="contents">${post.text}</p>
      </div>
      <div class="revBase">
          <p class="heart">298</p>
          <div class="revBtn">
              <button id="modiBtn">수정</button>
              <button id="delBtn">삭제</button>                    
          </div>
      </div>
  </li>`;

      const reviewContainer = document.getElementById("review");
      li.innerHTML = rvTemplate;
      reviewContainer.appendChild(li);
    } else if (change.type === "modified") {
    } else if (change.type === "removed") {
      // 삭제된 데이터 처리
      const postId = change.doc.id;
      const postElement = document.getElementById(postId);
      if (postElement) {
        postElement.remove();
      }
    }
  });
});
