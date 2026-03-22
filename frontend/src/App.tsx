import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Planning from './pages/planning'
import './App.css'
import Sidebar from './components/sidebar'

function App() {

  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Planning />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
