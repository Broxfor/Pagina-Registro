import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import styled from 'styled-components';
import 'react-h5-audio-player/lib/styles.css';
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsSkipForwardFill, BsSkipBackwardFill, 
         BsHouseDoorFill, BsSearch, BsCollectionFill, BsPlusSquareFill, BsHeartFill, 
          BsThreeDots } from 'react-icons/bs';
import { FaSpotify } from 'react-icons/fa';

// Estilos usando styled-components con colores y diseño de Spotify
const AppContainer = styled.div`
  font-family: 'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #121212;
  color: #fff;
  min-height: 100vh;
  position: relative;
`;

const BarraSuperior = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
`;

const NavControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  
  button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.9);
    }
  }
`;

const BuscadorContainer = styled.div`
  position: relative;
  flex-grow: 1;
  max-width: 360px;
  margin: 0 20px;
`;

const IconoBuscador = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #b3b3b3;
`;

const Buscador = styled.input`
  width: 100%;
  padding: 10px 10px 10px 35px;
  border-radius: 25px;
  border: none;
  background-color: #242424;
  color: #fff;
  font-size: 14px;
  
  &:focus {
    outline: none;
    background-color: #333;
  }
  
  &::placeholder {
    color: #b3b3b3;
  }
`;

const PerfilMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  button {
    background: none;
    border: none;
    color: #b3b3b3;
    font-size: 15px;
    cursor: pointer;
    
    &:hover {
      color: #fff;
    }
  }
  
  .premium-button {
    background-color: transparent;
    border: 1px solid #fff;
    border-radius: 20px;
    padding: 8px 16px;
    font-weight: bold;
    color: #fff;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .perfil {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgb(129, 0, 146);
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
`;

const BarraLateral = styled.aside`
  width: ${props => props.expandida ? '240px' : '72px'};
  height: 100vh;
  background-color: #000;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 70px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 900;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.expandida ? 'flex-start' : 'center'};
  padding: ${props => props.expandida ? '0 24px' : '0'};
  margin-bottom: 18px;
  
  svg {
    color: rgb(129, 0, 146);
    font-size: 40px;
  }
  
  h2 {
    font-size: 24px;
    color: #fff;
    margin-left: 10px;
    display: ${props => props.expandida ? 'block' : 'none'};
  }
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  padding: ${props => props.expandida ? '12px 24px' : '12px 0'};
  margin-bottom: 4px;
  font-size: 14px;
  color: ${props => props.active ? '#fff' : '#b3b3b3'};
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: ${props => props.expandida ? 'flex-start' : 'center'};
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  
  &:hover {
    color: #fff;
  }
  
  svg {
    font-size: 24px;
    margin-right: ${props => props.expandida ? '16px' : '0'};
  }
  
  span {
    display: ${props => props.expandida ? 'block' : 'none'};
    font-weight: ${props => props.active ? 'bold' : 'normal'};
  }
`;

const Separador = styled.div`
  height: 1px;
  background-color: #282828;
  margin: 8px 12px;
  display: ${props => props.expandida ? 'block' : 'none'};
`;

const BibliotecaHeader = styled.div`
  padding: ${props => props.expandida ? '16px 24px' : '16px 0'};
  display: flex;
  align-items: center;
  justify-content: ${props => props.expandida ? 'space-between' : 'center'};
  
  div {
    display: flex;
    align-items: center;
    
    svg {
      font-size: 24px;
      color: #b3b3b3;
    }
    
    h3 {
      margin: 0 0 0 12px;
      font-size: 16px;
      color: #b3b3b3;
      display: ${props => props.expandida ? 'block' : 'none'};
    }
  }
  
  button {
    background: none;
    border: none;
    color: #b3b3b3;
    font-size: 24px;
    cursor: pointer;
    display: ${props => props.expandida ? 'block' : 'none'};
    
    &:hover {
      color: #fff;
    }
  }
`;

const ZonaPrincipal = styled.section`
  margin-left: ${props => props.expandida ? '240px' : '72px'};
  margin-top: 60px;
  padding: 24px;
  padding-bottom: 120px;
  background: linear-gradient(to bottom, rgba(18, 18, 18, 0.8), #121212 300px);
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  
  h1 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 24px;
  }
`;

const SeccionTop = styled.div`
  margin-bottom: 32px;
`;

