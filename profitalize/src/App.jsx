import React from 'react'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Navbar from './Components/Navbar';

import {Home, Profits, Products} from './Pages';


const App = () => {
  return (
    <main>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/profits' element={<Profits/>}/>
          <Route path='/products' element={<Products/>}/>
        </Routes>
      </Router>
    </main>
  )
}

export default App
