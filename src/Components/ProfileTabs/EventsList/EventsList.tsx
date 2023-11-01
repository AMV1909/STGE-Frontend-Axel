import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { ToastEvent } from "../../Toast/ToastEvent/ToastEvent";
import { useUserActions } from "../../../Hooks/useUserActions";
import { useAppSelector } from "../../../Hooks/store";
import { getEventsByType } from "../../../API/Events";
import { Event, PathRoutes } from "../../../Types/types.d";

import "./EventsList.css";

enum TypeString {
    "Scheduled" = "Agendadas",
    "Completed" = "Completadas",
    "Requested" = "Solicitadas",
    "Rejected" = "Rechazadas",
}

export function EventsList({
    type,
}: {
    type: "Scheduled" | "Completed" | "Requested";
}) {
    const [events, setEvents] = useState<Event[]>([]);
    const navigate = useNavigate();
    const { logoutUser } = useUserActions();
    const user = useAppSelector((state) => state.user);

    useEffect(() => {
        getEventsByType(type, user.role)
            .then((res: Event[]) => setEvents(res))
            .catch((err: AxiosError) => {
                toast.error("Error al buscar tutores", { duration: 5000 });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });
    }, [type]);

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
        <div className="stge__eventsList">
            <h1>Reuniones {TypeString[type]}</h1>

            {events.length > 0 ? (
                <table>
                    <thead>
                        <th>Tutor</th>
                        <th>Estudiante</th>
                        <th>Curso</th>
                        <th>Fecha de Inicio</th>
                        <th>Fecha de Finalización</th>
                        <th>Estado</th>
                        {type !== "Completed" && <th>Link</th>}
                        {(type === "Scheduled" || type === "Requested") && (
                            <th>Acciones</th>
                        )}
                    </thead>
                    <tbody>
                        {events.map((event) => {
                            let start = new Date(
                                event.start
                            ).toLocaleDateString("es-CO", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                            });

                            let end = new Date(event.end).toLocaleDateString(
                                "es-CO",
                                {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                }
                            );

                            start =
                                start.charAt(0).toUpperCase() + start.slice(1);
                            end = end.charAt(0).toUpperCase() + end.slice(1);

                            return (
                                <tr key={event._id}>
                                    <td>{event.tutor.name}</td>
                                    <td>{event.student.name}</td>
                                    <td>{event.course}</td>
                                    <td>{start}</td>
                                    <td>{end}</td>
                                    <td>
                                        {TypeString[event.type].slice(0, -1)}
                                    </td>
                                    {type !== "Completed" && (
                                        <td>
                                            {event.link ? (
                                                <a
                                                    href={event.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Link
                                                </a>
                                            ) : (
                                                "No disponible"
                                            )}
                                        </td>
                                    )}
                                    {(type === "Scheduled" ||
                                        type === "Requested") && (
                                        <td>
                                            {user.role === "Student" &&
                                                type === "Requested" && (
                                                    <button
                                                        className="button-cancel"
                                                        onClick={() =>
                                                            onClick(
                                                                event,
                                                                "CancelRequest"
                                                            )
                                                        }
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}

                                            {user.role === "Tutor" &&
                                                type === "Requested" && (
                                                    <button
                                                        onClick={() =>
                                                            onClick(
                                                                event,
                                                                "Accept"
                                                            )
                                                        }
                                                    >
                                                        Aceptar
                                                    </button>
                                                )}

                                            {user.role === "Tutor" &&
                                                type === "Requested" && (
                                                    <button
                                                        className="button-cancel"
                                                        onClick={() =>
                                                            onClick(
                                                                event,
                                                                "Reject"
                                                            )
                                                        }
                                                    >
                                                        Rechazar
                                                    </button>
                                                )}

                                            {user.role === "Tutor" &&
                                                type === "Scheduled" &&
                                                event.start >
                                                    new Date().toISOString() && (
                                                    <button
                                                        className="button-cancel"
                                                        onClick={() =>
                                                            onClick(
                                                                event,
                                                                "CancelSchedule"
                                                            )
                                                        }
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}

                                            {type === "Scheduled" &&
                                                ((user.role === "Tutor" &&
                                                    !event.confirmedCompleted) ||
                                                    (user.role === "Student" &&
                                                        event.confirmedCompleted ===
                                                            1)) &&
                                                event.end <
                                                    new Date().toISOString() && (
                                                    <button
                                                        onClick={() =>
                                                            onClick(
                                                                event,
                                                                "Complete"
                                                            )
                                                        }
                                                    >
                                                        Completar
                                                    </button>
                                                )}

                                            {type === "Scheduled" &&
                                                new Date().toISOString() >
                                                    event.start &&
                                                new Date().toISOString() <
                                                    event.end &&
                                                "Reunión en curso"}

                                            {user.role === "Student" &&
                                                !event.confirmedCompleted &&
                                                "Esperando a que el tutor marque la reunión como completada"}

                                            {user.role === "Tutor" &&
                                                event.confirmedCompleted ===
                                                    1 &&
                                                "Esperando a que el estudiante marque la reunión como completada"}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No hay eventos</p>
            )}
        </div>
    );
}
