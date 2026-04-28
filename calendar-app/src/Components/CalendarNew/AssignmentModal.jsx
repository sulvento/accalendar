function AssignmentModal({ assignment, closeModal }) {
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

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.35)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "22px",
        borderRadius: "12px",
        width: "420px",
        maxHeight: "75vh",
        overflowY: "auto",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)"
      }}>
        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>
          {assignment.title}
        </h3>

        <p><strong>Course:</strong> {assignment.course}</p>
        <p><strong>Due Date:</strong> {assignment.dueDate}</p>

        {assignment.type && (
          <p><strong>Type:</strong> {assignment.type}</p>
        )}

        {assignment.status && (
          <p><strong>Status:</strong> {assignment.status}</p>
        )}

        <div style={{ marginTop: "12px" }}>
          <strong>Description:</strong>
          <p style={{
            fontSize: "14px",
            lineHeight: "1.4",
            maxHeight: "180px",
            overflowY: "auto",
            backgroundColor: "#f5f7fb",
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
          <button onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssignmentModal