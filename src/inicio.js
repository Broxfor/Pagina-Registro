import React, { useEffect, useState, useRef } from 'react';
import { supabase } from './supabaseClient';
import styled from 'styled-components';
import 'react-h5-audio-player/lib/styles.css';
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsSkipForwardFill, BsSkipBackwardFill, 
         BsHouseDoorFill, BsSearch, BsCollectionFill, BsPlusSquareFill, BsHeartFill, 
         BsThreeDots, BsVolumeUpFill } from 'react-icons/bs';
import { FaSpotify } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
    background-color: rgba(0, 0, 0, 0.7);
    border: none;
    color: #fff;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    user-select: none;

    &:hover {
      background-color: rgba(129, 0, 146, 0.9);
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
  position: relative;
  
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
  
  .perfil {
    font-weight: bold;
    color: #b3b3b3;
    cursor: pointer;
    user-select: none;
  }
`;

const Submenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #1f1f1f;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 8px 0;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  z-index: 1100;
`;

const SubmenuButton = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  color: #b3b3b3;
  text-align: left;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: rgba(129, 0, 146, 0.9);
    color: #fff;
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

// Zona de reproducción actualizada
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
        color: rgb(129, 0, 146);
      }
    }
  }
`;

// Nuevo ReproductorCentral basado en el diseño proporcionado
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
      cursor: pointer;
      position: relative;

      input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        height: 4px;
        background: transparent;
        cursor: pointer;
        margin: 0;
        position: relative;
        z-index: 2;

        &::-webkit-slider-runnable-track {
          height: 4px;
          background: transparent;
        }
        
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: rgb(129, 0, 146);
          cursor: pointer;
          opacity: 1;
          transition: opacity 0.2s;
          position: relative;
          top: -4px; /* centers the thumb vertically */
          z-index: 3;
          border: none;
        }
        
        &:hover::-webkit-slider-thumb {
          opacity: 1;
        }
        
        &::-moz-range-track {
          height: 4px;
          background: transparent;
        }

        &::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: rgb(129, 0, 146);
          cursor: pointer;
          opacity: 1;
          transition: opacity 0.2s;
          border: none;
          position: relative;
          z-index: 3;
          top: 0;
        }
        
        &:hover::-moz-range-thumb {
          opacity: 1;
        }
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 4px;
        border-radius: 2px;
        background: rgb(129, 0, 146); /* cambiar a morado */
        width: ${props => props.progressPercentage}%;
        z-index: 1;
        pointer-events: none;
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
    position: relative;
    
    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      background: #5e5e5e;
      border-radius: 2px;
      cursor: pointer;
      
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      &:hover::-webkit-slider-thumb {
        opacity: 1;
      }
      
      &::-moz-range-thumb {
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        border: none;
      }
      
      &:hover::-moz-range-thumb {
        opacity: 1;
      }
    }
  }
`;

