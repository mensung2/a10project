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


// TMDB API에서 데이터를 가져오는 함수를 정의합니다.
async function fetchMovieData(searchText) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchText}&region=KR&language=ko-KR&api_key=01cc7b9c736a3d881c0752e5a7255a9b`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

// 화면을 업데이트하는 함수를 정의합니다.
async function updateScreens() {
    const searchText = document.querySelector('.search-txt').value.trim().toLowerCase();
    const movieData = await fetchMovieData(searchText); // 영화 데이터를 가져옵니다.
    
    // 각 screen 요소에 영화 포스터를 추가합니다.
    for (let i = 0; i < 10; i++) {
        const screen = document.querySelector(`.screen${i + 1}`);
        if (movieData[i]) {
            const img = document.createElement("img");
            img.src = `https://image.tmdb.org/t/p/w300/${movieData[i].poster_path}`;
            screen.innerHTML = ''; // 이전 내용을 지웁니다.
            screen.appendChild(img); // screen에 포스터를 추가합니다.
        }
    }
}

// 검색 버튼 클릭 시 화면 업데이트 함수를 호출하여 검색 결과를 표시합니다.
document.querySelector('.search-btn').addEventListener('click', async function (event) {
    event.preventDefault();
    updateScreens();
});


// const searchBox = document.querySelector(".search-txt");
// const searchButton = document.querySelector(".search-btn");
// const cardList = document.querySelector(".card-list");
// const movieCards = document.querySelectorAll('.movie-card');

// searchButton.addEventListener('click', async function (event) {
//     event.preventDefault();
//     const searchText = searchBox.value.trim().toLowerCase();
//     const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchText}&region=KR&language=ko-KR&api_key=01cc7b9c736a3d881c0752e5a7255a9b`)
//         .then(response => response.json())
//         .catch(err => console.error(err));
//     console.log(res)
//     movieCards.innerHtml = '';
//     res.results.forEach(data => {
//         console.log(data);
//         const div = document.createElement("div");
//         div.setAttribute("class", "movie-card");
//         div.setAttribute("id", "data.id")

//         const img = document.createElement("img");
//         img.src = `https://image.tmdb.org/t/p/w300/${data.poster_path}`;

//         const title = document.createElement("h3");
//         title.innerText = data.title;

//         const overview = document.createElement("p");
//         overview.innerText = data.overview;

//         div.append(img, title, overview,);
//         cardList.append(div);
//     });
// });