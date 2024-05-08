// html에 div태그를 만들어주는 함수
const createDiv = (id, text) => {
  const div = document.createElement("div");
  div.id = id;
  div.innerText = text;
  return div;
};

const makeGuideDivObj = () => {
  const containerDiv = createDiv("event-guide-container", "");
  const headerDiv = createDiv("event-guide-header", "");
  const sectionDiv = createDiv("event-guide-section", "");
  const eventDiv = createDiv("event-guide-event", "");
  return { containerDiv, headerDiv, sectionDiv, eventDiv };
};

const getNav = () => {
  fetch("./nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("eventGuide-nav").innerHTML = data;
    })
    .catch((error) => console.error("Error:", error));
};

const renderGuidPage = async () => {
  const divObj = makeGuideDivObj();
  divObj.containerDiv.innerHTML = `
  ${(divObj.headerDiv.innerHTML = `<div id='eventGuide-nav'>${getNav()}</div>`)}
  ${(divObj.sectionDiv.innerHTML = `
  <div id = 'section-container'>
  
  </div>
  `)}
  ${(divObj.eventDiv.innerHTML = `
  <div id = 'event-container'>
    <div id = 'event-container-banner'></div>
    <div id = 'event-container-tickets'>
      <div id = 'tickets-header'>
          당첨 상품
      </div>
      <div id = 'tickets-section'>
        <div class='tickets-box'>
          <div id = 'tickets-section-vip'></div>
          <div id ='tickets-name'>VIP석 티켓</div>
        </div>
        <div class='tickets-box'>
          <div id = 'tickets-section-R'></div>
          <div id ='tickets-name'>R석 티켓</div>
        </div>
        <div class='tickets-box'>
          <div id = 'tickets-section-S'></div>
          <div id ='tickets-name'>S석 티켓</div>
        </div>
        <div class='tickets-box'>
          <div id = 'tickets-section-A'></div>
          <div id ='tickets-name'>A석 티켓</div>
        </div>
    </div>
    
    <div id = 'event-container-process'>
      <div id ='process-header'>
        참여 방법
      </div>
      <div id = 'process-section'>
        <div id = 'process-section-header'>
          <div id='process-section-coin-left'></div>
          <div>
            <div>로그인 시 동전 한 개 지급!</div>
            <div>이벤트 퀴즈 완료 시 동전 한 개 추가 지급!</div>
          </div>
          <div id='process-section-coin-right'></div>
        </div>
        <div id = 'process-section-ticket-text'>티켓부스 페이지에서 티켓 발권하기!</div>
        <div class="process-section-button">
        <div class="topside"></div>
        <div class="frontside">티켓 뽑으러 가기</div>
        </div>
      </div>
    </div>
  </div>

  }

    `)}
  `;

  document.body.appendChild(divObj.containerDiv);

  const ticketButton = document.querySelector(".process-section-button");
  ticketButton.addEventListener("click", (e) => {
    // window.location.href = "../event.html";
    console.log("window.location.search", ticketButton.search);
    console.log("yes");
  });

  const backgSpaceButton = document.getElementById("section-container-button");
  backgSpaceButton.addEventListener("click", (e) => {
    history.go(-1);
  });
};

renderGuidPage();
