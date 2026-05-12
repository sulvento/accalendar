import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./ThemeContext"

import Welcome from "./screens/Welcome"
import CalendarMain from "./Components/CalendarNew/CalendarMain"

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/calendar" element={<CalendarMain />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;