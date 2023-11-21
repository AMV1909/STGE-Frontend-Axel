import { AxiosError } from "axios";
import {
    Dispatch,
    SetStateAction,
    MutableRefObject,
    useState,
    useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidTrash } from "react-icons/bi";
import { toast } from "react-hot-toast";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import { useUserActions } from "../../Hooks/useUserActions";
import { getAvailableSchedule } from "../../API/Calendar";
import {
    DateRange,
    PathRoutes,
    SelectedDates,
    Tutor,
    User,
} from "../../Types/types.d";

import "./Calendar.css";

interface Props {
    selectedDates: SelectedDates[];
    setSelectedDates: Dispatch<SetStateAction<SelectedDates[]>>;
    calendarRef: MutableRefObject<FullCalendar | null>;
    isSelecting: boolean;
    typeCalendar: "Home" | "Profile";
    googleCalendarId: string;
    tutor?: Tutor;
    user?: User;
}

interface Event {
    description: string;
    end: {
        dateTime: Date;
    };
    start: {
        dateTime: Date;
    };
    summary: string;
    attendees: {
        email: string;
    }[];
}

export function Calendar({
    selectedDates,
    setSelectedDates,
    calendarRef,
    isSelecting,
    googleCalendarId,
    typeCalendar = "Home",
    tutor,
    user,
}: Props) {
    const [events, setEvents] = useState<SelectedDates[]>([]);
    const [availableEvents, setAvailableEvents] = useState<SelectedDates[]>([]);
    const navigate = useNavigate();
    const { logoutUser } = useUserActions();

    useEffect(() => {
        if (isSelecting || !googleCalendarId) return;

        getAvailableSchedule(googleCalendarId, tutor?._id)
            .then((events: Event[]) => {
                setEvents(
                    events.map((event) => {
                        return {
                            attendees: event.attendees,
                            description: event.description,
                            end: event.end.dateTime,
                            start: event.start.dateTime,
                            title: event.summary,
                        };
                    })
                );
            })
            .catch((err: AxiosError) => {
                toast.error("Error al obtener horarios disponibles", {
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
    }, [isSelecting]);

    useEffect(() => {
        if (typeCalendar === "Profile") return;
        if (events.length === 0) return;

        if (new Date() < new Date(events[0].start)) {
            setAvailableEvents([
                {
                    attendees: [],
                    description: "Horario no disponible para tutorías",
                    end: new Date(events[0].start),
                    start: new Date(),
                    title: "No disponible",
                },
            ]);
        }

        setAvailableEvents((availableEvents) =>
            [
                ...availableEvents,
                events.map((event, index) => {
                    if (event.title === "Disponible") {
                        return {
                            attendees: event.attendees,
                            description: "Horario no disponible para tutorías",
                            end: event.start,
                            start:
                                index === 0
                                    ? new Date()
                                    : events[index - 1].end,
                            title: "No disponible",
                        };
                    } else {
                        return event;
                    }
                }),
            ].flat()
        );

        setAvailableEvents((availableEvents) =>
            availableEvents.filter((event) => event.start < event.end)
        );
    }, [events, typeCalendar]);

    const handleSelectProfile = ({ start, end }: DateRange) => {
        const isFollowedByDate = selectedDates.some(
            (date) =>
                end.getTime() === date.start.getTime() ||
                start.getTime() === date.end.getTime()
        );

        if (isFollowedByDate) {
            const newSelectedDates = selectedDates.map((date) => {
                if (end.getTime() === date.start.getTime()) {
                    return {
                        ...date,
                        start,
                    };
                } else if (start.getTime() === date.end.getTime()) {
                    return {
                        ...date,
                        end,
                    };
                }

                return date;
            });

            const overlappingDates: SelectedDates[] = [];

            newSelectedDates.forEach((date) => {
                const isOverlapping = overlappingDates.some(
                    (overlappingDate) =>
                        date.start.getTime() < overlappingDate.end.getTime() &&
                        date.end.getTime() > overlappingDate.start.getTime()
                );

                if (isOverlapping) {
                    const overlappingDate = overlappingDates.find(
                        (overlappingDate) =>
                            date.start.getTime() <
                                overlappingDate.end.getTime() &&
                            date.end.getTime() > overlappingDate.start.getTime()
                    );

                    if (overlappingDate) {
                        overlappingDate.start =
                            overlappingDate.start.getTime() <
                            date.start.getTime()
                                ? overlappingDate.start
                                : date.start;
                        overlappingDate.end =
                            overlappingDate.end.getTime() > date.end.getTime()
                                ? overlappingDate.end
                                : date.end;
                    }
                } else {
                    overlappingDates.push(date);
                }
            });

            return setSelectedDates(overlappingDates);
        }

        setSelectedDates([
            ...selectedDates,
            {
                title: "Disponible",
                description: "Horario disponible para tutorías",
                attendees: [],
                start,
                end,
            },
        ]);
    };

    const handleSelectHome = ({ start, end }: DateRange) => {
        if (!tutor || !user) return;

        if (events.length === 0) {
            return toast.error(
                "El tutor no tiene horarios disponibles para tutorías"
            );
        }

        // Comprobar si la fecha seleccionada inicia antes de la fecha actual
        if (start.getTime() < new Date().getTime()) {
            return toast.error(
                "No puedes agendar una tutoría en una fecha que ya pasó",
                { duration: 5000 }
            );
        }

        setSelectedDates([
            {
                attendees: [
                    {
                        email: tutor.email,
                    },
                    {
                        email: user.email,
                    },
                ],
                description: `Tutoría de ${tutor.coursesToTeach.name} del tutor ${tutor.name} para el estudiante ${user.name}`,
                end,
                start,
                title: `Tutoría de ${tutor.coursesToTeach.name}`,
                course: tutor.coursesToTeach.name,
            },
        ]);
    };

    const handleDeleteDate = (date: Date) => {
        setSelectedDates(
            selectedDates.filter((selectedDate) => {
                return selectedDate.start !== date;
            })
        );
    };

    return (
        <>
            <FullCalendar
                ref={calendarRef}
                plugins={[
                    interactionPlugin,
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                ]}
                initialView="dayGridMonth"
                events={
                    isSelecting
                        ? typeCalendar === "Profile"
                            ? selectedDates
                            : [...selectedDates, ...availableEvents]
                        : events
                }
                dayPopoverFormat={{ month: "long", day: "numeric" }}
                buttonText={{
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    list: "Lista",
                }}
                headerToolbar={{
                    left:
                        isSelecting && typeCalendar === "Profile"
                            ? ""
                            : "prev,next today",
                    center: "title",
                    right:
                        isSelecting && typeCalendar === "Profile"
                            ? ""
                            : "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                dateClick={(info) => {
                    if (!isSelecting) {
                        info.view.calendar.gotoDate(info.date);
                        info.view.calendar.changeView("timeGridDay");
                    }
                }}
                eventClick={(info) => {
                    if (!info.event.start) return;

                    info.jsEvent.preventDefault();

                    if (
                        !isSelecting &&
                        info.view.calendar.view.type === "dayGridMonth"
                    ) {
                        info.view.calendar.gotoDate(info.event.start);
                        info.view.calendar.changeView("timeGridDay");
                    }
                }}
                selectable={isSelecting}
                select={
                    typeCalendar === "Profile"
                        ? handleSelectProfile
                        : handleSelectHome
                }
                selectOverlap={false}
                locale="es"
            />

            <div className="stge__calendar-selectedDates">
                {selectedDates.length > 0 && (
                    <>
                        <h1>Horarios Seleccionados</h1>

                        <ul>
                            {selectedDates.map((date) => {
                                const isAllDay =
                                    date.start.getHours() === 0 &&
                                    date.start.getMinutes() === 0 &&
                                    date.end.getHours() === 0 &&
                                    date.end.getMinutes() === 0;

                                let start = date.start.toLocaleDateString(
                                    "es-CO",
                                    { weekday: "long" }
                                );

                                start =
                                    start.charAt(0).toUpperCase() +
                                    start.slice(1);

                                let end: Date | string = new Date(date.end);

                                if (isAllDay) {
                                    end.setDate(end.getDate() - 1);
                                }

                                end = end.toLocaleDateString("es-CO", {
                                    weekday: "long",
                                });

                                end =
                                    end.charAt(0).toUpperCase() + end.slice(1);

                                return (
                                    <div key={date.start.toString()}>
                                        <li>
                                            <p>
                                                {start === end
                                                    ? start
                                                    : start === "Domingo" &&
                                                      end === "Sábado"
                                                    ? "Todos los días"
                                                    : `${start} - ${end}`}
                                            </p>

                                            <p>
                                                {isAllDay
                                                    ? "Todo el día"
                                                    : `${date.start.toLocaleTimeString(
                                                          "es-CO",
                                                          {
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                          }
                                                      )} - ${date.end.toLocaleTimeString(
                                                          "es-CO",
                                                          {
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                          }
                                                      )}`}
                                            </p>
                                        </li>

                                        <button
                                            name="delete-date"
                                            onClick={() =>
                                                handleDeleteDate(date.start)
                                            }
                                        >
                                            <BiSolidTrash />
                                        </button>
                                    </div>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
}
