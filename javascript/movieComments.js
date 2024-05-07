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

const reviewRegist = document.getElementById("revRegist"); // 리뷰 등록버튼 아이디 가져와서 할당
const prevId = window.location.search;
const thisPageId = prevId.substr(3); // 현재 페이지의 영화 id 값만 할당

reviewRegist.addEventListener("click", (e) => {
  // 리뷰 등록버튼 클릭하면 이벤트 발생
  e.preventDefault();

  const nickname = document.getElementById("nickName").value; // 인풋창에 적은 값을 가져와서 할당
  const password = document.getElementById("passWord").value;
  const revpoint = document.getElementById("revPoint").value;
  const revcontent = document.getElementById("revContent").value;

  db.collection("movie-comments").add({
    // 파이어베이스 db에 인풋값 넣어주기
    movieId: thisPageId,
    nickname: nickname,
    password: password,
    text: revcontent,
    score: revpoint,
  });
});


db.collection("movie-comments").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    //담겨있는 문서들. change는 문서 하나하나
    if (change.type === "added") {
      const post = change.doc.data();
      const id = change.doc.id; //파이어베이스 문서 각각의 아이디
      console.log(post, id);
      //포스트 리스트에 데이터 추가된 데이터를 받아서 새로운 node로 추가.
      if (thisPageId !== post.movieId) {
        return; // 간단하게 !
      }

      const li = document.createElement("li"); // createElement 메서드를 사용하여 새로운 <li> 요소를 생성
      li.dataset.id = id; // 생성된 <li> 요소에 dataset을 사용하여 데이터 속성을 추가,  id는 파이어베이스 문서에서 가져온 값으로, 이것을 데이터 속성으로 할당하여 나중에 JavaScript에서 사용할 수 있도록 함
      li.classList.add(id);
      li.classList.add("revBox");
      li.id = "revBox"; // <li> 요소에 id 속성을 추가

      const rvTemplate = `
            <div class="revTop">
                <h3 id="revName">${post.nickname}</h3>
                <h3 id="starPoint">★ ${post.score}</h3>                    
            </div>               
            <div class="revMid">
                <p class="contents">${post.text}</p>
            </div>
            <div class="revBase">
                <svg class="thumb" xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M20.6037 16.265L21.3087 12.185C21.3501 11.9459 21.3387 11.7006 21.2754 11.4663C21.2121 11.232 21.0983 11.0144 20.9421 10.8287C20.7859 10.643 20.591 10.4936 20.371 10.391C20.1511 10.2885 19.9114 10.2352 19.6687 10.235H14.4877C14.3668 10.235 14.2473 10.2087 14.1376 10.1579C14.0279 10.1071 13.9305 10.0331 13.8523 9.94087C13.7741 9.84867 13.7169 9.74054 13.6846 9.624C13.6524 9.50746 13.646 9.3853 13.6657 9.26601L14.3287 5.22101C14.4363 4.56424 14.4056 3.89225 14.2387 3.24801C14.1673 2.98181 14.0297 2.73799 13.8388 2.5392C13.6479 2.34042 13.4098 2.19313 13.1467 2.11101L13.0017 2.06401C12.6739 1.9587 12.3181 1.98303 12.0077 2.13201C11.6677 2.29601 11.4197 2.59501 11.3277 2.95001L10.8517 4.78401C10.7002 5.36764 10.48 5.93124 10.1957 6.46301C9.7807 7.24001 9.1387 7.86301 8.4707 8.43801L7.0317 9.67801C6.83207 9.85052 6.67615 10.0679 6.57673 10.3123C6.4773 10.5567 6.4372 10.8211 6.4597 11.084L7.2717 20.477C7.30749 20.8924 7.49774 21.2793 7.80489 21.5613C8.11204 21.8432 8.51375 21.9998 8.9307 22H13.5787C17.0607 22 20.0317 19.574 20.6037 16.265Z" fill="#FE6168"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.30157 9.48509C3.49483 9.47664 3.68388 9.54319 3.82923 9.67084C3.97459 9.79849 4.06499 9.97736 4.08157 10.1701L5.05157 21.4061C5.06801 21.5734 5.05016 21.7423 4.99912 21.9025C4.94808 22.0627 4.86492 22.2108 4.75472 22.3378C4.64452 22.4648 4.50959 22.5679 4.35818 22.641C4.20677 22.7141 4.04204 22.7555 3.87408 22.7628C3.70611 22.7701 3.53842 22.7431 3.38125 22.6834C3.22408 22.6237 3.08073 22.5326 2.95995 22.4156C2.83918 22.2986 2.74351 22.1583 2.6788 22.0031C2.61409 21.8479 2.58169 21.6812 2.58357 21.5131V10.2341C2.58366 10.0408 2.65838 9.85495 2.79216 9.7154C2.92594 9.57585 3.10843 9.49334 3.30157 9.48509Z" fill="#FE6168"/>
                </svg>
                <p class="heart">15</p>
            <div class="revBtn">
              <button id="modiBtn">수정</button>
              <button id="delBtn">삭제</button>                    
            </div>`;

      const reviewContainer = document.getElementById("carousel"); // 원래 review (html:27)
      li.innerHTML = rvTemplate;
      reviewContainer.appendChild(li);
    } else if (change.type === "modified") {
      // 데이터 수정하기
      const commentId = change.doc.id; // 변화가 생긴 문서 아이디
      const commentList = document.querySelectorAll("#revBox");
      commentList.forEach(async (comment) => {
        if (commentId === comment.dataset.id) {
          await db
            .collection("movie-comments")
            .doc(commentId)
            .get()
            .then((data) => {
              const userData = data.data();
              console.log(userData);
              compareNickname = userData["nickname"];
              comparePassword = userData["password"];
              comparePoint = userData["score"];
              compareContent = userData["text"];

              const changedNickname = comment.querySelector("#revName");
              const changedPoint = comment.querySelector("#starPoint");
              const changedContent = comment.querySelector(".contents");

              changedPoint.innerText = `★ ${comparePoint}`;
              changedContent.innerText = compareContent;
            });
        }
      });
    } else if (change.type === "removed") {
      // 삭제된 데이터 렌더링
      const commentId = change.doc.id; // 변화가 생긴 문서 아이디(삭제한 문서의 아이디)
      const commentList = document.querySelectorAll("#revBox");
      commentList.forEach((comment) => {
        if (commentId === comment.dataset.id) {
          comment.remove();
        }
      });
    }
  });
  clickButtons();
  setCarouselLeft();
  setCarouselRight();
});

