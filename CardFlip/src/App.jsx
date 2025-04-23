import React from "react"
import { Routes, Route } from "react-router-dom"
import "./App.css"
import WelcomePage from "./pages/welcome"
import DifficultyPage from "./pages/difficulty"
import GamePage from "./pages/game"

export default function App() {
  return (
      <Routes>
        <Route path="/CardFlip/" element={<WelcomePage />} />
        <Route path="/CardFlip/difficulty" element={<DifficultyPage />} />
        <Route path="/CardFlip/game" element={<GamePage />} />
      </Routes>
  )
}
