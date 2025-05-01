import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "./logo.png";

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
  border-radius: 5px;
  background: #2c2c2c;
  color: white;
  border: 1px solid #333;

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

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data: users, error } = await supabase
        .from("usuarios")
        .select("nombre_usuario, contraseña")
        .eq("nombre_usuario", username);

      if (error) throw error;

      if (users && users.length > 0 && users[0]?.contraseña === password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        navigate("/");
      } else {
        setError("Credenciales inválidas. Intenta nuevamente.");
      }
    } catch (error) {
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
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Label>Contraseña</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit">Iniciar Sesión</Button>
        </Form>
        <Button onClick={() => navigate("/")}>Volver</Button>
      </FormContainer>
    </PageContainer>
  );
};

export default Login;
