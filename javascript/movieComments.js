// const postData = async (dbCollection, dataName, data, key) => {
//     const docRef = await db
//       .collection(dbCollection)
//       .doc(dataName)
//       .set({
//         [key]: data,
//         date: new Date(),
//       });

//     return docRef;
//   };

db.collection('movie-comments')
  .add({
    movieId : 'seon',
    id: 'jiwon',
    nickname: 'gwack',
    password: 123,
    text: '안녕하세요',
    score: 3,
  });


const reviewRegist = document.getElementById("writeRev");
console.log(reviewRegist);

reviewRegist.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(123);
})

