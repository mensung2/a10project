const signupForm = document.querySelector("form");
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
});
const {
  username,
  nickname,
  account,
  password,
  confirmPassword,
  email,
  authNumber,
} = signupForm;

const checkAuthNumBtn = document.querySelector(".check-auth-num-btn");

const removeExpiredCertifications = async () => {
  db.collection("mail-auth")
    .get()
    .then((doc) => doc.docs)
    .then((docs) => {
      docs.forEach((doc) => {
        const dataId = doc.id;
        const dataExpireDate = doc.data().expireDate;
        if (Number(dataExpireDate) < new Date().getTime()) {
          db.collection("mail-auth").doc(dataId).delete();
        }
      });
    });
};

const expireSession = () => {
  sessionStorage.removeItem("authMailState");
  sessionStorage.removeItem("mailCertificationState");
  alert("세션이 만료되었습니다!");
  location.reload(true);
};

const restTimer =
  authNumber.parentElement.parentElement.querySelector(".warning-line");
const renderTimer = () => {
  const authMailState = sessionStorage.getItem("authMailState");
  if (
    authMailState &&
    new Date().getTime() > Number(JSON.parse(authMailState).expireDate)
  ) {
    restTimer.innerText = "유효시간이 지났습니다.";
  } else if (authMailState) {
    const expireTime = Number(JSON.parse(authMailState).expireDate);
    const currentTime = new Date().getTime();
    const restTime = Math.ceil((expireTime - currentTime) / 1000);
    const standardTime = `${Math.floor(restTime / 60)}분 ${restTime % 60}초`;
    restTimer.innerText = standardTime;
  }
};
const timerStopper = setInterval(renderTimer, 1000);

const checkIsWrong = (el, warning, pattern, boolean = true) => {
  const _pattern = pattern;
  const isWrong = _pattern.test(el.value);
  const warningLine =
    el.parentElement.parentElement.querySelector(".warning-line");
  if (!isWrong === boolean || el.value === "") {
    el.style.border = "2px solid red";
    warningLine.innerText = warning;
  } else {
    el.style.border = "1px solid #2d2d2d";
    warningLine.innerText = "";
  }
  return !isWrong === boolean;
};

const checkUsername = () => {
  const regex = /[^가-힣]/;
  const warningText = "올바른 이름을 입력해주세요.";
  const result = checkIsWrong(username, warningText, regex, false);
  return result;
};

const checkNickname = () => {
  const regex = /[가-힣]/;
  const warningText = "별명은 한글로만 지어주세요!";
  const result = checkIsWrong(nickname, warningText, regex);
  return result;
};

const checkAccount = async () => {
  const regex = /^(?=.*?[a-z])(?=.*?[0-9]).{5,16}$/;
  const warningText = "영어와 숫자로 5~16글자여야만 합니다!";
  const result = checkIsWrong(account, warningText, regex);
  let isExistingUser = null;
  if (!account.value) {
    return;
  }
  let existAccount = null;
  await db
    .collection("accounts")
    .doc(account.value)
    .get()
    .then((doc) => {
      console.log(doc.data());
      if (doc.data()) {
        const warningLine =
          account.parentElement.parentElement.querySelector(".warning-line");
        warningLine.innerText = "아이디가 중복되었습니다!";
        account.style.border = "2px solid red";
        existAccount = true;
      }
    });
  if(existAccount) {
    return true;
  }
  return result;
};

const checkPassword = () => {
  const regex =
    /^[a-z0-9#?!@$%^&*-](?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-])[a-z0-9#?!@$%^&*-].{8,16}$/;
  const warningText = "영문자 + 숫자 + 특수문자 포함 8~16자리여야만 합니다!";
  const result = checkIsWrong(password, warningText, regex);
  return result;
};

const checkEmail = async () => {
  const regex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  const warningText = "이메일 주소가 올바르지 않습니다!";
  const result = checkIsWrong(email, warningText, regex);
  let existingEmail = null;
  await db
    .collection("accounts")
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        if (doc.data().email === email.value) {
          const warningLine =
            email.parentElement.parentElement.querySelector(".warning-line");
          warningLine.innerText = "이메일이 중복되었습니다!";
          email.style.border = "2px solid red";
          existingEmail = true;
        }
      });
    });
  if (existingEmail) {
    return true;
  }
  return result;
};

const checkConfirmPassword = () => {
  const warning = "비밀번호가 일치하지 않습니다!";
  const isWrong =
    password.value !== confirmPassword.value ||
    password.value === "" ||
    confirmPassword.value === "";
  const warningLine =
    confirmPassword.parentElement.parentElement.querySelector(".warning-line");
  if (isWrong) {
    warningLine.innerText = warning;
    confirmPassword.style.border = "2px solid red";
  } else {
    warningLine.innerText = "";
    confirmPassword.style.border = "1px solid #2d2d2d";
  }
  const result = isWrong;
  return result;
};

const addInputValidationListener = () => {
  username.addEventListener("blur", checkUsername);
  nickname.addEventListener("blur", checkNickname);
  account.addEventListener("blur", checkAccount);
  password.addEventListener("blur", checkPassword);
  confirmPassword.addEventListener("blur", checkConfirmPassword);
  email.addEventListener("blur", checkEmail);
};

