const getPersonalInfo = async () => {
  const data = await getData("auth", "peopleInfo", "personalInfo");
  const {students, tutors} = data;
  console.log(students, tutors);
}

getPersonalInfo();