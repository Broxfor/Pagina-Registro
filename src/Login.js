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

import { FaWhatsapp } from "react-icons/fa";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
`;

const ModalContent = styled.div`
  background: #1f1f1f;
  padding: 20px 30px;
  border-radius: 12px;
  width: 320px;
  color: white;
  position: relative;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 22px;
  color: #bbb;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 18px;
  margin: 20px 0;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #ccc;
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/inicio"); // Redirige al inicio si ya está logueado
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
        navigate("/inicio"); // Redirige al inicio tras login exitoso
      } else {
        setError("Credenciales inválidas. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setError("Error al conectar con el servidor.");
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
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
        <p style={{ marginTop: "15px", cursor: "pointer", color: "#7c3aed" }} onClick={openModal}>
          ¿Olvidaste tu contraseña?
        </p>
      </FormContainer>

      {showModal && (
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalContent>
            <CloseButton onClick={closeModal} aria-label="Cerrar modal">&times;</CloseButton>
            <ContactInfo>
              <FaWhatsapp size={28} color="#25D366" />
              <span>829-768-0058</span>
            </ContactInfo>
            <InfoText>Contacta con un administrador para recuperar tu contraseña vía WhatsApp</InfoText>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default Login;
