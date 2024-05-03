// html에 div태그를 만들어주는 함수
const createDiv = (id, text) => {
  const div = document.createElement("div");
  div.id = id;
  div.innerText = text;
  return div;
};

let eventObj = {};

const makeJoinDivObj = () => {
  const containerDiv = createDiv("event-join-container", "");
  const headerDiv = createDiv("event-join-header", "");
  const mainDiv = createDiv("event-join-main", "");
  const ticketDiv = createDiv("event-join-ticket", "");
  const footerDiv = createDiv("event-join-footer", "");
  return { containerDiv, headerDiv, mainDiv, ticketDiv, footerDiv };
};
//아스키 코드 생성기 A 65
const askiiCodeGenerator = (askiiNum) => {
  const askiiString = String.fromCharCode(askiiNum);
  return askiiString;
};

const checkSeatGrade = (seatCode) => {
  if (seatCode === "A5" || seatCode === "A6") return "VIP";
  if (seatCode[1] === "0") return "seat-standard";
  if (seatCode.includes("A")) return "R";
  if (
    seatCode.includes("B") ||
    seatCode.includes("C") ||
    seatCode.includes("D")
  )
    return "S";
  return "A";
};
const makeSeat = () => {
  const seat = createDiv("seat", "");
  const seatRow = 11;
  const seatCol = 10;
  let seatGrade = "";
  for (let i = 0; i < seatCol; i++) {
    const askiiChar = askiiCodeGenerator(65 + i);
    let seatColumnHTML = "";
    for (let j = 0; j < seatRow; j++) {
      if (j === 0) {
        seatGrade = checkSeatGrade(askiiChar + j);
        seatColumnHTML += `<div id="${askiiChar}${j}" class = "${seatGrade} , seat-element">${askiiChar}</div>`;
      }
      if (j !== 0) {
        seatGrade = checkSeatGrade(askiiChar + j);
        seatColumnHTML += `<div id="${askiiChar}${j}" class = "${seatGrade} , seat-element">${j}</div>`;
      }
      eventObj = {
        ...eventObj,
        [askiiChar + j]: {
          seatId: askiiChar + j,
          ticketGrade: seatGrade,
          isSold: false,
        },
      };
    }
    seat.innerHTML += `<div id="${askiiChar}-container" class = "seat-container">${seatColumnHTML}</div>`;
  }
  getData("event", "tickets", "seats").then((data) =>
    data
      ? console.log("티켓 데이터가 존재합니다.")
      : postData("event", "tickets", eventObj, "seats")
  );
  return seat.innerHTML;
};

const renderJoinPage = () => {
  const divObj = makeJoinDivObj();
  console.log(divObj);
  divObj.containerDiv.innerHTML = `
  ${(divObj.mainDiv.innerHTML = `
  <div id = "main-screen">무대</div>
  <div id = "main-seat">${makeSeat()}</div>
  `)}
  `;

  const eventArea = document.querySelector(".event-area");
  document.body.insertBefore(divObj.containerDiv, document.body.firstChild);
  // document.body.appendChild(divObj.containerDiv);
};
renderJoinPage();
