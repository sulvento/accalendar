import { ACCESS_TOKEN } from "./apikey.js";

const URSINUS_API_URL = "https://ursinus.instructure.com/api/graphql";

const query = `
  query MyQuery {
    allCourses {
      account {
        name
      }
      name
    }
    assignment(id: "259451") {
      name
      courseId
      description
      dueAt
      gradingType
      _id
      submissionsConnection {
        nodes {
          _id
          state
          score
          grade
          gradedAt
          late
          missing
          submittedAt
          attempt
          user {
            _id
            name
            email
            sortableName
          }
        }
      }
    }
  }
`;

const response = await fetch(URSINUS_API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${ACCESS_TOKEN}`,
  },
  body: JSON.stringify({ query }),
});

const data = await response.json();
console.log(response.status);
console.log(data);