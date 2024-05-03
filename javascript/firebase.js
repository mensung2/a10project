const firebaseConfig = {
  apiKey: "AIzaSyA0bvK3aqUn-tmgdMS-2ItBGk8aDdOALwQ",
  authDomain: "ch2-a10-project.firebaseapp.com",
  projectId: "ch2-a10-project",
  storageBucket: "ch2-a10-project.appspot.com",
  messagingSenderId: "236736436837",
  appId: "1:236736436837:web:26943cd8b7f658105dc48c",
  measurementId: "G-YJHEL1VHLE",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Firebase POST data
// const postData = async () => {
//   const docRef = await db.collection("event").doc("tickets");
//   docRef.get().then((doc) => {
//     console.log(doc.data());
//   });
//   db.collection("event")
//   .get()
//   .then(function (querySnapshot) {
//     querySnapshot.forEach(function (doc) {
//       console.log(doc.id, " => ", doc.data());
//       currTime = doc.data()["units"];
//       console.log(currTime);
//       db.collection("cat")
//         .doc("wakeUpTime")
//         .update({ time: Number(currTime) + 1 });
//     });
//   });
// };
const getData = async () => {
  let result;
  await db
    .collection("event")
    .doc("tickets")
    .get()
    .then((doc) => {
      result = doc.data()["units"];
    });
  // docRef.get().then((doc) => {
  //   data = doc.data()["units"];
  //   ticketCounter.innerText = doc.data()["units"];
  //   return data;
  // });
  return result;
};

const readData = async () => {
  const data = await getData();
  console.log(data);
  return data;
};

const updateData = async () => {
  const data = await getData();

  db.collection("event")
    .doc("tickets")
    .update({ units: Number(data) - Number(1) });

  const currData = await getData();
  console.log(currData);
};

// console.log(getData());

readData();

// db.collection("event").doc("kwak").set({
//   username: "kwak",
//   description: "hello",
//   date: new Date(),
// });
