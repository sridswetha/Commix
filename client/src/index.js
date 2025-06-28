import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './Home';
import Layout from './Layout';
import Unmix from './Unmix';
import reportWebVitals from './reportWebVitals';
import ShiftBackground from './shift';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <>
      <ShiftBackground />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/unmix" element={<Unmix />} />
        </Route>
      </Routes>
    </>
  </BrowserRouter>
);

reportWebVitals();