const Categorias = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  button {
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    
    &:hover, &.active {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    &.active {
      background-color: #fff;
      color: #000;
    }
  }
`;

const Albumes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

const Album = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 16px;
  transition: background-color 0.3s ease;
  position: relative;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    
    .play-button {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .portada {
    position: relative;
    width: 100%;
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    
    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 4px;
    }
  }
  
  .play-button {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgb(129, 0, 146);
    color: #000;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.3s ease;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    
    &:hover {
      transform: scale(1.08) translateY(0);
      background-color:rgb(129, 0, 146);
    }
    
    svg {
      font-size: 24px;
    }
  }
  
  h3 {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    margin: 0 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  p {
    color: #b3b3b3;
    font-size: 14px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ZonaReproduccion = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #181818;
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
  border-top: 1px solid #282828;
`;

const InfoCancion = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 30%;
  min-width: 180px;
  
  img {
    width: 56px;
    height: 56px;
    border-radius: 4px;
    object-fit: cover;
  }
  
  .texto {
    display: flex;
    flex-direction: column;
    
    h3 {
      font-size: 14px;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    
    p {
      font-size: 12px;
      color: #b3b3b3;
      margin: 4px 0 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      
      &:hover {
        color: #fff;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  
  .acciones {
    display: flex;
    gap: 16px;
    margin-left: 16px;
    
    button {
      background: none;
      border: none;
      color: #b3b3b3;
      cursor: pointer;
      
      &:hover {
        color: #fff;
      }
      
      &.favorito {
        color:rgb(129, 0, 146);
      }
    }
  }
`;

const ReproductorCentral = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  max-width: 722px;
  
  .controles {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
    
    button {
      background: none;
      border: none;
      color: #b3b3b3;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        color: #fff;
      }
      
      &.play-pause {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid #fff;
        color: #fff;
        
        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
  
  .barra-progreso {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    
    span {
      font-size: 12px;
      color: #b3b3b3;
      min-width: 40px;
      text-align: center;
    }
    
    .progreso {
      flex-grow: 1;
      height: 4px;
      background-color: #5e5e5e;
      border-radius: 2px;
      position: relative;
      cursor: pointer;
      
      &:hover {
        .relleno::after {
          opacity: 1;
        }
      }
      
      .relleno {
        position: absolute;
        height: 100%;
        width: 30%;
        background-color: #fff;
        border-radius: 2px;
        
        &:hover {
          background-color:rgb(129, 0, 146);
        }
        
        &::after {
          content: '';
          position: absolute;
          right: -6px;
          top: -4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #fff;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
      }
    }
  }
`;

const ControlVolumen = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 30%;
  min-width: 180px;
  justify-content: flex-end;
  
  button {
    background: none;
    border: none;
    color: #b3b3b3;
    font-size: 16px;
    cursor: pointer;
    
    &:hover {
      color: #fff;
    }
  }
  
  .volumen {
    width: 100px;
    height: 4px;
    background-color: #5e5e5e;
    border-radius: 2px;
    position: relative;
    cursor: pointer;
    
    &:hover {
      .relleno::after {
        opacity: 1;
      }
    }
    
    .relleno {
      position: absolute;
      height: 100%;
      width: 70%;
      background-color: #b3b3b3;
      border-radius: 2px;
      
      &:hover {
        background-color: rgb(129, 0, 146);
      }
      
      &::after {
        content: '';
        position: absolute;
        right: -6px;
        top: -4px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #fff;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
    }
  }
`;

// Componente principal Reysound
const Reysound = () => {
  const [expandida, setExpandida] = useState(true);
  const [canciones, setCanciones] = useState([]);
  const [cancionActual, setCancionActual] = useState(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todo');

  // Obtener canciones de Supabase
  useEffect(() => {
    const obtenerCanciones = async () => {
      try {
        const { data, error } = await supabase
          .from('vista_canciones')
          .select('*');

        if (error) {
          throw error;
        }

        setCanciones(data);
      } catch (error) {
        console.error('Error al obtener canciones:', error.message);
        alert('Hubo un error al cargar las canciones. Revisa la consola para más detalles.');
      }
    };

    obtenerCanciones();
  }, []);

  // Manejar la reproducción de canciones
  const reproducirCancion = (cancion) => {
    if (cancion.url_archivo) {
      console.log('Reproduciendo canción:', cancion);
      setCancionActual(cancion);
      setReproduciendo(true);
    } else {
      alert('No se encontró un archivo de audio para esta canción.');
    }
  };

  // Filtrar canciones según la búsqueda
  const cancionesFiltradas = canciones.filter(cancion =>
    cancion.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    cancion.artista_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Categorías para filtrar música
  const categorias = ['Todo', 'Pop', 'Hip Hop', 'Rock', 'Electrónica', 'Latina'];

  return (
    <AppContainer>
      <BarraSuperior>
        <NavControls>
          <button>&lt;</button>
          <button>&gt;</button>
        </NavControls>
        
        <BuscadorContainer>
          <IconoBuscador>
            <BsSearch />
          </IconoBuscador>
          <Buscador
            placeholder="¿Qué quieres escuchar?"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </BuscadorContainer>
        
        <PerfilMenu>
          <button className="premium-button">Premium</button>
          <button>Instalar app</button>
          <div className="perfil">B</div>
        </PerfilMenu>
      </BarraSuperior>

      <BarraLateral expandida={expandida}>
        <Logo expandida={expandida}>
          <FaSpotify />
          <h2>Reysound</h2>
        </Logo>
        
        <MenuList>
          <MenuItem expandida={expandida} active={true}>
            <BsHouseDoorFill />
            <span>Inicio</span>
          </MenuItem>
          <MenuItem expandida={expandida}>
            <BsSearch />
            <span>Buscar</span>
          </MenuItem>
        </MenuList>
        
        <Separador expandida={expandida} />
        
        <BibliotecaHeader expandida={expandida}>
          <div>
            <BsCollectionFill />
            <h3>Tu Biblioteca</h3>
          </div>
          <button>
            <BsPlusSquareFill />
          </button>
        </BibliotecaHeader>
        
        <MenuList>
          <MenuItem expandida={expandida}>
            <span>Tus Me gusta</span>
          </MenuItem>
          <MenuItem expandida={expandida}>
            <span>Playlists recientes</span>
          </MenuItem>
          <MenuItem expandida={expandida}>
            <span>Podcasts guardados</span>
          </MenuItem>
        </MenuList>
      </BarraLateral>

      <ZonaPrincipal expandida={expandida}>
        <SeccionTop>
          <h1>Buen día</h1>
          <Categorias>
            {categorias.map(categoria => (
              <button 
                key={categoria}
                className={categoriaActiva === categoria ? 'active' : ''}
                onClick={() => setCategoriaActiva(categoria)}
              >
                {categoria}
              </button>
            ))}
          </Categorias>
        </SeccionTop>
        
        <h1>Álbumes</h1>
        <Albumes>
          {cancionesFiltradas.length > 0 ? (
            cancionesFiltradas.map((cancion) => (
              <Album key={cancion.id}>
                <div className="portada">
                  <img src={cancion.url_imagen || 'placeholder.jpg'} alt={cancion.titulo} />
                  <button 
                    className="play-button"
                    onClick={() => reproducirCancion(cancion)}
                  >
                    <BsFillPlayCircleFill />
                  </button>
                </div>
                <h3>{cancion.titulo}</h3>
                <p>{cancion.artista_nombre}</p>
              </Album>
            ))
          ) : (
            <p>No se encontraron canciones</p>
          )}
        </Albumes>
      </ZonaPrincipal>

      <ZonaReproduccion>
        {cancionActual ? (
          <>
            <InfoCancion>
              <img src={cancionActual.url_imagen || 'placeholder.jpg'} alt={cancionActual.titulo} />
              <div className="texto">
                <h3>{cancionActual.titulo}</h3>
                <p>{cancionActual.artista_nombre}</p>
              </div>
              <div className="acciones">
                <button className="favorito">
                  <BsHeartFill />
                </button>
              </div>
            </InfoCancion>
            
            <ReproductorCentral>
              <div className="controles">
                <button>
                  <BsSkipBackwardFill size={20} />
                </button>
                <button className="play-pause">
                  {reproduciendo ? 
                    <BsFillPauseCircleFill size={20} /> : 
                    <BsFillPlayCircleFill size={20} />
                  }
                </button>
                <button>
                  <BsSkipForwardFill size={20} />
                </button>
              </div>
              
              <div className="barra-progreso">
                <span>0:00</span>
                <div className="progreso">
                  <div className="relleno"></div>
                </div>
                <span>3:45</span>
              </div>
            </ReproductorCentral>
            
            <ControlVolumen>
              <button>
                <BsThreeDots />
              </button>
              <div className="volumen">
                <div className="relleno"></div>
              </div>
            </ControlVolumen>
          </>
        ) : (
          <div style={{ width: '100%', textAlign: 'center', color: '#b3b3b3' }}>
            Selecciona una canción para reproducir
          </div>
        )}
      </ZonaReproduccion>
    </AppContainer>
  );
};

export default Reysound;