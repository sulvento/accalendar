import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom"

import Welcome from "./screens/Welcome"
import CalendarMain from "./Components/CalendarNew/CalendarMain"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/calendar" element={<CalendarMain />} />
    </Routes>
  );
}

export default App;