const searchButton = document.getElementsByClassName("search-btn");
const searchInput = document.getElementsByClassName("search-txt");
let searchCount = 0;
let movieName = "";
const search = () => {
  searchInput[0].addEventListener("blur", (e) => {
    e.preventDefault();
    movieName = e.target.value;
    localStorage.setItem("movieName", JSON.stringify(e.target.value));
  });
  searchInput[0].parentElement.addEventListener("submit", e => {
    e.preventDefault();
    movieName = e.target[0].value;
    localStorage.setItem("movieName", JSON.stringify(e.target[0].value));
    window.location.href = "../search.html";
  })
}
  

const button = () =>
  searchButton[0].addEventListener("click", async (e) => {
    e.preventDefault();
    window.location.href = "../search.html";
  });
