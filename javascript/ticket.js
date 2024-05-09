


const renderMyTicket = async () => {
  const localTicketGrade = localStorage.getItem("ticketGrade");
  const localSeatInfo = localStorage.getItem("seatInfo");
  const localSerialNumber = localStorage.getItem("serialNumber");

  if (!localTicketGrade || !localSeatInfo || !localSerialNumber) {
    const myTicket = document.querySelector(".my-ticket .curr-ticket");
    myTicket.classList.add("grade-none");
    return;
  }
  let serialNumber = null;
  await getData("event", "tickets", "seats").then((data) => {
    serialNumber = data[localSeatInfo]["serialNumber"];
  });

  if (Number(localSerialNumber) !== Number(serialNumber)) {
    localStorage.removeItem("serialNumber");
    localStorage.removeItem("seatInfo");
    localStorage.removeItem("ticketGrade");
    illegalModal();
    return;
  }

  const myTicket = document.querySelector(".my-ticket .curr-ticket");
  myTicket.classList.add("grade-" + localTicketGrade);
  const pTag = document.createElement("p");
  pTag.classList.add("seat-info");
  pTag.innerText = "SEAT: " + localSeatInfo;
  myTicket.appendChild(pTag);
};
renderMyTicket();

const ticketCounter = document.querySelector(".count");

const getRestTickets = async () => {
  const availableSeats = [];
  await getData("event", "tickets", "seats").then((data) => {
    for (const seat in data) {
      const seatData = data[seat];
      if (
        seatData.ticketGrade !== "seat-standard" &&
        seatData.isSold !== true
      ) {
        availableSeats.push(seatData.seatId);
      }
    }
  });
  return availableSeats;
};

const generateTicketData = async () => {
  getRestTickets()
    .then((availableSeats) => {
      const randomIndex = Math.floor(Math.random() * availableSeats.length);
      const seat = availableSeats[randomIndex];
      return seat;
    })
    .then((seat) => {
      getData("event", "tickets", "seats").then((data) => {
        data[seat].isSold = true;
        const soldSeat = document.getElementById(data[seat].seatId);
        const ticketGrade = soldSeat.classList[0];
        soldSeat.classList.add("sold");
        postData("event", "tickets", data, "seats");

        const seatInfo = soldSeat.id;
        const seatSerialNumber = data[seat].serialNumber;
        const ticket = document.querySelector(".ticket");
        ticket.classList.remove("grade-VIP");
        ticket.classList.remove("grade-R");
        ticket.classList.remove("grade-S");
        ticket.classList.remove("grade-A");
        ticket.classList.add("grade-" + ticketGrade);
        const pTag = document.createElement("p");
        pTag.classList.add("seat-info");
        pTag.innerText = "SEAT: " + seatInfo;
        ticket.appendChild(pTag);
        console.log("soldSeat", soldSeat);

        localStorage.setItem("ticketGrade", ticketGrade);
        localStorage.setItem("seatInfo", seatInfo);
        localStorage.setItem("serialNumber", seatSerialNumber);
      });
    });
};

const updateTicketCount = () => {
  getData("event", "ticket-count", "units").then((data) => {});
  getRestTickets().then((availableSeats) => {
    ticketCounter.innerText = availableSeats.length;
    console.log("rest ticket:", availableSeats.length);
  });
};
const eventArea = document.querySelector(".event-area");
const ticketBox = document.querySelector(".ticket-container");
const ticket = document.querySelector(".ticket-container .ticket");
const printBtn = document.querySelector(".get-coin-btn");
const loadingBar = document.querySelector(".loading-bar.front");

const printTicket = () => {
  loadingBar.style.animationName = "none";
  ticketBox.style.animationName = "none";
  ticket.style.animationName = "none";
  eventArea.style.overflow = "visible";
  ticket.style.opacity = "0";
  const ticketContent = document.querySelector(".ticket p");
  if (ticketContent) {
    ticketContent.remove();
  }
  coinInsertPlay();
  setTimeout(() => {
    printBtn.classList.add("working");
    setTimeout(() => {
      loadingBar.style.animationName = "loading";
    }, 500);

    setTimeout(() => {
      ticketBox.style.animationName = "wiggle";
    }, 6000);

    setTimeout(() => {
      eventArea.style.overflow = "hidden";
      ticket.style.opacity = "1";

      generateTicketData();
      decreaseTicketCount();

      setTimeout(() => {
        ticket.style.animationName = "printingTicket";

        setTimeout(() => {
          updateTicketCount();
          printBtn.classList.remove("working");
          // ticket.style.animationName = "none";
          localStorage.setItem(
            "restTickets",
            localStorage.getItem("restTickets") - 1
          );
          myRestTickets.innerText = `남은 동전: ${localStorage.getItem(
            "restTickets"
          )}`;

          setTimeout(() => {
            const ticketGrade = localStorage.getItem("ticketGrade");
            const seatInfo = localStorage.getItem("seatInfo");
            cardModal(ticketGrade, seatInfo);
          }, 1000);
        }, 4000);
      }, 1000);
    }, 9000);
  }, 3000);
};

const checkCondition = () => {
  const ticketGrade = localStorage.getItem("ticketGrade");
  if (ticketGrade) {
    choiceModal();
    return;
  }
  confirmModal();
};

const noTicketModal = () => {
  const existModal = document.querySelector(".modal");
  if (existModal) {
    return;
  }
  const template = `
    <div class="modal warning">
      <p>남은 동전이 없습니다!
      <br>퀴즈 푸는 곳에서 동전을 준다던데...</p>
      <div class="closeBtnBox">
        <button class="closeModal warning">닫기</button>
        <div class="btnBg"></div>
      </div>
    </div>
  `;
  const newDiv = document.createElement("div");
  newDiv.classList.add("modal-background");
  newDiv.classList.add("warning");
  newDiv.classList.add("visible");
  newDiv.innerHTML += template;
  document.body.append(newDiv);
  const modalBack = document.querySelector(".modal-background.warning");
  const modalBtn = document.querySelector(".modal.warning .closeModal");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }
  // 'wheel' 이벤트를 사용하여 스크롤 감지 후 방지
  $body.addEventListener("wheel", preventScroll, { passive: false });
  modalBtn.addEventListener("click", (e) => {
    modalBack.remove();
    $body.removeEventListener("wheel", preventScroll, {
      passive: false,
    });
  });
};

const illegalModal = () => {
  const template = `
    <div class="modal warning">
      <p>티켓 일련번호가 일치하지 않습니다!
      <br>티켓을 불러올 수 없습니다.</p>
      <div class="closeBtnBox">
        <button class="closeModal warning">닫기</button>
        <div class="btnBg"></div>
      </div>
    </div>
  `;
  const newDiv = document.createElement("div");
  newDiv.classList.add("modal-background");
  newDiv.classList.add("warning");
  newDiv.classList.add("visible");
  newDiv.innerHTML += template;
  document.body.append(newDiv);
  const modalBack = document.querySelector(".modal-background.warning");
  const modalBtn = document.querySelector(".modal.warning .closeModal");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }

  // 'wheel' 이벤트를 사용하여 스크롤 감지 후 방지
  $body.addEventListener("wheel", preventScroll, { passive: false });
  modalBtn.addEventListener("click", (e) => {
    modalBack.remove();
    $body.removeEventListener("wheel", preventScroll, {
      passive: false,
    });
  });
};

const welcomeModal = () => {
  const existModal = document.querySelector(".modal");
  if (existModal) {
    return;
  }
  const template = `
      <div class="modal welcome visible">
        <p>어서오세요 고객님! 첫 방문이시군요!
        <br>환영의 의미로 동전을 드릴게요!</p>
        <div class="closeBtnBox">
          <button class="closeModal">받기</button>
          <div class="btnBg"></div>
        </div>
      </div>
  `;
  const newDiv = document.createElement("div");
  newDiv.classList.add("modal-background");
  newDiv.classList.add("welcome");
  newDiv.classList.add("visible");
  newDiv.innerHTML += template;
  document.body.append(newDiv);
  const modalBack = document.querySelector(".modal-background.welcome");
  const modalBtn = document.querySelector(".modal.welcome .closeModal");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }
  // 'wheel' 이벤트를 사용하여 스크롤 감지 후 방지
  $body.addEventListener("wheel", preventScroll, { passive: false });
  modalBtn.addEventListener("click", (e) => {
    modalBack.remove();
    $body.removeEventListener("wheel", preventScroll, {
      passive: false,
    });
  });
};

