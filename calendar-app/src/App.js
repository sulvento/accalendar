import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom"
import Welcome from "./screens/Welcome"
import Calendar from "./Components/Calendar";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome/>} />
      <Route path="/calendar" element={<Calendar />} />
    </Routes>
  );
}

export default App;
