const getRestCoin = async () => {
  const userSession = localStorage.getItem("sessions");
  const sessionData = await db.collection("sessions").doc(userSession).get();
  const userId = sessionData.data().userId;
  const restCoin = await getData("accounts", userId, "coin");
  return restCoin;
}

const getNav = () => {
  fetch("../nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-nav").innerHTML = data;
    })
    .catch((error) => console.error("Error:", error));
};
getNav();

const backToPage = () => {
  location.href = "./index.html";
};

const goToNextStage = async () => {
  const currLevel = localStorage.getItem("currLevel");
  if (currLevel > 5) {
    const message =
      "축하합니다! 모든 문제를 푸셨습니다!<br>티켓을 뽑을 수 있는 동전을 하나 드릴게요!";
    const userSession = localStorage.getItem("sessions");
    const sessionData = await db.collection("sessions").doc(userSession).get();
    const userId = sessionData.data().userId;
    const userCoin = await getRestCoin();
    await db
      .collection("accounts")
      .doc(userId)
      .update({ coin: Number(userCoin) + 1 });
    localStorage.setItem("currLevel", 0);
    renderSingleBtnModal(message);
    return;
  }
  localStorage.setItem("currLevel", +currLevel + 1);
  render();
};
const template = {
  singleBtn: `<button class="cancel">닫기</button>`,
  multiBtn: `
  <button class="prev">나가기</button>
  <button class="next">계속</button>`,
};

const makeModal = (body, type) => {
  const template = `
  <div class="modal">
    <p>${body}</p>
    <div class="btns-box">
        ${type}
    </div>
  </div>
`;
  const newDiv = document.createElement("div");
  newDiv.classList.add("modal-background");
  newDiv.classList.add("visible");
  newDiv.innerHTML += template;
  document.body.append(newDiv);
};

const closeModal = () => {
  const modalBack = document.querySelector(".modal-background");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }
  modalBack.remove();
  $body.removeEventListener("wheel", preventScroll, {
    passive: false,
  });
};

const renderSingleBtnModal = (body) => {
  const existModal = document.querySelector(".modal");
  if (existModal) {
    return;
  }
  makeModal(body, template.singleBtn);

  const cancelBtn = document.querySelector(".cancel");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }
  $body.addEventListener("wheel", preventScroll, { passive: false });
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // closeModal();
    location.href = "./index.html";
  });
};

const renderMultiBtnModal = (body, prevCallback, nextCallback) => {
  const existModal = document.querySelector(".modal");
  if (existModal) {
    return;
  }
  makeModal(body, template.multiBtn);

  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }
  $body.addEventListener("wheel", preventScroll, { passive: false });
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
    prevCallback();
  });
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
    nextCallback();
  });
};

const render = async () => {
  const existingContainer = document.querySelector(".quiz-container");
  if (existingContainer) {
    existingContainer.remove();
  }
  let currLevel = localStorage.getItem("currLevel");
  if (!currLevel) {
    localStorage.setItem("currLevel", 0);
    currLevel = 0;
  }

  currLevel = +currLevel;

  const quizs = await fetch("../quiz.json")
    .then((res) => res.json())
    .then((json) => {
      const data = json.quizs;
      return data;
    });
  const stage = quizs[currLevel];
  const container = document.createElement("div");
  container.classList.add("quiz-container");
  console.log(stage);
  const quizTemplate = `<section class="quiztop">
  <div class="quizscreen">
    <h2>DAILY QUIZ</h2>
    <h3>${stage.quiz}</h3>
  </div>
</section>
<section class="quizmiddle">
    <ul id="answerkeybox">
      <li id="a" class="choice"> a: ${stage.choice.a}</li>
      <li id="b" class="choice"> b: ${stage.choice.b}</li>
      <li id="c" class="choice"> c: ${stage.choice.c}</li>
      <li id="d" class="choice"> d: ${stage.choice.d}</li>
    </ul>
</section>
<section class="quizbottom">
  <div class="submitbutton">
    <div id="submit-btn" class="buttontop"><p>정답 제출</p></div>
    <div class="buttonbottom"></div>
  </div>
</section>`;
  container.innerHTML = quizTemplate;
  const $main = document.querySelector("main");
  $main.appendChild(container);

  const choices = document.querySelectorAll(".choice");
  choices.forEach((choice) => {
    choice.addEventListener("click", () => {
      choices.forEach((choice) => {
        choice.classList.remove("selected");
      });
      choice.classList.add("selected");
    });
  });
  const submitBtn = document.querySelector("#submit-btn");
  submitBtn.addEventListener("click", () => {
    const choice = document.querySelector(".selected").id;
    const { answer, explan } = stage;

    const checkAnswer = () => {
      if (choice === answer) {
        return `축하합니다! 정답을 맞추셨어요!`;
      } else {
        return `아쉽게도 오답입니다!`;
      }
    };

    const modalTemplate = `
    ${checkAnswer()}
    <p>정답 : ${answer}</p>
    <p>${explan}</p>
    `;

    renderMultiBtnModal(modalTemplate, backToPage, goToNextStage);
  });
};

render();
