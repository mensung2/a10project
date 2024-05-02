const ticketCounter = document.querySelector(".count");

const updateTicketCount = () => {
  readData().then(data => {
    ticketCounter.innerText = data;
    console.log(ticketCounter.innerText);
  });  
}

const ticket = document.querySelector(".ticket");
const printBtn = document.querySelector(".print-btn");
printBtn.addEventListener("click", () => {
  updateData();
  printBtn.classList.add("working");
  ticket.style.animationName = "printingTicket";
  setTimeout(() => {
    
    updateTicketCount();
    printBtn.classList.remove('working');
  }, 4000);
})

updateTicketCount();