import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './layout'
import Dashboard from './pages/dashboard'
import Planning from './pages/planning'
import Goal from './pages/goal'
import Bank from './pages/bank'
import Chat from './pages/chat'
import CategoryDetails from './pages/planning/category-details'
import Wallets from './pages/bank/wallets'
import Transactions from './pages/bank/transactions/index'
import Login from './pages/login'
import { Files } from './pages/document'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/planning' element={<Planning />} />
          <Route path='/planning/:id' element={<CategoryDetails />} />
          <Route path='/goals' element={<Goal />} />
          <Route path='/bank' element={<Bank />} />
          <Route path='/bank/wallets' element={<Wallets />} />
          <Route path='/bank/transactions' element={<Transactions />} />
          <Route path='/files' element={<Files />} />
          <Route path='/chat' element={<Chat />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
