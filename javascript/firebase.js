const firebaseConfig = {
  apiKey: "AIzaSyBY4779L-U1ejV32W4jl5zDYihXurQ1x78",
  authDomain: "a10movieproject.firebaseapp.com",
  projectId: "a10movieproject",
  storageBucket: "a10movieproject.appspot.com",
  messagingSenderId: "829014611906",
  appId: "1:829014611906:web:d110bade07e1b30e22685b",
  measurementId: "G-TK6D87ZPEQ"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Firebase POST data
const postData = async (dbCollection, dataName, data, key) => {
  const docRef = await db
    .collection(dbCollection)
    .doc(dataName)
    .set({
      [key]: data,
      date: new Date(),
    });

  return docRef;
};

const getData = async (dbcollection, docName, dataName) => {
  let result;
  await db
    .collection(dbcollection)
    .doc(docName)
    .get()
    .then((doc) => {
      if(!doc.data()) {
        return null;
      } else {
        result = doc.data()[dataName];
      }
    });
  // docRef.get().then((doc) => {
  //   data = doc.data()["units"];
  //   ticketCounter.innerText = doc.data()["units"];
  //   return data;
  // });
  return result;
};

// console.log(getData());

// readData();

// db.collection(컬렉션이름).onSnapshot((snapshot) => {

//     snapshot.docChanges().forEach((change) => {
//     if (change.type === "added") {

//       const post = change.doc.data();
//       const id = change.doc.id;
//       //포스트 리스트에 데이터 추가된 데이터를 받아서 새로운 node로 추가.
//     } else if (change.type === "modified") {

//     } else if (change.type === "removed") {
//       // 삭제된 데이터 처리
//       const postId = change.doc.id;
//       const postElement = document.getElementById(postId);
//       if (postElement) {
//         postElement.remove();
//       }
//     }
//   });
// });

db.collection("event").doc("tickets").get().then(data => {
  console.log(data.data());
});

//이벤트 자리에 무비 코멘트
//티켓츠자리에 문서이름(댓글하나하나)
