// src/Nosotros.js
import React from 'react';

const Nosotros = () => {
    return (
        <div>
            <h1>Sobre Nosotros</h1>
            <p>Bienvenidos a nuestra plataforma de música. Somos una empresa dedicada a ofrecer la mejor experiencia musical a nuestros usuarios.</p>
            <p>Nuestra misión es conectar a las personas a través de la música, proporcionando acceso a una amplia variedad de canciones y artistas.</p>
            <p>Si deseas unirte a nosotros, por favor regístrate o inicia sesión.</p>
            <div>
                <a href="/login">Iniciar Sesión</a>
                <a href="/register">Registrarse</a>
            </div>
        </div>
    );
};

export default Nosotros;
