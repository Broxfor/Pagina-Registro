import React, { useEffect, useState, useRef } from "react";
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

const ProfileContainer = styled.div`
  position: relative;
  margin-right: 20px;
`;

const ProfileButton = styled.button`
  border: 2px solid #7c3aed;
  padding: 2px;
  border-radius: 50%;
  background: transparent;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const ProfileImage = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6b2ed1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  width: 180px;
  background: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
  z-index: 10;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 10px 15px;
  background: none;
  border: none;
  text-align: left;
  color: white;
  font-size: 14px;
  cursor: pointer;

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

const Nosotros = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Usuario");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = localStorage.getItem("username");
    setIsLoggedIn(loggedIn);
    if (user) {
      setUsername(user);
    }

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
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
  <ProfileContainer ref={dropdownRef} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <span>{username}</span>
    <ProfileButton onClick={() => setShowDropdown(!showDropdown)}>
      <ProfileImage>{username.charAt(0).toUpperCase()}</ProfileImage>
    </ProfileButton>
    {showDropdown && (
      <DropdownMenu>
        <DropdownItem onClick={() => navigate("/inicio")}>Entrar a la plataforma</DropdownItem>
        <DropdownItem onClick={handleLogout}>Cerrar sesión</DropdownItem>
      </DropdownMenu>
    )}
  </ProfileContainer>
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
        <Button
          onClick={() => navigate("/inicio")}
          style={{ padding: "15px 30px", fontSize: "1.2rem" }}
        >
          Entrar a la plataforma
        </Button>
      </Content>

      <Footer>© 2024 ReySound. Todos los derechos reservados.</Footer>
    </PageContainer>
  );
};

export default Nosotros;
