// window.onload = function() {
//     const slide = document.querySelector(".slide");
//     let slideWidth = slide.clientWidth;

//     const prevBtn = document.querySelector(".prev");
// const nextBtn = document.querySelector(".next");

// const slideItems = document.querySelectorAll(".slide_item");
// }

function nextevent() {  
    const element = document.getElementById('review1');
    element.style.cssText= `display: none;`
    const element2 = document.getElementById('review2');
    element2.style.cssText= `display: flex;
    flex-grow: 1;
    justify-content: space-around; 
    position: relative;`
    const element3 = document.getElementById('next');
    element3.style.cssText= `background-color: white;`
}