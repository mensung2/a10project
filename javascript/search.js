const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMWNjN2I5YzczNmEzZDg4MWMwNzUyZTVhNzI1NWE5YiIsInN1YiI6IjY2MjViODQ3MjU4ODIzMDE3ZDkyMmM2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.F6EJrBQXrAlZmikcp8C38XXxn8_UkWZ6PZw0NA9z0a0'
    }
};

fetch('https://api.themoviedb.org/3/movie/now_playing?region=KR&language=ko-KR&page=1', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

const searchBox = document.querySelector(".search-txt");
const searchButton = document.querySelector(".search-btn");
const cardList = document.querySelector(".card-list");
const movieCards = document.querySelectorAll('.movie-card');

searchButton.addEventListener('click', async function (event) {
    event.preventDefault();
    const searchText = searchBox.value.trim().toLowerCase();
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchText}&region=KR&language=ko-KR&api_key=01cc7b9c736a3d881c0752e5a7255a9b`)
        .then(response => response.json())
        .catch(err => console.error(err));
    console.log(res)
    movieCards.innerHtml = '';
    res.results.forEach(data => {
        console.log(data);
        const div = document.createElement("div");
        div.setAttribute("class", "movie-card");
        div.setAttribute("id", "data.id")

        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/w300/${data.poster_path}`;

        const title = document.createElement("h3");
        title.innerText = data.title;

        const overview = document.createElement("p");
        overview.innerText = data.overview;

        div.append(img, title, overview,);
        cardList.append(div);
    });
});