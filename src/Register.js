import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import logo from "./logo.png";
import styled from "styled-components";
import "./diseñobase.css";
// Estilos con styled-components
const PageContainer = styled.div`
  font-family: "Arial", sans-serif;
  background: #121212;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
`;

const FormContainer = styled.div`
  background: #1f1f1f;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  width: 300px;
  text-align: center;
`;

const Logo = styled.div`
  img {
    width: 100px;
    height: auto;
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #333;
  border-radius: 5px;
  background: #2c2c2c;
  color: white;

  &:focus {
    outline: none;
    border: 1px solid #888;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #7209b7;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;

  &:hover {
    background: #5a0687;
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateUsername = (username) => /^[a-zA-Z0-9]+$/.test(username);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateUsername(username)) {
      setError("El nombre de usuario solo puede contener letras y números.");
      return;
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from("usuarios")
      .select("nombre_usuario")
      .eq("nombre_usuario", username);

    if (fetchError) {
      console.error("Error al verificar usuario:", fetchError);
      setError("Error al verificar el nombre de usuario.");
      return;
    }

    if (existingUser.length > 0) {
      setError("El nombre de usuario ya está en uso.");
      return;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nombre_usuario: username, contraseña: password }]);

    if (error) {
      console.error("Error al registrar usuario:", error);
      setError(`Error al registrar usuario: ${error.message}`);
    } else {
      console.log("Usuario registrado:", data);
      setMessage("Registro exitoso");
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Logo>
          <img src={logo} alt="Logo" />
        </Logo>
        <h2>Registro de Usuarios</h2>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label>Usuario:</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Contraseña:</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Registrarse</Button>
        </Form>
        {message && <p>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button onClick={() => navigate("/")}>Volver</Button>
      </FormContainer>
    </PageContainer>
  );
};

export default Register;
