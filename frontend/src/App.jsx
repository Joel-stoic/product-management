import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App


