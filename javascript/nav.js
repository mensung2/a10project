const backgSpaceButton = document.getElementById("section-container-button");

backgSpaceButton.addEventListener("click", (e) => {
  console.log("e", e);
  history.go(1);
});
