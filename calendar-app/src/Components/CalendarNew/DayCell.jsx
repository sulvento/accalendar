import { useTheme } from "../../ThemeContext"

function getStatusColor(status, theme) {
  if (status === "submitted") return theme.statusSubmitted
  if (status === "graded") return theme.statusGraded
  if (status === "missing") return theme.statusMissing
  return theme.statusUnsubmitted
}

function getStatusLabel(status) {
  if (status === "submitted") return "Submitted"
  if (status === "graded") return "Graded"
  if (status === "missing") return "Missing"
  return "Not submitted"
}

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
        cursor: "pointer",
        minWidth: 0,
        overflow: "hidden"
      }}
    >
      <div style={{
        fontWeight: "bold",
        marginBottom: "6px",
        color: isToday ? theme.accentText : theme.text
      }}>
        {day}
      </div>

      {assignments.map(a => {
        const statusColor = getStatusColor(a.submissionStatus, theme)
        const statusLabel = getStatusLabel(a.submissionStatus)

        return (
          <div
            key={a.id}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedAssignment(a)
            }}
            title={`${a.title} — ${statusLabel}`}
            style={{
              fontSize: "12px",
              marginBottom: "5px",
              padding: "4px 6px",
              backgroundColor: theme.chip,
              color: theme.chipText,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              minWidth: 0
            }}
          >
            <span
              aria-label={statusLabel}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: statusColor,
                flexShrink: 0,
                border: a.submissionStatus === "unsubmitted"
                  ? `1px solid ${theme.textMuted}`
                  : "none"
              }}
            />
            <span style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              flex: 1
            }}>
              {a.title} ({a.course})
            </span>
          </div>
        )
      })}

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