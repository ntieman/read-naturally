import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddStudent from './pages/AddStudent';
import Home from './pages/Home';
import Students from './pages/Students';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.scss';

render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/add-student" element={<AddStudent />} />
      <Route exact path="/students" element={<Students />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('app')
);