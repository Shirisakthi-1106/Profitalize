import React from 'react'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Navbar from './Components/Navbar';


import {Home, Profits, Products,ProductDisplay} from './Pages';


const App = () => {
  return (
    <main>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/profits' element={<Profits/>}/>
          <Route path='/products' element={<Products/>}/>
          <Route path="/products/:category" element={<ProductDisplay />} />

        </Routes>
      </Router>
    </main>
  )
}

export default App
