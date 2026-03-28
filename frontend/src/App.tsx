import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './layout'
import Dashboard from './pages/dashboard'
import Planning from './pages/planning'
import Investment from './pages/investment'
import Bank from './pages/bank'
import Files from './pages/files'
import Chat from './pages/chat'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/planning' element={<Planning />} />
          <Route path='/investment' element={<Investment />} />
          <Route path='/bank' element={<Bank />} />
          <Route path='/files' element={<Files />} />
          <Route path='/chat' element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
