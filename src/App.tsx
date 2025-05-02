
import './App.css'
import { BrowserRouter, Navigate, Route,  Routes } from 'react-router-dom'

import EditEmployee from './pages/edit-employee'
import AddEmployee from './pages/create-employee'
import Home from './pages/home'
import { Toaster } from 'react-hot-toast';
import ViewEmployee from './pages/view-employee'

function App() {
 

  return (
    <>
    <Toaster/>
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<Navigate to="/employees" />} />
        <Route path="/employees" element={<Home />} />
        <Route path="/employees/add" element={<AddEmployee />} />
        <Route path="/employees/edit/:id" element={<EditEmployee />} />
        <Route path="/employees/view/:id" element={<ViewEmployee/>}/>
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App
