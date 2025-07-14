

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profitalyze from './Profitalyze';
import ProductDisplay from './Pages/ProductsDisplay';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Profitalyze />} />
        <Route path="/products/:category" element={<ProductDisplay />} />
      </Routes>
    </Router>
  );

}


export default App;