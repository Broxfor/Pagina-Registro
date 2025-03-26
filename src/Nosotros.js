import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "./logo.png"; // Asegúrate de que la ruta sea correcta

// Estilos
const PageContainer = styled.div`
  font-family: "Arial", sans-serif;
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
  background: #1f1f1f;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
`;

const Logo = styled.img`
  width: 80px; /* Tamaño reducido del logo */
  height: auto;
`;

                                                                                                                       
const NavButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #7209b7;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #5a0687;
  }
`;

const Content = styled.div`
  max-width: 800px;
  text-align: center;
  margin: 50px 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const Nosotros = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Navbar>
        <Logo src={logo} alt="ReySound Logo" />
        <NavButtons>
          <Button onClick={() => navigate("/login")}>Iniciar Sesión</Button>
          <Button onClick={() => navigate("/register")}>Registrarse</Button>
        </NavButtons>
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
      </Content>
    </PageContainer>
  );
};

export default Nosotros;
