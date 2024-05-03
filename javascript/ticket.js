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

const ticket = document.querySelector(".ticket-container .ticket");
const printBtn = document.querySelector(".print-btn");
printBtn.addEventListener("click", () => {
  const ticketGrade = localStorage.getItem("ticketGrade");
  if(ticketGrade) {
    alert("이미 티켓을 뽑으셨습니다!");
    return;
  }
  printBtn.classList.add("working");

  setTimeout(() => {
    generateTicketData();
    decreaseTicketCount();
    ticket.style.animationName = "printingTicket";
  }, 1000);

  setTimeout(() => {
    updateTicketCount();
    printBtn.classList.remove("working");
    // ticket.style.animationName = "none";
  }, 5000);
});

updateTicketCount();
