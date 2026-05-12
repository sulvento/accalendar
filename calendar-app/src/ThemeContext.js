import { createContext, useContext, useState, useEffect } from "react"

const lightTheme = {
  bg: "#f5f7fb",
  surface: "white",
  surfaceAlt: "#f5f7fb",
  text: "#1a1a1a",
  textMuted: "#6b7280",
  border: "#cfd8e3",
  borderSoft: "#e5e7eb",
  accent: "#4f83ff",
  accentBg: "#dbe8ff",
  accentText: "#1d4ed8",
  note: "#fff4a8",
  noteText: "#1a1a1a",
  chip: "#eef3ff",
  chipText: "#1a1a1a",
  weekHeader: "#dfe7f3",
  weekHeaderText: "#1a1a1a",
  blankCell: "#f3f4f6",
  modalOverlay: "rgba(0,0,0,0.35)",
  shadow: "0 1px 4px rgba(0,0,0,0.06)",
  modalShadow: "0 2px 12px rgba(0,0,0,0.2)",
  statusSubmitted: "#22c55e",
  statusGraded: "#3b82f6",
  statusMissing: "#ef4444",
  statusUnsubmitted: "#d1d5db"
}

const darkTheme = {
  bg: "#15181d",
  surface: "#22272f",
  surfaceAlt: "#1a1e24",
  text: "#e8eaed",
  textMuted: "#9aa0a6",
  border: "#3a4150",
  borderSoft: "#2c313a",
  accent: "#6b9fff",
  accentBg: "#1e3a6b",
  accentText: "#a8c5ff",
  note: "#5c4f1a",
  noteText: "#fef3b8",
  chip: "#2d3a52",
  chipText: "#dbe8ff",
  weekHeader: "#2c3441",
  weekHeaderText: "#e8eaed",
  blankCell: "#1c1f24",
  modalOverlay: "rgba(0,0,0,0.6)",
  shadow: "0 1px 4px rgba(0,0,0,0.4)",
  modalShadow: "0 4px 16px rgba(0,0,0,0.6)",
  statusSubmitted: "#4ade80",
  statusGraded: "#60a5fa",
  statusMissing: "#f87171",
  statusUnsubmitted: "#4b5563"
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode")
    return saved === "true"
  })

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  const theme = darkMode ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}