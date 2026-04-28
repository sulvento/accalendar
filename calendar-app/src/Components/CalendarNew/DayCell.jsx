function DayCell({
  day,
  assignments,
  note,
  openNoteModal,
  setSelectedAssignment,
  isToday,
  onDeleteNote
}) {
  return (
    <div
      onClick={openNoteModal}
      style={{
        border: isToday ? "2px solid #4f83ff" : "1px solid #cfd8e3",
        borderRadius: "10px",
        minHeight: "110px",
        padding: "8px",
        backgroundColor: isToday ? "#dbe8ff" : "white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        cursor: "pointer"
      }}
    >
      <div style={{
        fontWeight: "bold",
        marginBottom: "6px",
        color: isToday ? "#1d4ed8" : "black"
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
            backgroundColor: "#eef3ff",
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
            backgroundColor: "#fff4a8",
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