import DayCell from "./DayCell"
import { useTheme } from "../../ThemeContext"

function CalendarGrid({
  assignments,
  filter,
  currentDate,
  notes,
  setSelectedDate,
  setNoteText,
  setSelectedAssignment,
  requestDeleteNote
}) {
  const { theme } = useTheme()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const boxes = []

  for (let i = 0; i < firstDayOfMonth; i++) {
    boxes.push(
      <div
        key={"blank-" + i}
        style={{
          border: `1px solid ${theme.borderSoft}`,
          borderRadius: "10px",
          minHeight: "110px",
          padding: "8px",
          backgroundColor: theme.blankCell,
          opacity: 0.6
        }}
      ></div>
    )
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    const dayAssignments = assignments
      .filter(a => a.dueDate === fullDate)
      .filter(a => filter === "ALL" || a.tag === filter)

    const note = notes[fullDate] || ""
    const today = new Date()

    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day

    boxes.push(
      <DayCell
        key={day}
        day={day}
        assignments={dayAssignments}
        note={note}
        isToday={isToday}
        setSelectedAssignment={setSelectedAssignment}
        onDeleteNote={() => requestDeleteNote(fullDate)}
        openNoteModal={() => {
          setSelectedDate(fullDate)
          setNoteText("")
        }}
      />
    )
  }

  return <>{boxes}</>
}

export default CalendarGrid