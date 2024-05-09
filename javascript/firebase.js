const firebaseConfig = {
  apiKey: "AIzaSyBY4779L-U1ejV32W4jl5zDYihXurQ1x78",
  authDomain: "a10movieproject.firebaseapp.com",
  projectId: "a10movieproject",
  storageBucket: "a10movieproject.appspot.com",
  messagingSenderId: "829014611906",
  appId: "1:829014611906:web:d110bade07e1b30e22685b",
  measurementId: "G-TK6D87ZPEQ",
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
  console.log("docRef", docRef);
  return docRef;
};

const getData = async (dbcollection, docName, dataName) => {
  let result;
  await db
    .collection(dbcollection)
    .doc(docName)
    .get()
    .then((doc) => {
      if (!doc.data()) {
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

db.collection("event")
  .doc("tickets")
  .get()
  .then((data) => {
    console.log(data.data());
  });

//이벤트 자리에 무비 코멘트
//티켓츠자리에 문서이름(댓글하나하나)

const newExpireDate = (minutes) => {
  return new Date().getTime() + 1000 * minutes;
};

const makeCertification = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
/**
 *
 * @param {string} certification sessions의 값이 들어갑니다
 */
const removeCertification = (certification) => {
  db.collection("sessions").doc(certification).delete();
};
/**
 *
 * @param {string} certification sessions의 값이 들어갑니다
 */
const getCertification = async (certification) => {
  const doc = await db.collection("sessions").doc(certification).get();
  if (!doc) {
    return false;
  }
  const data = await doc.data();
  return data;
};
/**
 *
 * @param {string} certification sessions의 값이 들어갑니다
 */
const saveCertification = async (userId) => {
  const newCertification = makeCertification();
  const authData = {
    isAuthenticated: true,
    expireDate: newExpireDate(30),
    userId: userId,
  };
  const result = await db
    .collection("sessions")
    .doc(newCertification)
    .set(authData);
  localStorage.setItem("sessions", newCertification);
};

const renewalCertification = async () => {
  const userSession = localStorage.getItem("sessions");
  if (!userSession) {
    alert("오류가 발생했습니다. 초기화면으로 이동합니다!");
    location.href = "./index.html";
  }
  const data = await getCertification(userSession);
  if (!data) {
    alert("오류가 발생했습니다. 초기화면으로 이동합니다!");
    location.href = "./index.html";
  }
  removeCertification(userSession);
  saveCertification(data.userId);
  console.log("authenticated!");
};

const clearCertification = async () => {
  const sessions = await db.collection("sessions").get();
  const sessionDocs = await sessions.docs;
  if (sessionDocs.length === 0) {
    console.log("DB Sessions is empty!");
    return;
  }
  sessionDocs.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    const { expireDate } = data;
    if (expireDate < new Date().getTime()) {
      removeCertification(id);
    }
  });
};

const enableAuthListener = () => {
  clearCertification();
  renewalCertification();
  setInterval(renewalCertification, 1000 * 60 * 60);
};

const currLoc = location.href;
const currPage = currLoc.split("/").pop();
console.log("currPage:", currPage);
// if (currPage !== "signup.html" && currPage !== "index.html") {
//   enableAuthListener();
// }
