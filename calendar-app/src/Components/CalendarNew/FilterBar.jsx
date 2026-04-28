function FilterBar({ filter, setFilter }) {
  const buttonStyle = (val) => ({
    margin: "0 6px",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #cfd8e3",
    backgroundColor: filter === val ? "#dbe8ff" : "white",
    cursor: "pointer"
  })

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <button style={buttonStyle("ALL")} onClick={() => setFilter("ALL")}>
        All
      </button>
      <button style={buttonStyle("CS")} onClick={() => setFilter("CS")}>
        CS
      </button>
      <button style={buttonStyle("MATH")} onClick={() => setFilter("MATH")}>
        Math
      </button>
      <button style={buttonStyle("ENG")} onClick={() => setFilter("ENG")}>
        Eng
      </button>
    </div>
  )
}

export default FilterBar