const cardModal = (ticketGrade, seatInfo) => {
  const existModal = document.querySelector(".modal");
  if (existModal) {
    return;
  }
  const template = `
      <div class="modal forbidden visible">
        <p>축하드려요 고객님!<br>
        "${ticketGrade}"등급 티켓을 뽑으셨군요!<br>
        고객님의 좌석은 "${seatInfo}" 입니다!</p>
        <div class="closeBtnBox">
          <button class="closeModal">닫기</button>
          <div class="btnBg"></div>
        </div을
      </div>
  `;
  const newDiv = document.createElement("div");
  newDiv.classList.add("modal-background");
  newDiv.classList.add("forbidden");
  newDiv.classList.add("visible");
  newDiv.innerHTML += template;
  document.body.append(newDiv);
  const modalBack = document.querySelector(".modal-background.forbidden");
  const modalBtn = document.querySelector(".modal.forbidden .closeModal");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }
  // 'wheel' 이벤트를 사용하여 스크롤 감지 후 방지
  $body.addEventListener("wheel", preventScroll, { passive: false });
  modalBtn.addEventListener("click", (e) => {
    modalBack.remove();
    $body.removeEventListener("wheel", preventScroll, {
      passive: false,
    });
  });
};

const choiceModal = () => {
  const existModal = document.querySelector(".modal");
  if (existModal) {
    return;
  }
  const template = `
      <div class="modal choice visible">
        <p>이미 티켓이 있으시군요!<br>
        티켓을 새로 뽑으시겠어요?<br>
        가지고 있는 티켓은 사라지게 돼요.</p>
        <div class="btns-box">
          <div class="closeBtnBox">
            <button class="closeModal">닫기</button>
            <div class="btnBg"></div>
          </div>
          <div class="closeBtnBox">
            <button class="closeModal print">뽑기</button>
            <div class="btnBg print"></div>
          </div>
        </div>
      </div>
  `;
  const newDiv = document.createElement("div");
  newDiv.classList.add("modal-background");
  newDiv.classList.add("choice");
  newDiv.classList.add("visible");
  newDiv.innerHTML += template;
  document.body.append(newDiv);
  const modalBack = document.querySelector(".modal-background.choice");
  const modalBtn = document.querySelector(".modal.choice .closeModal");
  const printBtn = document.querySelector(".modal.choice .closeModal.print");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }
  // 'wheel' 이벤트를 사용하여 스크롤 감지 후 방지
  $body.addEventListener("wheel", preventScroll, { passive: false });
  modalBtn.addEventListener("click", (e) => {
    modalBack.remove();
    $body.removeEventListener("wheel", preventScroll, {
      passive: false,
    });
  });
  printBtn.addEventListener("click", () => {
    printTicket();
    modalBack.remove();
    $body.removeEventListener("wheel", preventScroll, {
      passive: false,
    });
  });
};

const confirmModal = () => {
  const existModal = document.querySelector(".modal");
  if (existModal) {
    return;
  }
  const template = `
      <div class="modal choice visible">
        <p>아직 티켓이 없으시군요!<br>
        티켓을 뽑으시겠어요?</p>
        <div class="btns-box">
          <div class="closeBtnBox">
            <button class="closeModal">닫기</button>
            <div class="btnBg"></div>
          </div>
          <div class="closeBtnBox">
            <button class="closeModal print">뽑기</button>
            <div class="btnBg print"></div>
          </div>
        </div>
      </div>
  `;
  const newDiv = document.createElement("div");
  newDiv.classList.add("modal-background");
  newDiv.classList.add("choice");
  newDiv.classList.add("visible");
  newDiv.innerHTML += template;
  document.body.append(newDiv);
  const modalBack = document.querySelector(".modal-background.choice");
  const modalBtn = document.querySelector(".modal.choice .closeModal");
  const printBtn = document.querySelector(".modal.choice .closeModal.print");
  const $body = document.querySelector("body");
  function preventScroll(e) {
    e.preventDefault();
  }
  // 'wheel' 이벤트를 사용하여 스크롤 감지 후 방지
  $body.addEventListener("wheel", preventScroll, { passive: false });
  modalBtn.addEventListener("click", (e) => {
    modalBack.remove();
    $body.removeEventListener("wheel", preventScroll, {
      passive: false,
    });
  });
  printBtn.addEventListener("click", () => {
    printTicket();
    modalBack.remove();
    $body.removeEventListener("wheel", preventScroll, {
      passive: false,
    });
  });
};

