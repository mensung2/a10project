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
  <div id = 'section-img-container'></div>
  <div id = 'section-ticket-container>asdasdasd<img id ='section-tickect-content' src = '../img/golden-ticket.svg'></div>
  `)}

  `;
  document.body.appendChild(divObj.containerDiv);
};
renderGuidPage();
