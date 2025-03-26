// src/Login.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        console.log('Iniciando sesión con:', username, password);

        try {
            // Obtener el usuario con su contraseña
            const { data: users, error } = await supabase
    .from('usuarios')
    .select('nombre_usuario, contraseña')  // Asegúrate de que el campo sea 'contraseña'
    .eq('nombre_usuario', username);

console.log('Respuesta de Supabase:', users);

            if (error) {
                console.error('Error al obtener datos de Supabase:', error);
                throw error;
            }

            console.log('Usuarios encontrados:', users);

            if (users && users.length > 0) {
                const user = users[0];

                // Corregir el nombre del campo para la contraseña
                console.log('Contraseña en BD:', user?.contraseña);
                console.log('Contraseña ingresada:', password);

                if (user?.contraseña === password) {
                    console.log('Usuario autenticado:', user);
                    navigate('/inicio');
                } else {
                    console.log('Contraseña incorrecta.');
                    setError('Credenciales inválidas. Intenta nuevamente.');
                }
            } else {
                console.log('No se encontró el usuario.');
                setError('Credenciales inválidas. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            setError('Error al conectar con el servidor.');
        }
    };

    return (
        <div className="form-container">
            <div className="logo">
                <img src="/path/to/logo.png" alt="Logo" />
            </div>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <label>Usuario</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuario"
                    required
                />
                <label>Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
            <button onClick={() => navigate('/')}>Volver a Sobre Nosotros</button>
        </div>
    );
};

export default Login;