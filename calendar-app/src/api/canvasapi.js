import { ACCESS_TOKEN } from "./apikey.js";

const URSINUS_API_URL = "https://ursinus.instructure.com/api/graphql";

async function graphqlRequest(query) {
  const response = await fetch(URSINUS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

const coursesData = await graphqlRequest(`
  query {
    allCourses {
      _id
      name
      state
      assignmentsConnection {
        nodes {
          _id
          name
        }
      }
    }
  }
`);

const courses = coursesData.data.allCourses.filter(
  (c) => c.state === "available"
);

for (const course of courses) {
  const assignments = course.assignmentsConnection?.nodes ?? [];
  console.log(`\n=== ${course.name} (${assignments.length} assignments) ===`);

for (const assignment of assignments) {
  const detail = await graphqlRequest(`
    query {
      assignment(id: "${assignment._id}") {
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
  `);

  if (detail.errors) {
    console.warn(`  ⚠ GraphQL error for "${assignment.name}":`, detail.errors[0].message);
    continue;
  }

  const a = detail.data?.assignment;
  if (!a) {
    continue;
  }

  console.log(`\n  Assignment: ${a.name}`);
  console.log(`  Due: ${a.dueAt}`);
  console.log(`  Grading: ${a.gradingType}`);
  console.log(`  Submissions: ${a.submissionsConnection.nodes.length}`);
}}