const checkIsInvalid = async () => {
  const _checkAccount = await checkAccount();
  if (_checkAccount) {
    alert("아이디를 다시 입력해주세요!");
    return true;
  }

  if (checkUsername()) {
    alert("이름을 다시 입력해주세요!");
    return true;
  }
  if (checkNickname()) {
    alert("별명을 다시 입력해주세요!");
    return true;
  }

  if (checkPassword()) {
    alert("비밀번호를 다시 입력해주세요!");
    return true;
  }

  if (checkConfirmPassword()) {
    alert("비밀번호가 다릅니다!");
    return true;
  }

  const _checkEmail = await checkEmail();
  if (_checkEmail) {
    alert("이메일이 올바르지 않습니다!");
    return true;
  }
  return false;
};

const sendAuthMail = async (username, userEmail, serialNumber) => {
  const templateParams = {
    to_name: username,
    user_email: userEmail,
    auth_serial_number: serialNumber,
  };

  console.log(templateParams);

  emailjs.send("service_4j5tuue", "template_llt4nim", templateParams).then(
    (response) => {
      console.log("SUCCESS!", response.status, response.text);
    },
    (error) => {
      console.log("FAILED...", error);
    }
  );
};

const confirmInputValues = async () => {
  const isInvalid = await checkIsInvalid();
  if (isInvalid) {
    return;
  }

  const serialNumber = String(
    Math.floor(new Date().getTime() * Math.random())
  ).slice(0, 6);
  const expireDate = new Date().getTime() + 1000 * 60 * 5;
  const authDoc = await db
    .collection("mail-auth")
    .add({ serialNumber: serialNumber, expireDate: expireDate });
  const authMailState = {
    authDocId: authDoc.id,
    expireDate: expireDate,
  };
  sessionStorage.setItem("authMailState", JSON.stringify(authMailState));

  // sendAuthMail(username.value, email.value, serialNumber);
  alert("성공적으로 메일을 보냈습니다!");
  sendAuthMailBtn.innerText = "인증메일 발송완료";
  sendAuthMailBtn.classList.add("complete");
  const authInput = document.querySelector(".auth-input");
  const authBtn = document.querySelector(".check-auth-num-btn");
  authInput.classList.remove("hidden");
  authBtn.classList.remove("hidden");
};

const checkSerialNumber = async () => {
  const authMailState = sessionStorage.getItem("authMailState");
  if (!authMailState) {
    console.log("Data is empty!");
    return;
  }
  const data = JSON.parse(authMailState);
  if (data.expireDate < new Date().getTime()) {
    expireSession();
    return;
  }

  let serialNumber = null;
  await db
    .collection("mail-auth")
    .doc(data.authDocId)
    .get()
    .then((doc) => {
      serialNumber = doc.data().serialNumber;
    });
  if (String(authNumber.value) !== serialNumber) {
    alert("인증번호가 일치하지 않습니다!");
    return;
  }

  const expireDate = new Date().getTime() + 1000 * 60 * 5;
  const mailCertificationId = await db
    .collection("mail-auth")
    .add({ isAuthenticated: true, expireDate: expireDate });
  const mailCertificationState = {
    mailCertificationId: mailCertificationId.id,
    expireDate: expireDate,
  };
  sessionStorage.setItem(
    "mailCertificationState",
    JSON.stringify(mailCertificationState)
  );
  checkAuthNumBtn.innerText = "인증완료";
  checkAuthNumBtn.classList.add("complete");
  clearInterval(timerStopper);
  restTimer.innerText = "";
  alert("인증에 성공했습니다!");
};

checkAuthNumBtn.addEventListener("click", () => {
  checkSerialNumber();
});

const signupBtn = document.querySelector(".signup-btn");
signupBtn.addEventListener("click", async () => {
  const mailCertificationState = sessionStorage.getItem(
    "mailCertificationState"
  );
  if (!mailCertificationState) {
    alert("이전 단계를 모두 완료해주세요!");
    return;
  }
  const { mailCertificationId, expireDate } = JSON.parse(
    mailCertificationState
  );
  if (Number(expireDate) < new Date().getTime()) {
    expireSession();
    return;
  }
  await db
    .collection("mail-auth")
    .doc(mailCertificationId)
    .get()
    .then((doc) => {
      const { isAuthenticated } = doc.data();
      if (!isAuthenticated) {
        expireSession();
      }
      const { username, nickname, account, password, email } = signupForm;

      db.collection("accounts")
        .doc(account.value)
        .set({
          username: username.value,
          nickname: nickname.value,
          account: account.value,
          password: password.value,
          email: email.value,
        })
        .then(() => {
          sessionStorage.removeItem("authMailState");
          sessionStorage.removeItem("mailCertificationState");
          alert("회원가입에 성공했습니다! 로그인 페이지로 이동합니다!");
          location.reload(true);
        });
    });
});

// Firebase에서 expireDate가 지난 인증 데이터들을 제거.
removeExpiredCertifications();
// input 태
addInputValidationListener();
// checkSerialNumber();

const sendAuthMailBtn = document.querySelector(".send-auth-num-btn");
sendAuthMailBtn.addEventListener("click", () => {
  confirmInputValues();
});
