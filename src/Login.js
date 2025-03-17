// src/Login.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { user, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Error al iniciar sesión:', error.message);
        } else {
            navigate('/inicio'); // Redirigir a la página de inicio después de iniciar sesión
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo Electrónico"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
            />
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Login;
