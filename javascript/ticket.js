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
      console.log(availableSeats);
      const randomIndex = Math.floor(Math.random() * availableSeats.length);
      const seat = availableSeats[randomIndex];
      return seat;
    })
    .then((seat) => {
      getData("event", "tickets", "seats").then((data) => {
        data[seat].isSold = true;
        const soldSeat = document.getElementById(data[seat].seatId);
        soldSeat.classList.add("sold");
        postData("event", "tickets", data, "seats");
      });
      console.log(seat);
    });
};

generateTicketData();

const updateTicketCount = () => {
  getData("event", "ticket-count", "units").then((data) => {
    ticketCounter.innerText = data;
  });
};

const ticket = document.querySelector(".ticket");
const printBtn = document.querySelector(".print-btn");
printBtn.addEventListener("click", () => {
  ticket.style.animationName = " ";
  decreaseTicketCount();
  printBtn.classList.add("working");
  ticket.style.animationName = "printingTicket";
  setTimeout(() => {
    updateTicketCount();
    printBtn.classList.remove("working");
    ticket.style.animationName = "none";
  }, 4000);
});

updateTicketCount();
