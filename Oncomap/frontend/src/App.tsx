
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from './pages/HomePage'
import MapaPege from "./pages/MapaPage"
import Layout from "./components/layout_sidebar"

function App() {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="mapa" element={<MapaPege />} />  
        </Route>
      </Routes>
    </Router>
  )
}

export default App
