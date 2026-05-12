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

function AssignmentModal({ assignment, closeModal }) {
  const { theme } = useTheme()

  function cleanDescription(htmlText) {
    if (!htmlText) {
      return "No description available"
    }

    const temp = document.createElement("div")
    temp.innerHTML = htmlText

    const text = temp.textContent || temp.innerText || ""
    return text.trim()
  }

  const description = cleanDescription(assignment.description)
  const statusColor = getStatusColor(assignment.submissionStatus, theme)
  const statusLabel = getStatusLabel(assignment.submissionStatus)

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: theme.modalOverlay,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: theme.surface,
        color: theme.text,
        padding: "22px",
        borderRadius: "12px",
        width: "420px",
        maxHeight: "75vh",
        overflowY: "auto",
        boxShadow: theme.modalShadow
      }}>
        <h3 style={{ marginTop: 0, marginBottom: "12px", color: theme.text }}>
          {assignment.title}
        </h3>

        <p><strong>Course:</strong> {assignment.course}</p>
        <p><strong>Due Date:</strong> {assignment.dueDate}</p>

        {assignment.type && (
          <p><strong>Type:</strong> {assignment.type}</p>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: "8px 0"
        }}>
          <strong>Status:</strong>
          <span style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: statusColor,
            border: assignment.submissionStatus === "unsubmitted"
              ? `1px solid ${theme.textMuted}`
              : "none",
            flexShrink: 0
          }} />
          <span>{statusLabel}</span>
        </div>

        {assignment.submissionStatus === "graded" &&
         assignment.score != null &&
         assignment.pointsPossible != null && (
          <p>
            <strong>Score:</strong> {assignment.score} / {assignment.pointsPossible}
          </p>
        )}

        <div style={{ marginTop: "12px" }}>
          <strong>Description:</strong>
          <p style={{
            fontSize: "14px",
            lineHeight: "1.4",
            maxHeight: "180px",
            overflowY: "auto",
            backgroundColor: theme.surfaceAlt,
            color: theme.text,
            padding: "10px",
            borderRadius: "8px",
            whiteSpace: "pre-wrap"
          }}>
            {description.length > 800
              ? description.slice(0, 800) + "..."
              : description}
          </p>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "15px"
        }}>
          <button
            onClick={closeModal}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.surfaceAlt,
              color: theme.text,
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssignmentModal