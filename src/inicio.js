// src/Inicio.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const Inicio = () => {
    const [canciones, setCanciones] = useState([]);

    useEffect(() => {
        const fetchCanciones = async () => {
            const { data, error } = await supabase
                .from('musicas') // Nombre de tu tabla de canciones
                .select('*');

            if (error) {
                console.error('Error al obtener canciones:', error.message);
            } else {
                setCanciones(data);
            }
        };

        fetchCanciones();
    }, []);

    return (
        <div>
            <h2>Canciones Disponibles</h2>
            <ul>
                {canciones.map((cancion) => (
                    <li key={cancion.id}>
                        {cancion.titulo} - {cancion.artista_nombre}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inicio;
