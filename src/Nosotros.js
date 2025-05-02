import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "./logo.png";

// Estilos
const PageContainer = styled.div`
  font-family: 'Arial', sans-serif;
  background: #121212;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Navbar = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: #121212;
  border-bottom: 1px solid #333;
  position: relative;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;

  &:hover {
    background: #6b2ed1;
  }
`;

const Content = styled.div`
  max-width: 800px;
  text-align: center;
  margin: 50px 20px;
  flex-grow: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #d1d5db;
`;

const Footer = styled.footer`
  background: #121212;
  color: #999;
  text-align: center;
  padding: 20px;
`;

const UsernameDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: bold;
`;

const Nosotros = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Usuario");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = localStorage.getItem("username");
    setIsLoggedIn(loggedIn);
    if (user) {
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Limpia toda la sesión
    navigate("/");
    window.location.reload();
  };

  return (
    <PageContainer>
      <Navbar>
        <Logo src={logo} alt="ReySound Logo" />

        {isLoggedIn ? (
          <NavButtons>
            <UsernameDisplay>{username}</UsernameDisplay>
            <Button onClick={handleLogout}>Cerrar sesión</Button>
          </NavButtons>
        ) : (
          <NavButtons>
            <Button onClick={() => navigate("/login")}>Iniciar Sesión</Button>
            <Button onClick={() => navigate("/register")}>Registrarse</Button>
          </NavButtons>
        )}
      </Navbar>

      <Content>
        <Title>Bienvenidos a ReySound</Title>
        <Description>
          ReySound es un proyecto estudiantil desarrollado por el equipo
          programador <strong>"Los Abuelos"</strong>. Nuestra misión es
          conectar a las personas a través de la música, brindando una
          plataforma moderna y accesible para escuchar y descubrir canciones.
        </Description>
        <Description>
          Creemos en el poder de la música para unir a las personas y en la
          importancia de crear experiencias digitales innovadoras. Con una
          interfaz inspirada en los mejores servicios de streaming, ReySound es
          la mejor opción para disfrutar de tu música favorita.
        </Description>
        <Description>
          ¡Únete a nuestra comunidad y sé parte de esta revolución musical!
        </Description>
        {isLoggedIn && (
          <Button
            onClick={() => navigate("/inicio")}
            style={{ padding: "15px 30px", fontSize: "1.2rem" }}
          >
            Entrar a la plataforma
          </Button>
        )}
      </Content>

      <Footer>© 2024 ReySound. Todos los derechos reservados.</Footer>
    </PageContainer>
  );
};

export default Nosotros;