import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast, toast } from "react-hot-toast";
import { RatingStar } from "rating-star";

import { socket } from "../../../Socket";
import {
    acceptEvent,
    rejectEvent,
    cancelRequestedEvent,
    cancelScheduledEvent,
    completeEvent,
} from "../../../API/Events";
import { useUserActions } from "../../../Hooks/useUserActions";
import { useAppSelector } from "../../../Hooks/store";
import { Event, PathRoutes } from "../../../Types/types.d";

import "./ToastEvent.css";

export function ToastEvent({
    t,
    event,
    type,
    setEvents,
}: {
    t: Toast;
    event: Event;
    type: "Accept" | "Reject" | "CancelRequest" | "CancelSchedule" | "Complete";
    setEvents: Dispatch<SetStateAction<Event[]>>;
}) {
    const user = useAppSelector((state) => state.user);
    const { logoutUser } = useUserActions();
    const navigate = useNavigate();
    const [data, setData] = useState({
        start: "",
        end: "",
    });
    const [score, setScore] = useState(0);

    useEffect(() => {
        let start = new Date(event.start).toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });

        let end = new Date(event.end).toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });

        start = start.charAt(0).toUpperCase() + start.slice(1);
        end = end.charAt(0).toUpperCase() + end.slice(1);

        setData({
            start,
            end,
        });
    }, []);

    const handleAccept = async () => {
        toast.dismiss(t.id);
        toast.loading("Aceptando evento...", {
            id: "loading",
            duration: Infinity,
        });

        await acceptEvent(event._id)
            .then(() => {
                toast.dismiss("loading");
                toast.success("Evento aceptado");

                socket.emit("accept-event", event._id);

                setEvents((events) =>
                    events.filter((e) => e._id !== event._id)
                );
            })
            .catch((err: AxiosError) => {
                toast.dismiss(t.id);
                toast.error("Error al aceptar evento", {
                    duration: 5000,
                });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });
    };

    const handleReject = async () => {
        toast.dismiss(t.id);
        toast.loading("Aceptando evento...", {
            id: "loading",
            duration: Infinity,
        });

        await rejectEvent(event._id)
            .then(() => {
                toast.dismiss("loading");
                toast.success("Evento rechazado");

                socket.emit("reject-event", event._id);

                setEvents((events) =>
                    events.filter((e) => e._id !== event._id)
                );
            })
            .catch((err: AxiosError) => {
                toast.dismiss(t.id);
                toast.error("Error al rechazar evento", {
                    duration: 5000,
                });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });
    };

    const handleCancelRequest = async () => {
        toast.dismiss(t.id);
        toast.loading("Cancelando evento...", {
            id: "loading",
            duration: Infinity,
        });

        await cancelRequestedEvent(event._id)
            .then(() => {
                toast.dismiss("loading");
                toast.success("Evento cancelado");

                socket.emit("cancel-requested-event", event._id);

                setEvents((events) =>
                    events.filter((e) => e._id !== event._id)
                );
            })
            .catch((err: AxiosError) => {
                toast.dismiss(t.id);
                toast.error("Error al cancelar evento", {
                    duration: 5000,
                });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });
    };

    const handleCancelSchedule = async () => {
        toast.dismiss(t.id);
        toast.loading("Cancelando evento...", {
            id: "loading",
            duration: Infinity,
        });

        await cancelScheduledEvent(event._id)
            .then(() => {
                toast.dismiss("loading");
                toast.success("Evento cancelado");

                socket.emit("cancel-scheduled-event", event._id);

                setEvents((events) =>
                    events.filter((e) => e._id !== event._id)
                );
            })
            .catch((err: AxiosError) => {
                toast.dismiss(t.id);
                toast.error("Error al cancelar evento", {
                    duration: 5000,
                });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });
    };

    const handleComplete = async () => {
        if (user.role === "Student" && score === 0)
            return toast.error("Debes calificar al tutor");

        toast.dismiss(t.id);
        toast.loading("Completando evento...", {
            id: "loading",
            duration: Infinity,
        });

        await completeEvent(event._id, score)
            .then(() => {
                toast.dismiss("loading");
                toast.success("Evento completado");

                if (event.confirmedCompleted === 1) {
                    socket.emit("complete-event-student", event._id);
                } else {
                    socket.emit("complete-event-tutor", event._id);
                }

                if (!event.confirmedCompleted) {
                    setEvents((events) =>
                        events.map((e) =>
                            e._id === event._id
                                ? { ...e, confirmedCompleted: 1 }
                                : e
                        )
                    );
                } else {
                    setEvents((events) =>
                        events.filter((e) => e._id !== event._id)
                    );
                }
            })
            .catch((err: AxiosError) => {
                toast.dismiss(t.id);
                toast.error("Error al completar evento", {
                    duration: 5000,
                });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });
    };

    return (
        <div className="stge__toastEvent">
            {type === "Accept" && (
                <p>¿Está seguro que desea aceptar la reunión solicitada?</p>
            )}

            {type === "Reject" && (
                <p>¿Está seguro que desea rechazar la reunión solicitada?</p>
            )}

            {type === "CancelRequest" && (
                <p>¿Está seguro que desea cancelar la reunión solicitada?</p>
            )}

            {type === "CancelSchedule" && (
                <p>¿Está seguro que desea cancelar la reunión agendad?</p>
            )}

            {type === "Complete" && (
                <p>¿Está seguro que desea marca como completada la reunión?</p>
            )}

            <div className="stge__toastEvent-info">
                <p>
                    <strong>Curso: </strong>
                    {event.course}
                </p>

                <p>
                    <strong>Fecha Inicio: </strong>
                    {data.start}
                </p>

                <p>
                    <strong>Fecha Finalización: </strong>
                    {data.end}
                </p>
            </div>

            {type === "Complete" && user.role === "Student" && (
                <div className="stge__toastEvent-score">
                    <p>Calificar al tutor: </p>

                    <RatingStar
                        id={event.tutor.id}
                        clickable={true}
                        onRatingChange={(n) => setScore(n)}
                        maxScore={5}
                        rating={score}
                    />

                    <p>({score})</p>
                </div>
            )}

            <div className="stge__toastEvent-buttons">
                {type === "Accept" && (
                    <button onClick={handleAccept}>Aceptar</button>
                )}

                {type === "Complete" && (
                    <button onClick={handleComplete}>Completar</button>
                )}

                {type === "CancelRequest" && (
                    <button
                        className="red-button"
                        onClick={handleCancelRequest}
                    >
                        Cancelar
                    </button>
                )}

                {type === "CancelSchedule" && (
                    <button
                        className="red-button"
                        onClick={handleCancelSchedule}
                    >
                        Cancelar
                    </button>
                )}

                {type === "Reject" && (
                    <button className="red-button" onClick={handleReject}>
                        Rechazar
                    </button>
                )}

                <button onClick={() => toast.dismiss(t.id)}>
                    {type === "Accept" ||
                    type === "Reject" ||
                    type === "Complete"
                        ? "Cancelar"
                        : "Dejar la reunión"}
                </button>
            </div>
        </div>
    );
}
