import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profitalyze from './Profitalyze';
import ProductsDisplay from './pages/ProductsDisplay';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Profitalyze />} />
        <Route path="/products/:category" element={<ProductsDisplay />} />
      </Routes>
    </Router>
  );
};

export default App;
