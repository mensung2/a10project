const makeGuideDivObj = () => {
  const containerDiv = createDiv("event-guide-container", "");
  const headerDiv = createDiv("event-guide-header", "");
  const sectionDiv = createDiv("event-guide-section", "");
  return { containerDiv, headerDiv, sectionDiv };
};

const renderGuidPage = () => {
  const divObj = makeGuideDivObj();
  console.log(divObj);
  divObj.containerDiv.innerHTML = `
  ${(divObj.headerDiv.innerHTML = `<h1>Nav</h1>`)}
  ${(divObj.sectionDiv.innerHTML = `
  <div id = 'section-container'>
  <button id = 'section-container-button'><- 뒤로가기</button>
  <div id = 'section-container-ticket1'></div>
  <div id = 'section-container-ticket2'></div>
  <div id = 'section-container-ticket3'></div>
  <div id = 'section-container-ticket4'></div>
  </div>
  
  `)}

  `;
  document.body.appendChild(divObj.containerDiv);
  const firebaseData = getData("event", "1kDF7HJYnREWTtSvS1ck", "movies");
  firebaseData.then((data) => console.log("data", data));
};
// renderGuidPage();