updateTicketCount();

const restTickets = localStorage.getItem("restTickets");
console.log(restTickets);
if (restTickets === null) {
  localStorage.setItem("restTickets", 1);
  welcomeModal();
}

const myRestTickets = document.querySelector(".my-rest-tickets");
myRestTickets.innerText = `남은 동전: ${localStorage.getItem("restTickets")}`;

const moveElement = (event) => {
  const element = event.target;
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = element;
  const left = event.pageX - offsetLeft;
  const top = event.pageY - offsetTop;
  const centerX = left - offsetWidth / 2;
  const centerY = top - offsetHeight / 2;

  gsap.to(element, 0.01, {
    x: centerX,
    y: centerY,
    ease: Elastic.easeOut,
  });
  if (700 < centerX) {
    element.src = "./img/coins/gold01.svg";
  } else if (600 < centerX) {
    element.src = "./img/coins/gold07.svg";
  } else if (500 < centerX) {
    element.src = "./img/coins/gold06.svg";
  } else if (400 < centerX) {
    element.src = "./img/coins/gold05.svg";
  } else if (300 < centerX) {
    element.src = "./img/coins/gold04.svg";
  } else if (200 < centerX) {
    element.src = "./img/coins/gold03.svg";
  } else if (100 < centerX) {
    element.src = "./img/coins/gold02.svg";
  } else {
    element.src = "./img/coins/gold01.svg";
  }
};

const checkPos = (centerX, centerY) => {
  return centerX > 270 && centerX < 400 && centerY > 30 && centerY < 160;
};

const coinInsertPlay = () => {
  const coinElement = document.querySelector(".coin");
  coinElement.classList.add("hidden");
  coinElement.classList.add("blocked");
  const coin = document.querySelector(".animation-coin");
  coin.classList.remove("hidden");
  coin.style.top = "100px";
  coin.style.zIndex = "4";

  setTimeout(() => {
    coin.style.top = "-30px";
    setTimeout(() => {
      coin.style.zIndex = "2";
      setTimeout(() => {
        coin.style.top = "100px";
      }, 300);
    }, 1000);
  }, 600);
};

const moveStart = (event) => {
  const insertGuide = document.querySelector(".guide-line");
  insertGuide.classList.remove("hidden");
  const element = event.target;
  element.style.zIndex = 14;
  event.preventDefault();
  element.addEventListener("mousemove", moveElement);
};

const moveStop = (event) => {
  const insertGuide = document.querySelector(".guide-line");
  insertGuide.classList.add("hidden");
  const element = event.target;
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = element;
  const left = event.pageX - offsetLeft;
  const top = event.pageY - offsetTop;
  const centerX = left - offsetWidth / 2;
  const centerY = top - offsetHeight / 2;
  element.style.zIndex = 12;

  element.src = "./img/coins/gold01.svg";
  element.removeEventListener("mousemove", moveElement);

  if (checkPos(centerX, centerY)) {
    checkCondition();
  }

  gsap.to(element, 0.5, {
    x: 0,
    y: 0,
    ease: Elastic.easeOut.config(1.5, 0.2),
  });
};

const magneticElement = (element) => {
  element.addEventListener("mousedown", moveStart);
  element.addEventListener("mouseup", moveStop);
  element.addEventListener("mouseout", moveStop);
};

const coinElement = document.querySelector(".coin");
magneticElement(coinElement);

const getCoin = () => {
  coinElement.classList.add("hidden");
  gsap.to(coinElement, {
    duration: 0.1,
    y: -174,
  });
  setTimeout(() => {
    coinElement.classList.remove("hidden");
    coinElement.classList.remove("blocked");
    gsap.to(coinElement, {
      duration: 0.8,
      ease: "bounce.out",
      y: 0,
    });
  }, 200);
}

const getCoinBtn = document.querySelector(".get-coin-btn");
getCoinBtn.addEventListener("click", (e) => {
  if (+localStorage.getItem("restTickets") === 0) {
    noTicketModal();
    return;
  }
  getCoinBtn.classList.add("working");
  getCoin();
  setTimeout(()=>{
    getCoinBtn.classList.remove("working");
  },1000)
});
