import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useAppSelector } from "../../Hooks/store";
import { ToastEvent } from "..";
import { Event } from "../../Types/types.d";

import "./EventCard.css";

enum TypeString {
    "Scheduled" = "Agendada",
    "Completed" = "Completada",
    "Requested" = "Solicitada",
    "Rejected" = "Rechazada",
}

interface Props {
    event: Event;
    setEvents: Dispatch<SetStateAction<Event[]>>;
    type: "Scheduled" | "Completed" | "Requested";
}

export function EventCard({ event, setEvents, type }: Props) {
    const user = useAppSelector((state) => state.user);

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

    const onClick = async (
        event: Event,
        clickType:
            | "Accept"
            | "Reject"
            | "CancelRequest"
            | "CancelSchedule"
            | "Complete"
    ) => {
        toast(
            (t) => (
                <ToastEvent
                    t={t}
                    event={event}
                    setEvents={setEvents}
                    type={clickType}
                />
            ),
            {
                duration: 10000,
            }
        );
    };

    return (
        <div className="stge__eventCard">
            <div className="stge__eventCard-info">
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

                {type !== "Completed" && (
                    <p>
                        <strong>Link: </strong>
                        {event.link ? (
                            <a
                                href={event.link}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {event.link}
                            </a>
                        ) : (
                            "No disponible"
                        )}
                    </p>
                )}
            </div>

            {(type === "Scheduled" || type === "Requested") && (
                <div className="stge__eventCard-actions">
                    {user.role === "Student" && type === "Requested" && (
                        <button
                            name="cancel-request-event"
                            className="button-cancel"
                            onClick={() => onClick(event, "CancelRequest")}
                        >
                            Cancelar
                        </button>
                    )}

                    {user.role === "Tutor" && type === "Requested" && (
                        <button
                            name="accept-request-event"
                            onClick={() => onClick(event, "Accept")}
                        >
                            Aceptar
                        </button>
                    )}

                    {user.role === "Tutor" && type === "Requested" && (
                        <button
                            name="reject-request-event"
                            className="button-cancel"
                            onClick={() => onClick(event, "Reject")}
                        >
                            Rechazar
                        </button>
                    )}

                    {user.role === "Tutor" &&
                        type === "Scheduled" &&
                        event.start > new Date().toISOString() && (
                            <button
                                name="cancel-schedule-event"
                                className="button-cancel"
                                onClick={() => onClick(event, "CancelSchedule")}
                            >
                                Cancelar
                            </button>
                        )}

                    {type === "Scheduled" &&
                        ((user.role === "Tutor" && !event.confirmedCompleted) ||
                            (user.role === "Student" &&
                                event.confirmedCompleted === 1)) &&
                        event.end < new Date().toISOString() && (
                            <button
                                name="complete-event"
                                onClick={() => onClick(event, "Complete")}
                            >
                                Completar
                            </button>
                        )}

                    {type === "Scheduled" &&
                        new Date().toISOString() > event.start &&
                        new Date().toISOString() < event.end &&
                        "Reunión en curso"}

                    {event.end < new Date().toISOString() &&
                        user.role === "Student" &&
                        !event.confirmedCompleted &&
                        "Esperando a que el tutor marque la reunión como completada"}

                    {user.role === "Tutor" &&
                        event.confirmedCompleted === 1 &&
                        "Esperando a que el estudiante marque la reunión como completada"}
                </div>
            )}
        </div>
    );
}
