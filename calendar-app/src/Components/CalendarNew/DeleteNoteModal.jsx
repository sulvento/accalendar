function DeleteNoteModal({ note, confirmDelete, cancelDelete }) {
  const preview = note.length > 100 ? note.slice(0, 100) + "..." : note

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
        width: "340px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
      }}>
        <h3 style={{ marginTop: 0 }}>Delete this note?</h3>

        <p style={{ fontSize: "14px" }}>
          Preview:
        </p>

        <div style={{
          backgroundColor: "#fff4a8",
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
          <button onClick={cancelDelete}>No</button>
          <button onClick={confirmDelete}>Yes</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteNoteModal