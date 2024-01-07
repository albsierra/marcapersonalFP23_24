import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function InformationInsignias({ className = '' }) {
    const user = usePage().props.auth.user;

    const [actividades, setActividades] = useState([]);

    useEffect(() => {
        axios.get(route('profile.getActividades', { id: user.id }))
            .then(response => {
                setActividades(response.data.actividades);
            });
    }, [user.id]);

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Insignias</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Insignias obtenidas por la particiapción en actividades.
                </p>
            </header>

            {actividades.map((actividad) => (
                <i key={actividad.id}  className={`${actividad.insignia} fa-3x`} style={{marginRight: '10px'}} data-toggle="tooltip" data-placement="top" title={actividad.nombre}> </i>
            ))}

        </section>
    );
}
