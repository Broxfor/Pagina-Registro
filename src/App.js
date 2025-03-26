// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nosotros from './Nosotros';
import Login from './Login';
import Register from './Register';
import Inicio from './inicio';
import './App.css'; // Asegúrate de importar el archivo CSS

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Nosotros />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/inicio" element={<Inicio />} />
            </Routes>
        </Router>
    );
};

export default App;
