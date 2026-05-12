import { useTheme } from "../../ThemeContext"

function FilterBar({ filter, setFilter, availableTags }) {
  const { theme } = useTheme()

  const buttonStyle = (val) => ({
    margin: "4px 6px",
    padding: "8px 14px",
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
    backgroundColor: filter === val ? theme.accentBg : theme.surface,
    color: filter === val ? theme.accentText : theme.text,
    cursor: "pointer"
  })

  const tabs = ["ALL", ...availableTags]

  return (
    <div style={{
      textAlign: "center",
      marginBottom: "20px",
      maxWidth: "900px",
      margin: "0 auto 20px"
    }}>
      {tabs.map(tag => (
        <button
          key={tag}
          style={buttonStyle(tag)}
          onClick={() => setFilter(tag)}
        >
          {tag === "ALL" ? "All" : tag}
        </button>
      ))}
    </div>
  )
}

export default FilterBar