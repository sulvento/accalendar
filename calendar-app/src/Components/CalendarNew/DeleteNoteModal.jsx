import { useTheme } from "../../ThemeContext"

function DeleteNoteModal({ note, confirmDelete, cancelDelete }) {
  const { theme } = useTheme()
  const preview = note.length > 100 ? note.slice(0, 100) + "..." : note

  const buttonStyle = {
    padding: "6px 14px",
    borderRadius: "6px",
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.surfaceAlt,
    color: theme.text,
    cursor: "pointer"
  }

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
      alignItems: "center"
    }}>
      <div style={{
        backgroundColor: theme.surface,
        color: theme.text,
        padding: "20px",
        borderRadius: "10px",
        width: "340px",
        boxShadow: theme.modalShadow
      }}>
        <h3 style={{ marginTop: 0, color: theme.text }}>Delete this note?</h3>

        <p style={{ fontSize: "14px", color: theme.textMuted }}>
          Preview:
        </p>

        <div style={{
          backgroundColor: theme.note,
          color: theme.noteText,
          padding: "8px",
          borderRadius: "6px",
          fontSize: "13px",
          whiteSpace: "pre-wrap",
          marginBottom: "15px"
        }}>
          {preview}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px"
        }}>
          <button style={buttonStyle} onClick={cancelDelete}>No</button>
          <button style={buttonStyle} onClick={confirmDelete}>Yes</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteNoteModal