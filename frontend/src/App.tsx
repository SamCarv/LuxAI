import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Planning from './pages/planning'
import './App.css'
import Sidebar from './components/sidebar'
import Navigation from './components/navigation'

function App() {

  return (
    <BrowserRouter>
      <Sidebar />
      <Navigation />
      <Routes>
        <Route path='/' element={<Planning />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