// Componente principal Reysound
const Reysound = ({ onLogout }) => {
  const navigate = useNavigate();
  const [expandida] = useState(true);
  const [canciones, setCanciones] = useState([]);
  const [cancionActual, setCancionActual] = useState(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState([]); // Estado para géneros
  const [categoriaActiva, setCategoriaActiva] = useState('Todo');
  const [esFavorita, setEsFavorita] = useState(false);

  const [username, setUsername] = useState('');
  const [submenuVisible, setSubmenuVisible] = useState(false);
  
  // Referencias para el reproductor de audio
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volumen, setVolumen] = useState(80);

  // Obtener canciones y géneros de Supabase
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Obtener géneros
        const { data: generos, error: errorGeneros } = await supabase
          .from('generos')
          .select('*');

        if (errorGeneros) {
          throw errorGeneros;
        }

        setCategorias(generos); // Guardar géneros en estado

        // Obtener canciones
        const { data: cancionesData, error: errorCanciones } = await supabase
          .from('vista_canciones')
          .select('*');

        if (errorCanciones) {
          throw errorCanciones;
        }

        setCanciones(cancionesData);
      } catch (error) {
        console.error('Error al obtener datos:', error.message);
        alert('Hubo un error al cargar los datos. Revisa la consola para más detalles.');
      }
    };

    obtenerDatos();

    // Obtener username de localStorage
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
    }
  }, []);

  // Manejar la reproducción de canciones
  const reproducirCancion = (cancion) => {
    if (cancion.url_archivo) {
      console.log('Reproduciendo canción:', cancion);
      setCancionActual(cancion);
      setReproduciendo(true);
      setEsFavorita(false); // Reset favorite on new song
      
      // Al seleccionar una nueva canción, esperar a que el DOM se actualice
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = cancion.url_archivo;
          audioRef.current.play().catch(err => {
            console.error('Error al reproducir:', err);
          });
        }
      }, 0);
    } else {
      alert('No se encontró un archivo de audio para esta canción.');
    }
  };

  // Manejar la pausa/reproducción
  const togglePlayPause = () => {
    if (!cancionActual) return;
    
    if (reproduciendo) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Error al reproducir:', err);
      });
    }
    
    setReproduciendo(!reproduciendo);
  };

  // Formatear tiempo en minutos:segundos
  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Cambiar la posición de la canción
  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (value / 100) * duration;
    }
  };

  // Cambiar el volumen
  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolumen(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  // Cambiar estado favorito
  const toggleFavorito = () => {
    setEsFavorita(!esFavorita);
  };

  // Manejar logout click
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleSubmenu = () => {
    setSubmenuVisible(!submenuVisible);
  };

  // Eventos del audio
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setReproduciendo(false);
      setCurrentTime(0);
    };
    
    // Volumen inicial
    audio.volume = volumen / 100;
    
    // Agregar event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    
    // Cleanup
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volumen]);

  // Filtrar canciones según la búsqueda y la categoría activa (género)
  const cancionesFiltradas = canciones.filter(cancion =>
    (categoriaActiva === 'Todo' || cancion.genero === categoriaActiva) &&
    (cancion.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    cancion.artista_nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Calcular porcentaje de progreso
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <AppContainer>
      <BarraSuperior>
        <NavControls>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </NavControls>
        
        <BuscadorContainer>
          <IconoBuscador>
            <BsSearch />
          </IconoBuscador>
          <Buscador
            placeholder="¿Qué  escuchar?"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </BuscadorContainer>
        
        <PerfilMenu>
          <button>Instalar app</button>
          <div className="perfil" onClick={toggleSubmenu}>{username || 'Usuario'}</div>
          {submenuVisible && (
            <Submenu>
              <SubmenuButton onClick={() => alert('Configuración clickeado')}>Configuración</SubmenuButton>
            </Submenu>
          )}
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
          <MenuItem expandida={expandida}>
            <BsThreeDots />
            <span>Artistas</span>
          </MenuItem>
          <MenuItem expandida={expandida}>
            <BsThreeDots />
            <span>Generos</span>
          </MenuItem>
          <MenuItem expandida={expandida}>
            <BsCollectionFill />
            <span>PlayList</span>
          </MenuItem>
          <MenuItem expandida={expandida}>
            <BsHeartFill />
            <span>Tus Me Gusta</span>
          </MenuItem>
        </MenuList>
      </BarraLateral>

      <ZonaPrincipal expandida={expandida}>
        <SeccionTop>
          <h1>Generos</h1>
          <Categorias>
            <button
              className={categoriaActiva === 'Todo' ? 'active' : ''}
              onClick={() => setCategoriaActiva('Todo')}
            >
              Todo
            </button>
            {categorias.map(genero => (
              <button 
                key={genero.id}
                className={categoriaActiva === genero.nombre ? 'active' : ''}
                onClick={() => setCategoriaActiva(genero.nombre)}
              >
                {genero.nombre}
              </button>
            ))}
          </Categorias>
        </SeccionTop>
        
        <h1>Canciones</h1>
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

      {/* Reproductor actualizado */}
      <ZonaReproduccion>
        {cancionActual ? (
          <>
            <InfoCancion>
              <img id="player-album-art" src={cancionActual.url_imagen || 'placeholder.jpg'} alt={cancionActual.titulo} />
              <div className="texto">
                <h3 id="player-song-title">{cancionActual.titulo}</h3>
                <p id="player-song-artist">{cancionActual.artista_nombre}</p>
              </div>
              <div className="acciones">
                <button 
                  className={`favorito${esFavorita ? ' activo' : ''}`} 
                  onClick={toggleFavorito}
                  aria-label={esFavorita ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                  <BsHeartFill style={{ color: esFavorita ? 'rgb(129, 0, 146)' : '#b3b3b3' }}/>
                </button>
              </div>
            </InfoCancion>
            
            <ReproductorCentral progressPercentage={progressPercentage}>
              <div className="controles">
                <button>
                  <BsSkipBackwardFill size={20} />
                </button>
                <button className="play-pause" id="play-pause-btn" onClick={togglePlayPause}>
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
                <span id="current-time">{formatTime(currentTime)}</span>
                <div className="progreso">
                  <input
                    id="progress-bar"
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={handleProgressChange}
                    aria-label="Barra de progreso"
                  />
                </div>
                <span id="duration">{formatTime(duration)}</span>
              </div>
            </ReproductorCentral>
            
            <ControlVolumen>
              <button aria-label="Volumen" title="Volumen">
                <BsVolumeUpFill />
              </button>
              <div className="volumen">
                <input
                  id="volume-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={volumen}
                  onChange={handleVolumeChange}
                  aria-label="Control de volumen"
                />
              </div>
            </ControlVolumen>
          </>
        ) : (
          <div style={{ width: '100%', textAlign: 'center', color: '#b3b3b3' }}>
            Selecciona una canción para reproducir
          </div>
        )}
        
        {/* Reproductor de audio oculto */}
        <audio ref={audioRef} id="audio-player" preload="metadata" />
      </ZonaReproduccion>
    </AppContainer>
  );
};

export default Reysound;