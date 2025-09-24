import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './style/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Pronps" element={<Pronps />} />
        <Route path="/States" element={<Contador />} />
      </Routes>
    </Router>
  )
}

export default App
