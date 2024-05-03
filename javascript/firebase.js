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
const postData = async (dbCollection, dataName, data, key) => {
  const docRef = await db
    .collection(dbCollection)
    .doc(dataName)
    .set({
      [key]: data,
      date: new Date(),
    });
  localStorage.setItem("postData", true);

  return docRef;
};

const getData = async (dbcollection, docName, dataName) => {
  let result;
  await db
    .collection(dbcollection)
    .doc(docName)
    .get()
    .then((doc) => {
      result = doc.data()[dataName];
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

// readData();