const clickButtons = () => {
  clickModiBtn();
  clickModiRevPrevBackSpace();
  clickConfirm();
  clickModiRevBackSpace();
  clickReviewModi();
  clickDelBtn();
  clickDelRevBackSpace();
  clickDelConfirm();
};

const clickModiBtn = () => {
  const modiBtn = document.querySelectorAll("#modiBtn");
  modiBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const parentNoderev = e.target.parentElement.parentElement.parentElement;
      const commentId = parentNoderev.dataset.id;
      const modiReview = document.querySelector(".modiRevPrev");
      modiReview.dataset.commentId = commentId;
      modiRevPrev.classList.remove("hidden");
    });
  });
};

const clickModiRevPrevBackSpace = () => {
  const modiRevPrevBackBtn = document.querySelectorAll(
    "#modiRevPrev-backspace"
  );
  modiRevPrevBackBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      modiRevPrev.classList.add("hidden");
      0;
    });
  });
};

const clickConfirm = () => {
  const confirmBtn = document.getElementById("revConfirm");
  if (!confirmBtn) {
    return;
  }
  confirmBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const inputNickname = document.querySelector(".modiPrevNickname").value; // 리뷰 수정 모달창에 입력한 닉네임, 비밀번호 가져와서 할당
    const inputPassword = document.querySelector(".modiPrevPassword").value;

    const parentNoderev = e.target.parentElement.parentElement;
    const commentId = parentNoderev.dataset.commentId; // html에서 -소문자, 자바스크립트에서는 대문자
    let compareNickname = null;
    let comparePassword = null;
    let comparePoint = null;
    let compareContent = null;
    console.log(commentId);

    await db
      .collection("movie-comments")
      .doc(commentId)
      .get()
      .then((data) => {
        const userData = data.data();
        console.log(userData);
        compareNickname = userData["nickname"];
        comparePassword = userData["password"];
        comparePoint = userData["score"];
        compareContent = userData["text"];
        console.log(compareNickname, comparePassword);
      });

    if (inputNickname !== compareNickname) {
      alert("닉네임이 일치하지 않습니다.");
      return;
    }
    if (inputPassword !== comparePassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    modiRevPrev.classList.add("hidden");
    /* 리뷰 수정하기에서 확인버튼 누르면 내용 수정 모달창이 뜨게 modiRev클래스 hidden 없애주기*/
    modiRev.classList.remove("hidden");
    modiRev.dataset.commentId = commentId;

    const Nickmodi = document.querySelector(".modiNickname");
    const Passmodi = document.querySelector(".modiPassword");
    const Pointmodi = document.querySelector(".revPoint");
    const Contentmodi = document.querySelector(".revContent");

    Nickmodi.value = compareNickname;
    Passmodi.value = comparePassword;
    Pointmodi.value = comparePoint;
    Contentmodi.value = compareContent;
  });
};

