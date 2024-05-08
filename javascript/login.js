const userLogin = async () => {
  const inputData = document.querySelector("form");
  const inputId = inputData.userAccount.value;
  const inputPw = inputData.userPassword.value;
  const existUser = await getUserData(inputId);
  if(!existUser) {
    const message = "존재하지 않는 유저입니다!";
    renderSingleBtnModal(message);
    return;
  }
  if(inputPw !== existUser.password) {
    const message = "비밀번호가 일치하지 않습니다!";
    renderSingleBtnModal(message);
    return;
  }
  saveCertification(inputId);
  location.href = "./mainms.html";
}

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
  const confirmBtn = document.querySelector(".confirm");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }
  $body.addEventListener("wheel", preventScroll, { passive: false });
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });
};

const renderMultiBtnModal = (body,callback) => {
  const existModal = document.querySelector(".modal");
  if (existModal) {
    return;
  }
  makeModal(body, template.multiBtn);

  const cancelBtn = document.querySelector(".cancel");
  const confirmBtn = document.querySelector(".confirm");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }
  $body.addEventListener("wheel", preventScroll, { passive: false });
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });
  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    callback();
  });
};

const template = {
  signup: "회원가입 페이지로 이동하시겠습니까?",
  loginFail: "입력한 정보가 올바르지 않습니다!",
  singleBtn: `<button class="cancel">닫기</button>`,
  multiBtn: `
  <button class="cancel">취소</button>
  <button class="confirm">확인</button>`,
};

const moveSignupPage = () => {
  location.href = "./signup.html";
};

const signupBtn = document.querySelector("#signupBtn");
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  renderMultiBtnModal(template.signup, moveSignupPage);
});

const loginBtn = document.querySelector("#loginBtn");
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  userLogin();
});

