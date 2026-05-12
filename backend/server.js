require("dotenv").config()

const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express()
const PORT = 3001
const notesFile = "notes.json"

app.use(cors())
app.use(express.json())

const SEMESTER_PREFIXES = new Set([
  "FA", "SP", "SU", "WI", "F", "S", "W",
  "FALL", "SPRING", "SUMMER", "WINTER"
])

function deriveDepartmentTag(course) {
  const code = (course.course_code || "").trim()
  const name = (course.name || "").trim()

  if (code) {
    const chunks = code.split(/[\s\-_./]+/)
    for (const chunk of chunks) {
      if (/^[A-Za-z]{2,5}$/.test(chunk)) {
        const upper = chunk.toUpperCase()
        if (!SEMESTER_PREFIXES.has(upper)) {
          return upper
        }
      }
    }

    const match = code.match(/[A-Za-z]{2,6}/)
    if (match) {
      const upper = match[0].toUpperCase()
      if (!SEMESTER_PREFIXES.has(upper)) {
        return upper
      }
    }
  }

  if (name) {
    const firstWord = name.split(/\s+/)[0]
    if (/^[A-Za-z]{2,5}$/.test(firstWord)) {
      return firstWord.toUpperCase()
    }
  }

  return "OTHER"
}

const assignments = [
  {
    id: 1,
    title: "CS Homework",
    dueDate: "2026-03-05",
    course: "Intro to Computer Science",
    tag: "CS",
    type: "Homework",
    status: "Not Started",
    submissionStatus: "submitted",
    description: "Mock Canvas assignment details for frontend testing."
  },
  {
    id: 2,
    title: "Math Quiz",
    dueDate: "2026-03-12",
    course: "Linear Algebra",
    tag: "MATH",
    type: "Quiz",
    status: "Upcoming",
    submissionStatus: "unsubmitted",
    description: "Mock Canvas assignment details for frontend testing."
  },
  {
    id: 3,
    title: "Essay Draft",
    dueDate: "2026-03-18",
    course: "Technical Writing",
    tag: "ENG",
    type: "Essay",
    status: "Upcoming",
    submissionStatus: "unsubmitted",
    description: "Mock Canvas assignment details for frontend testing."
  }
]

const mockCourses = [
  {
    id: 1,
    name: "Intro to Computer Science",
    courseCode: "CS",
    tag: "CS",
    currentScore: 87.5,
    currentGrade: "B+"
  },
  {
    id: 2,
    name: "Linear Algebra",
    courseCode: "MATH",
    tag: "MATH",
    currentScore: 92.3,
    currentGrade: "A-"
  },
  {
    id: 3,
    name: "Technical Writing",
    courseCode: "ENG",
    tag: "ENG",
    currentScore: 78.0,
    currentGrade: "C+"
  }
]

function readNotes() {
  if (!fs.existsSync(notesFile)) {
    return {}
  }

  const data = fs.readFileSync(notesFile, "utf8")
  return data ? JSON.parse(data) : {}
}

function saveNotes(notes) {
  fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2))
}

function deriveSubmissionStatus(submission) {
  if (!submission) {
    return "unsubmitted"
  }

  if (submission.missing) {
    return "missing"
  }

  const state = submission.workflow_state

  if (state === "graded") {
    return "graded"
  }

  if (state === "submitted" || state === "pending_review") {
    return "submitted"
  }

  if (submission.submitted_at) {
    return "submitted"
  }

  return "unsubmitted"
}

app.get("/debug", (req, res) => {
  res.json({
    useCanvasRaw: process.env.USE_CANVAS,
    useCanvasTrimmed: (process.env.USE_CANVAS || "").trim(),
    canvasBaseUrl: process.env.CANVAS_BASE_URL,
    hasToken: !!process.env.CANVAS_TOKEN
  })
})

app.get("/assignments", async (req, res) => {
  const useCanvas = (process.env.USE_CANVAS || "").trim()

  if (useCanvas !== "true") {
    return res.json(assignments)
  }

  try {
    const headers = {
      Authorization: `Bearer ${process.env.CANVAS_TOKEN}`
    }

    const coursesRes = await fetch(
      `${process.env.CANVAS_BASE_URL}/api/v1/courses?enrollment_state=active&per_page=100`,
      { headers }
    )

    if (!coursesRes.ok) {
      const text = await coursesRes.text()

      return res.status(coursesRes.status).json({
        error: "Could not fetch Canvas courses",
        status: coursesRes.status,
        details: text
      })
    }

    const courses = await coursesRes.json()
    console.log("Number of courses:", courses.length)

    const allAssignments = []

    for (const course of courses) {
      const courseTag = deriveDepartmentTag(course)

      const assignmentsRes = await fetch(
        `${process.env.CANVAS_BASE_URL}/api/v1/courses/${course.id}/assignments?include[]=submission&per_page=100`,
        { headers }
      )

      if (!assignmentsRes.ok) {
        console.log("Could not fetch assignments for", course.name)
        continue
      }

      const courseAssignments = await assignmentsRes.json()
      console.log(course.name, "[", courseTag, "] assignments:", courseAssignments.length)

      courseAssignments.forEach(a => {
        if (a.due_at) {
          const submissionStatus = deriveSubmissionStatus(a.submission)

          allAssignments.push({
            id: a.id,
            title: a.name || "Canvas Assignment",
            dueDate: a.due_at.slice(0, 10),
            course: course.name || "Canvas",
            tag: courseTag,
            type: "Canvas Assignment",
            status: "Canvas",
            submissionStatus: submissionStatus,
            score: a.submission ? a.submission.score : null,
            pointsPossible: a.points_possible || null,
            description: a.description || "No description available"
          })
        }
      })
    }

    res.json(allAssignments)
  } catch (err) {
    console.log("Canvas fetch error:", err)
    res.status(500).json({ error: "Could not fetch Canvas assignments" })
  }
})

app.get("/courses", async (req, res) => {
  const useCanvas = (process.env.USE_CANVAS || "").trim()

  if (useCanvas !== "true") {
    return res.json(mockCourses)
  }

  try {
    const headers = {
      Authorization: `Bearer ${process.env.CANVAS_TOKEN}`
    }

    const coursesRes = await fetch(
      `${process.env.CANVAS_BASE_URL}/api/v1/courses?enrollment_state=active&include[]=total_scores&per_page=100`,
      { headers }
    )

    if (!coursesRes.ok) {
      const text = await coursesRes.text()

      return res.status(coursesRes.status).json({
        error: "Could not fetch Canvas courses",
        status: coursesRes.status,
        details: text
      })
    }

    const courses = await coursesRes.json()

    const result = courses.map(c => {
      const enrollments = c.enrollments || []
      const studentEnrollment =
        enrollments.find(e => e.type === "student" || e.type === "StudentEnrollment") ||
        enrollments[0]

      return {
        id: c.id,
        name: c.name || "Unnamed course",
        courseCode: c.course_code || "",
        tag: deriveDepartmentTag(c),
        currentScore: studentEnrollment ? studentEnrollment.computed_current_score : null,
        currentGrade: studentEnrollment ? studentEnrollment.computed_current_grade : null
      }
    })

    res.json(result)
  } catch (err) {
    console.log("Canvas courses fetch error:", err)
    res.status(500).json({ error: "Could not fetch courses" })
  }
})

app.get("/notes", (req, res) => {
  res.json(readNotes())
})

app.post("/notes", (req, res) => {
  const notes = readNotes()
  const { date, note } = req.body

  notes[date] = note
  saveNotes(notes)

  res.json(notes)
})

app.delete("/notes/:date", (req, res) => {
  const notes = readNotes()
  const date = req.params.date

  delete notes[date]
  saveNotes(notes)

  res.json(notes)
})

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT)
})