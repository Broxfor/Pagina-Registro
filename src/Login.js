import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "./logo.png";

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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Iniciando sesión con:", username, password);

    try {
      const { data: users, error } = await supabase
        .from("usuarios")
        .select("nombre_usuario, contraseña")
        .eq("nombre_usuario", username);

      console.log("Respuesta de Supabase:", users);

      if (error) {
        console.error("Error al obtener datos de Supabase:", error);
        throw error;
      }

      console.log("Usuarios encontrados:", users);

      if (users && users.length > 0) {
        const user = users[0];

        console.log("Contraseña en BD:", user?.contraseña);
        console.log("Contraseña ingresada:", password);

        if (user?.contraseña === password) {
          console.log("Usuario autenticado:", user);
          navigate("/inicio");
        } else {
          console.log("Contraseña incorrecta.");
          setError("Credenciales inválidas. Intenta nuevamente.");
        }
      } else {
        console.log("No se encontró el usuario.");
        setError("Credenciales inválidas. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Logo>
          <img src={logo} alt="Logo" />
        </Logo>
        <h2>Iniciar Sesión</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Form onSubmit={handleLogin}>
          <Label>Usuario</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            required
          />
          <Label>Contraseña</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <Button type="submit">Iniciar Sesión</Button>
        </Form>
        <Button onClick={() => navigate("/")}>Volver</Button>
      </FormContainer>
    </PageContainer>
  );
};

export default Login;
