// src/Register.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import logo from './logo.png'; // Ruta relativa al logo en la carpeta src

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateUsername = (username) => {
    // Validación básica: solo letras y números, sin espacios
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateUsername(username)) {
      setError('El nombre de usuario solo puede contener letras y números.');
      return;
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from('usuarios')
      .select('nombre_usuario')
      .eq('nombre_usuario', username);

    if (fetchError) {
      console.error('Error al verificar usuario:', fetchError);
      setError('Error al verificar el nombre de usuario.');
      return;
    }

    if (existingUser.length > 0) {
      setError('El nombre de usuario ya está en uso.');
      return;
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre_usuario: username, contraseña: password }]);

    if (error) {
      console.error('Error al registrar usuario:', error);
      setError(`Error al registrar usuario: ${error.message}`);
    } else {
      console.log('Usuario registrado:', data);
      setMessage('Registro exitoso');
    }
  };

  return (
    <div className="form-container">
    <div className="logo">
      <img src={logo} alt="Logo" />
    </div>
    <h2>Registro de Usuarios</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Register;
