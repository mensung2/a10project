// html에 div태그를 만들어주는 함수
const createDiv = (id, text) => {
  const div = document.createElement("div");
  div.id = id;
  div.innerText = text;
  return div;
};

const getNav = () => {
  fetch("./nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("eventJoin-nav").innerHTML = data;
    })
    .catch((error) => console.error("Error:", error));
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
      }
      if (j !== 0) {
        seatGrade = checkSeatGrade(askiiChar + j);
      }
      const serialNumber = Math.floor(new Date().getTime() * Math.random());
      eventObj = {
        ...eventObj,
        [askiiChar + String(j).padStart(2, 0)]: {
          seatId: askiiChar + String(j).padStart(2, 0),
          ticketGrade: seatGrade,
          isSold: false,
          //시리얼 넘버 생성
          serialNumber: serialNumber,
        },
      };
    }
  }
  getData("event", "tickets", "seats").then((data) =>
    data
      ? console.log("티켓 데이터가 존재합니다.")
      : (postData("event", "tickets", eventObj, "seats"),
        makeSeat(),
        console.log("재귀"))
  );
};

const getSeat = async () => {
  const seatDiv = createDiv("seat", "");
  const seatData = await getData("event", "tickets", "seats");
  const seatKeys = Object.keys(seatData).sort((a, b) => a.localeCompare(b));
  seatKeys.forEach((seat) => {
    const { seatId, ticketGrade, isSold } = seatData[seat];
    let seatColumnHTML = "";

    const seatRow = seat[0];
    const seatCol = [...seat].slice(1).join("");

    if (isSold === true) {
      seatColumnHTML += `<div id="${seatId}" class = "${ticketGrade} seat-element sold">${seatCol}</div>`;
    } else if (seatCol === "00") {
      seatColumnHTML += `<div id="${seatId}" class = "seat-standard seat-element">${seatRow}</div>`;
    } else {
      seatColumnHTML += `<div id="${seatId}" class = "${ticketGrade} seat-element">${seatCol}</div>`;
    }
    seatDiv.innerHTML += seatColumnHTML;
  });
  return seatDiv.innerHTML;
};

const renderJoinPage = async () => {
  const divObj = makeJoinDivObj();
  await getSeat().then((data) => {
    divObj.containerDiv.innerHTML = `
    ${(divObj.headerDiv = `
    <div id='eventJoin-nav'>${getNav()}</div>
    `)}

  ${(divObj.mainDiv.innerHTML = `
  <div id = "main-screen">무대</div>
  <div id = "main-seat">${data}</div>
  `)}
  `;
    const eventArea = document.querySelector(".event-area");
    document.body.insertBefore(divObj.containerDiv, document.body.firstChild);
  });
};

renderJoinPage();
makeSeat();