const clickModiRevBackSpace = () => {
  const modiRevBackBtn = document.querySelectorAll("#modiRev-backspace");
  modiRevBackBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      modiRev.classList.add("hidden");
      modiRevPrev.classList.remove("hidden");
    });
  });
};

const clickReviewModi = () => {
  const reviewModiBtn = document.querySelectorAll("#modiRev-modiBtn");
  reviewModiBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const revmodibox = document.querySelector(".modiRev");
      const commentId = revmodibox.dataset.commentId;
      console.log(revmodibox);
      console.log(commentId);
      const Nickmodi = document.querySelector(".modiNickname");
      const Passmodi = document.querySelector(".modiPassword");
      const Pointmodi = document.querySelector(".revPoint");
      const Contentmodi = document.querySelector(".revContent");

      db.collection("movie-comments").doc(commentId).update({
        score: Pointmodi.value,
        text: Contentmodi.value,
      });

      revmodibox.classList.add("hidden");
    });
  });
};

const clickDelBtn = () => {
  const reviewDelBtn = document.querySelectorAll("#delBtn");
  reviewDelBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const parentNoderev = e.target.parentElement.parentElement.parentElement;
      const commentId = parentNoderev.dataset.id; // 값 가져오기
      const delreview = document.querySelector(".delRev");
      delreview.dataset.commentId = commentId; // 값 넣어주기
      delRev.classList.remove("hidden");
    });
  });
};

const clickDelRevBackSpace = () => {
  const delRevBackBtn = document.querySelectorAll("#delRev-backspace");
  delRevBackBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      delRev.classList.add("hidden");
    });
  });
};

const clickDelConfirm = () => {
  const delConfirm = document.querySelectorAll("#delConfirm");
  delConfirm.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();

      const inputNickname = document.querySelector(".delNickname").value; // 리뷰 삭제 모달창에 입력한 닉네임, 비밀번호 가져와서 할당
      const inputPassword = document.querySelector(".delPassword").value;

      const parentNoderev = e.target.parentElement.parentElement;
      const commentId = parentNoderev.dataset.commentId; // html에서 -소문자, 자바스크립트에서는 대문자
      let compareNickname = null;
      let comparePassword = null;
      console.log(commentId);

      await db
        .collection("movie-comments")
        .doc(commentId)
        .get()
        .then((data) => {
          const userData = data.data();
          console.log(userData);
          compareNickname = userData["nickname"];
          comparePassword = userData["password"];
          console.log(compareNickname, comparePassword);
        });

      if (inputNickname !== compareNickname) {
        alert("닉네임이 일치하지 않습니다.");
        return;
      }
      if (inputPassword !== comparePassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      await db.collection("movie-comments").doc(commentId).delete();
      delRev.classList.add("hidden");
    });
  });
};

let current = 0;

const setCarouselLeft = () => {
  //carousel_Length에서 4를 빼서 슬라이드 길이를 딱 맞춤.
  const carousel_Length = document.querySelectorAll(".revBox").length-4;
  if (current === 0) {
    current = carousel_Length;
    carousel.style.transform = `translateX(${carousel_Length * -360}px)`;
  } else {
    // currnt 숫자를 먼저 계산하고 그에 맞춰서 움직여줌.
    current--;
    carousel.style.transform = `translateX(${current * -360}px)`;
    
  }
};

const setCarouselRight = () => {
  const carousel_Length = document.querySelectorAll(".revBox").length-4;
  console.log('current', current);
  console.log('carousel_Length', carousel_Length);
  if (current === carousel_Length) {
    console.log("if!");
    current = 0;
    carousel.style.transform = `translateX(0px)`;
  } else {
    console.log("else!");
    current++;
    // 여기가 아마 carousel.style.transform = `translateX(${(current + 1) * -360}px)`;
    // 로 되어 있어서 계속 첫 번째 칸에 걸려서 시작했던 것 같아요.
    carousel.style.transform = `translateX(${current * -360}px)`;
  }
};


const carousel = document.getElementById("carousel");
const leftArrow = document.getElementById("arrowLeft");
const rightArrow = document.getElementById("arrowRight");

leftArrow.addEventListener("click", setCarouselLeft);
rightArrow.addEventListener("click", setCarouselRight);
