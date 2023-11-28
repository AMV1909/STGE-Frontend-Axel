import { useEffect, useState } from "react";

import { Event } from "../../Types/types.d";

import "./EventCard.css";

enum TypeString {
    "Scheduled" = "Agendada",
    "Completed" = "Completada",
    "Requested" = "Solicitada",
    "Rejected" = "Rechazada",
    "Cancelled" = "Cancelada",
}

export function EventCardTutor({ event }: { event: Event }) {
    const [start, setStart] = useState(
        new Date(event.start).toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        })
    );

    const [end, setEnd] = useState(
        new Date(event.end).toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        })
    );

    useEffect(() => {
        setStart(start.charAt(0).toUpperCase() + start.slice(1));
        setEnd(end.charAt(0).toUpperCase() + end.slice(1));
    }, []);

    return (
        <div className="stge__eventCard">
            <div className="stge__eventCard-info tutor">
                <p>
                    <strong>Tutor: </strong>
                    {event.tutor.name}
                </p>

                <p>
                    <strong>Estudiante: </strong>
                    {event.student.name}
                </p>

                <p>
                    <strong>Curso: </strong>
                    {event.course}
                </p>

                <p>
                    <strong>Fecha de Inicio: </strong>
                    {start}
                </p>

                <p>
                    <strong>Fecha de Fin: </strong>
                    {end}
                </p>

                <p>
                    <strong>Estado: </strong>
                    {TypeString[event.type]}
                </p>
            </div>
        </div>
    );
}
