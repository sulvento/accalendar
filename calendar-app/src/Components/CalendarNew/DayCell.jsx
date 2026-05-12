import { useTheme } from "../../ThemeContext"

function DayCell({
  day,
  assignments,
  note,
  openNoteModal,
  setSelectedAssignment,
  isToday,
  onDeleteNote
}) {
  const { theme } = useTheme()

  return (
    <div
      onClick={openNoteModal}
      style={{
        border: isToday ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
        borderRadius: "10px",
        minHeight: "110px",
        padding: "8px",
        backgroundColor: isToday ? theme.accentBg : theme.surface,
        color: theme.text,
        boxShadow: theme.shadow,
        cursor: "pointer"
      }}
    >
      <div style={{
        fontWeight: "bold",
        marginBottom: "6px",
        color: isToday ? theme.accentText : theme.text
      }}>
        {day}
      </div>

      {assignments.map(a => (
        <div
          key={a.id}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedAssignment(a)
          }}
          style={{
            fontSize: "12px",
            marginBottom: "5px",
            padding: "4px 6px",
            backgroundColor: theme.chip,
            color: theme.chipText,
            borderRadius: "6px"
          }}
        >
          {a.title} ({a.course})
        </div>
      ))}

      {note && (
        <div
          style={{
            marginTop: "8px",
            padding: "6px",
            backgroundColor: theme.note,
            color: theme.noteText,
            borderRadius: "6px",
            fontSize: "12px",
            whiteSpace: "pre-wrap",
            position: "relative"
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDeleteNote()
            }}
            style={{
              position: "absolute",
              top: "3px",
              right: "4px",
              border: "none",
              backgroundColor: "transparent",
              color: theme.noteText,
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ×
          </button>

          <div style={{ paddingRight: "16px" }}>
            {note}
          </div>
        </div>
      )}
    </div>
  )
}

export default DayCell