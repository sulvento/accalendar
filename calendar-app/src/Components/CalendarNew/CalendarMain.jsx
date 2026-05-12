import { useState, useEffect, useMemo } from "react"
import CalendarGrid from "./CalendarGrid"
import FilterBar from "./FilterBar"
import NoteModal from "./NoteModal"
import AssignmentModal from "./AssignmentModal"
import DeleteNoteModal from "./DeleteNoteModal"
import ClassesSidebar from "./ClassesSidebar"
import { useTheme } from "../../ThemeContext"

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function CalendarMain() {
  const { darkMode, setDarkMode, theme } = useTheme()
  const today = new Date()

  const [assignments, setAssignments] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [monthOffset, setMonthOffset] = useState(0)

  const [notes, setNotes] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [noteText, setNoteText] = useState("")
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [deleteDate, setDeleteDate] = useState(null)

  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1
  )

  const monthName = currentDate.toLocaleString("en-US", { month: "long" })
  const year = currentDate.getFullYear()

  const availableTags = useMemo(() => {
    const tags = new Set()
    assignments.forEach(a => {
      if (a.tag) tags.add(a.tag)
    })
    return Array.from(tags).sort()
  }, [assignments])

  useEffect(() => {
    if (filter !== "ALL" && !availableTags.includes(filter)) {
      setFilter("ALL")
    }
  }, [availableTags, filter])

  useEffect(() => {
    fetch("http://localhost:3001/notes")
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.log("Error loading notes:", err))
  }, [])

  useEffect(() => {
    fetch("http://localhost:3001/assignments")
      .then(res => res.json())
      .then(data => {
        setAssignments(data)
      })
      .catch(err => console.log("Error fetching assignments:", err))
  }, [])

  function saveNote() {
    fetch("http://localhost:3001/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDate, note: noteText })
    })
      .then(res => res.json())
      .then(data => {
        setNotes(data)
        setSelectedDate(null)
        setNoteText("")
      })
  }

  function confirmDeleteNote() {
    fetch("http://localhost:3001/notes/" + deleteDate, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(data => {
        setNotes(data)
        setDeleteDate(null)
      })
  }

  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: theme.bg,
      color: theme.text,
      minHeight: "100vh",
      position: "relative"
    }}>
      <ClassesSidebar />

      <button
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "8px 14px",
          fontSize: "14px",
          borderRadius: "8px",
          border: `1px solid ${theme.border}`,
          backgroundColor: theme.surface,
          color: theme.text,
          cursor: "pointer",
          boxShadow: theme.shadow,
          zIndex: 100,
          minWidth: "80px"
        }}
      >
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>

      <h1 style={{
        textAlign: "center",
        marginBottom: "12px",
        fontSize: "28px",
        color: theme.text
      }}>
        Accalendar
      </h1>

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        marginBottom: "22px"
      }}>
        <button
          onClick={() => setMonthOffset(monthOffset - 1)}
          style={{
            padding: "5px 10px",
            fontSize: "14px",
            borderRadius: "7px",
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.surface,
            color: theme.text,
            cursor: "pointer"
          }}
        >
          Prev
        </button>

        <button
          onClick={() => setMonthOffset(0)}
          style={{
            padding: "7px 18px",
            fontSize: "20px",
            fontWeight: "bold",
            border: "none",
            backgroundColor: "transparent",
            color: theme.text,
            cursor: "pointer"
          }}
        >
          {monthName} {year}
        </button>

        <button
          onClick={() => setMonthOffset(monthOffset + 1)}
          style={{
            padding: "5px 10px",
            fontSize: "14px",
            borderRadius: "7px",
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.surface,
            color: theme.text,
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        availableTags={availableTags}
      />
      <p style={{ textAlign: "center", fontSize: "14px", color: theme.textMuted }}>
        Loaded {assignments.length} Canvas assignments
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "10px",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        {weekDays.map(dayName => (
          <div
            key={dayName}
            style={{
              fontWeight: "bold",
              textAlign: "center",
              padding: "10px 0",
              backgroundColor: theme.weekHeader,
              color: theme.weekHeaderText,
              borderRadius: "8px"
            }}
          >
            {dayName}
          </div>
        ))}

        <CalendarGrid
          assignments={assignments}
          filter={filter}
          currentDate={currentDate}
          notes={notes}
          setSelectedDate={setSelectedDate}
          setNoteText={setNoteText}
          setSelectedAssignment={setSelectedAssignment}
          requestDeleteNote={setDeleteDate}
        />
      </div>

      {selectedDate && (
        <NoteModal
          selectedDate={selectedDate}
          noteText={noteText}
          setNoteText={setNoteText}
          saveNote={saveNote}
          closeModal={() => {
            setSelectedDate(null)
            setNoteText("")
          }}
        />
      )}

      {selectedAssignment && (
        <AssignmentModal
          assignment={selectedAssignment}
          closeModal={() => setSelectedAssignment(null)}
        />
      )}

      {deleteDate && (
        <DeleteNoteModal
          note={notes[deleteDate] || ""}
          confirmDelete={confirmDeleteNote}
          cancelDelete={() => setDeleteDate(null)}
        />
      )}
    </div>
  )
}

export default CalendarMain