import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import WelcomePage from "./pages/welcome"
import DifficultyPage from "./pages/difficulty"
import GamePage from "./pages/game"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/difficulty" element={<DifficultyPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  )
}
