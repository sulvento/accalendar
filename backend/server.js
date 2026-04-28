require("dotenv").config()

const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express()
const PORT = 3001
const notesFile = "notes.json"

app.use(cors())
app.use(express.json())

const assignments = [
  {
    id: 1,
    title: "CS Homework",
    dueDate: "2026-03-05",
    course: "CS",
    type: "Homework",
    status: "Not Started",
    description: "Mock Canvas assignment details for frontend testing."
  },
  {
    id: 2,
    title: "Math Quiz",
    dueDate: "2026-03-12",
    course: "MATH",
    type: "Quiz",
    status: "Upcoming",
    description: "Mock Canvas assignment details for frontend testing."
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
  const assignmentsRes = await fetch(
    `${process.env.CANVAS_BASE_URL}/api/v1/courses/${course.id}/assignments?per_page=100`,
    { headers }
  )

  if (!assignmentsRes.ok) {
    console.log("Could not fetch assignments for", course.name)
    continue
  }

      const courseAssignments = await assignmentsRes.json()
      console.log(course.name, "assignments:", courseAssignments.length)

      courseAssignments.forEach(a => {
        if (a.due_at) {
          allAssignments.push({
            id: a.id,
            title: a.name || "Canvas Assignment",
            dueDate: a.due_at.slice(0, 10),
            course: course.name || "Canvas",
            type: "Canvas Assignment",
            status: "Canvas",
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