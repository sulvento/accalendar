function NoteModal({ selectedDate, noteText, setNoteText, saveNote, closeModal }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.3)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        width: "320px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
      }}>
        <h3 style={{ marginTop: 0 }}>Post-it Note</h3>
        <p style={{ fontSize: "14px", marginBottom: "10px" }}>
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
            border: "1px solid #cfd8e3",
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
          <button onClick={closeModal}>Cancel</button>
          <button onClick={saveNote}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default NoteModal