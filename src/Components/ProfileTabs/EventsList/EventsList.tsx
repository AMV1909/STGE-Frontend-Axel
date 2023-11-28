import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { EventCard } from "../..";
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

    return (
        <div className="stge__eventsList">
            <h1>Reuniones {TypeString[type]}</h1>

            {events.length > 0 ? (
                <div className="stge__eventsList-container">
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            setEvents={setEvents}
                            type={type}
                        />
                    ))}
                </div>
            ) : (
                <p id="no-events">No hay eventos</p>
            )}
        </div>
    );
}
