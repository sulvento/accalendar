import { useState, useEffect } from "react"
import { useTheme } from "../../ThemeContext"

function ClassesSidebar() {
  const { theme } = useTheme()
  const [courses, setCourses] = useState([])
  const [expanded, setExpanded] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:3001/courses")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.log("Error loading courses:", err)
        setLoading(false)
      })
  }, [])

  function getGradeColor(score) {
    if (score == null) return theme.textMuted
    if (score >= 90) return theme.statusSubmitted
    if (score >= 80) return theme.statusGraded
    if (score >= 70) return theme.accentText
    return theme.statusMissing
  }

  function formatScore(score, grade) {
    if (score == null) return "No grade yet"
    const pct = Number(score).toFixed(1) + "%"
    return grade ? `${pct} (${grade})` : pct
  }

  return (
    <div style={{
      position: "fixed",
      top: "70px",
      left: 0,
      zIndex: 90,
      display: "flex",
      alignItems: "flex-start"
    }}>
      {expanded && (
        <div style={{
          width: "240px",
          maxHeight: "calc(100vh - 100px)",
          backgroundColor: theme.surface,
          color: theme.text,
          padding: "14px",
          borderRadius: "0 12px 12px 0",
          border: `1px solid ${theme.border}`,
          borderLeft: "none",
          boxShadow: theme.shadow,
          overflowY: "auto",
          boxSizing: "border-box"
        }}>
          <h3 style={{
            margin: "0 0 12px 0",
            fontSize: "16px",
            color: theme.text
          }}>
            My Classes
          </h3>

          {loading && (
            <p style={{ fontSize: "13px", color: theme.textMuted, margin: 0 }}>
              Loading...
            </p>
          )}

          {!loading && courses.length === 0 && (
            <p style={{ fontSize: "13px", color: theme.textMuted, margin: 0 }}>
              No classes found.
            </p>
          )}

          {courses.map(c => (
            <div key={c.id} style={{
              padding: "10px",
              marginBottom: "8px",
              borderRadius: "8px",
              backgroundColor: theme.surfaceAlt,
              border: `1px solid ${theme.borderSoft}`
            }}>
              <div
                title={c.name}
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  color: theme.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {c.name}
              </div>

              {c.courseCode && c.courseCode !== c.name && (
                <div style={{
                  fontSize: "11px",
                  color: theme.textMuted,
                  marginBottom: "4px"
                }}>
                  {c.courseCode}
                </div>
              )}

              <div style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: getGradeColor(c.currentScore)
              }}>
                {formatScore(c.currentScore, c.currentGrade)}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        title={expanded ? "Hide classes" : "Show classes"}
        aria-label={expanded ? "Hide classes panel" : "Show classes panel"}
        style={{
          padding: "12px 6px",
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: "0 8px 8px 0",
          border: `1px solid ${theme.border}`,
          borderLeft: "none",
          backgroundColor: theme.surface,
          color: theme.text,
          cursor: "pointer",
          boxShadow: theme.shadow,
          minHeight: "60px",
          alignSelf: "center"
        }}
      >
        {expanded ? "◀" : "▶"}
      </button>
    </div>
  )
}

export default ClassesSidebar