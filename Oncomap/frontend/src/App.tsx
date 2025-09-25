
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from './pages/HomePage'
import MapaPege from "./pages/MapaPage"
import Layout from "./components/layout_sidebar"

function App() {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route element={<Layout />}>
          <Route path="/mapa" element={<MapaPege/>}/>
          /* adicionar outras rotas quando as paginas estiverem prontas */
        </Route>
      </Routes>
    </Router>
  )
}

export default App
