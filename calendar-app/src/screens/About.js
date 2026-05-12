import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Btn/Button"

function About() {
  const [revealed, setRevealed] = useState([false, false, false, false, false, false]);
  const navigate = useNavigate();

  const toggleCard = (index) => {
    const updated = [...revealed];
    updated[index] = !updated[index];
    setRevealed(updated);
  };

  const cards = [
    "Thank you for trying out Accalendar a team of three developers: AJ Luthra, Owen Fazzani, and Aleni Vosk. We spent 6 months designing and developing this unified calendar application that automates the synchronization of academic deadlines and personal events",
    "This app helps you manage your schedule efficiently.",
    "Built using React and TailwindCSS for modern UI.",
    "Includes interactive features and animations.",
    "Designed to improve productivity and organization.",
    "We hope that our efforts to mitigate human efforts to plan events and todos through automated innovation using the Canvas API as a middle-man between Canvas and Accalendar"
  ];

    return (
    <div className="bg-gray-900 min-h-screen flex flex-col">

      <Button onClick={() => navigate("/")} className="bg-yellow-600 hover:bg-red-700 text-4x1">
        Back to Welcome
      </Button>

      {/* Page content */}
      <div className="flex flex-col items-center justify-center p-8 flex-grow">
        <h1 className="text-white text-3xl font-bold mb-8">
          About This App
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          {cards.map((text, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col justify-between"
            >
              <p
                className={`text-white text-lg transition duration-300 ${
                  revealed[index] ? "blur-0" : "blur-sm"
                }`}
              >
                {text}
              </p>

              <button
                onClick={() => toggleCard(index)}
                className="mt-4 bg-yellow-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
              >
                {revealed[index] ? "Hide" : "Reveal"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}

export default About;