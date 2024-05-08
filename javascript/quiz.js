const getNav = () => {
  fetch("../nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-nav").innerHTML = data;
    })
    .catch((error) => console.error("Error:", error));
};

getNav();
