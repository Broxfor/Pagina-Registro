// src/Nosotros.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Nosotros = () => {
    const navigate = useNavigate();

    return (
        <div className="form-container">
            <h1>Sobre Nosotros</h1>
            <p>Bienvenidos a nuestra plataforma de música. Somos una empresa dedicada a ofrecer la mejor experiencia musical a nuestros usuarios.</p>
            <p>Nuestra misión es conectar a las personas a través de la música, proporcionando acceso a una amplia variedad de canciones y artistas.</p>
            <div className="navigation-buttons">
                <button className="rounded-button" onClick={() => navigate('/login')}>Iniciar Sesión</button>
                <button className="rounded-button" onClick={() => navigate('/register')}>Registrarse</button>
            </div>
        </div>
    );
};

export default Nosotros;
