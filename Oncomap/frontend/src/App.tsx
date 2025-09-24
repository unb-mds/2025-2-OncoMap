
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './style/App.css'
import HomePage from './pages/HomePage'
import MapaPege from "./pages/MapaPage";  

function App() {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Mapa" element={<MapaPege />} />
      </Routes>
    </Router>
  )
}

export default App
