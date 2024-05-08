const searchButton = document.getElementsByClassName("search-btn");
const searchInput = document.getElementsByClassName("search-txt");
let searchCount = 0;
let movieName = "";
searchInput[0].addEventListener("change", (e) => {
  movieName = e.target.value;
  localStorage.setItem("movieName", JSON.stringify(e.target.value));
});

searchButton[0].addEventListener("click", async (e) => {
  e.preventDefault();
  window.location.href = "../search.html";
});
