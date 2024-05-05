const renderMyTicket = () => {
  const ticketGrade = localStorage.getItem("ticketGrade");
  const seatInfo = localStorage.getItem("seatInfo");
  console.log("my ticket:", ticketGrade, seatInfo);
  if (!ticketGrade) {
    const myTicket = document.querySelector(".my-ticket .curr-ticket");
    myTicket.classList.add("grade-none");
    return;
  }
  const myTicket = document.querySelector(".my-ticket .curr-ticket");
  myTicket.classList.add("grade-" + ticketGrade);
  const pTag = document.createElement("p");
  pTag.classList.add("seat-info");
  pTag.innerText = "SEAT: " + seatInfo;
  myTicket.appendChild(pTag);
};
renderMyTicket();

const makeModal = (ticketGrade, seatInfo) => {
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
    modalBtn.addEventListener("click", (e) => {
    modalBack.classList.remove("visible");
  });
};

const decreaseTicketCount = async () => {
  const data = await getData("event", "ticket-count", "units");

  db.collection("event")
    .doc("ticket-count")
    .update({ units: Number(data) - Number(1) });
};

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
  console.log(availableSeats);
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
        console.log("data[seat].seatId", data[seat].seatId);
        data[seat].isSold = true;
        const soldSeat = document.getElementById(data[seat].seatId);
        const ticketGrade = soldSeat.classList[0];
        soldSeat.classList.add("sold");
        postData("event", "tickets", data, "seats");

        const seatInfo = soldSeat.id;
        const ticket = document.querySelector(".ticket");
        ticket.classList.add("grade-" + ticketGrade);
        const pTag = document.createElement("p");
        pTag.classList.add("seat-info");
        pTag.innerText = "SEAT: " + seatInfo;
        ticket.appendChild(pTag);
        console.log("soldSeat", soldSeat);

        localStorage.setItem("ticketGrade", ticketGrade);
        localStorage.setItem("seatInfo", seatInfo);
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
const printBtn = document.querySelector(".print-btn");
const loadingBar = document.querySelector(".loading-bar.front");
printBtn.addEventListener("click", () => {
  const ticketGrade = localStorage.getItem("ticketGrade");
  if (ticketGrade) {
    modalBack.classList.add("visible");
    return;
  }
  printBtn.classList.add("working");
  loadingBar.style.animationName = "loading";
  setTimeout(() => {
    ticketBox.style.animationName = "wiggle";
  }, 6000);

  setTimeout(() => {
    eventArea.style.overflow = "hidden";
    ticket.style.opacity = "1";

    setTimeout(() => {
      generateTicketData();
      decreaseTicketCount();
      ticket.style.animationName = "printingTicket";

      setTimeout(() => {
        updateTicketCount();
        printBtn.classList.remove("working");
        // ticket.style.animationName = "none";
        setTimeout(() => {
          const ticketGrade = localStorage.getItem("ticketGrade");
          const seatInfo = localStorage.getItem("seatInfo");
          makeModal(ticketGrade, seatInfo);

          const $body = document.querySelector("body");
          function preventScroll(e) {
            e.preventDefault();
          }
          // 'wheel' 이벤트를 사용하여 스크롤 감지 후 방지
          $body.addEventListener("wheel", preventScroll, { passive: false });
          $body.addEventListener("click", function () {
            // body 를 다시 클릭하면 스크롤 재개
            $body.removeEventListener("wheel", preventScroll, {
              passive: false,
            });
          });
        }, 1000);
      }, 4000);
    }, 1000);
  }, 9000);
});

updateTicketCount();

const modalBack = document.querySelector(".modal-background.warning");
const modalBtn = document.querySelector(".closeModal.warning");
modalBtn.addEventListener("click", (e) => {
  modalBack.classList.remove("visible");
});
