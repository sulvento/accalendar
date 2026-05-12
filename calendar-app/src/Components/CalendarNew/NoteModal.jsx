import { useTheme } from "../../ThemeContext"

function NoteModal({ selectedDate, noteText, setNoteText, saveNote, closeModal }) {
  const { theme } = useTheme()

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
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: theme.surface,
        color: theme.text,
        padding: "20px",
        borderRadius: "10px",
        width: "320px",
        boxShadow: theme.modalShadow
      }}>
        <h3 style={{ marginTop: 0, color: theme.text }}>Post-it Note</h3>
        <p style={{ fontSize: "14px", marginBottom: "10px", color: theme.textMuted }}>
          {selectedDate}
        </p>

        <textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Write a note for this day..."
          rows={5}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.surfaceAlt,
            color: theme.text,
            resize: "none",
            boxSizing: "border-box"
          }}
        />

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "15px"
        }}>
          <button style={buttonStyle} onClick={closeModal}>Cancel</button>
          <button style={buttonStyle} onClick={saveNote}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default NoteModal