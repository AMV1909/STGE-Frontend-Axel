import { AxiosError } from "axios";
import { useState, useRef } from "react";
import { BiSolidTrash } from "react-icons/bi";
import { toast } from "react-hot-toast";
import FullCalendar from "@fullcalendar/react";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import { socket } from "../../../Socket";
import { useAppSelector } from "../../../Hooks/store";
import { updateAvailableSchedule } from "../../../API/Calendar";

import "./Schedule.css";

interface DateRange {
    start: Date;
    end: Date;
}

interface SelectedDates extends DateRange {
    title: string;
    description: string;
    attendees: [];
}

export function Schedule() {
    const user = useAppSelector((state) => state.user);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedDates, setSelectedDates] = useState<SelectedDates[]>([]);
    const calendarRef = useRef<FullCalendar | null>(null);

    const changeToSelect = () => {
        if (calendarRef.current) {
            calendarRef.current.getApi().changeView("timeGridWeek");
            calendarRef.current.getApi().gotoDate(new Date());
        }

        setIsSelecting(true);
    };

    const handleSelect = ({ start, end }: DateRange) => {
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

                return date; // No modificar las fechas no contiguas
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

    const handleCancelSelection = () => {
        if (calendarRef.current) {
            calendarRef.current.getApi().changeView("dayGridMonth");
        }

        setIsSelecting(false);
        setSelectedDates([]);
    };

    const handleDeleteDate = (date: Date) => {
        setSelectedDates(
            selectedDates.filter((selectedDate) => {
                return selectedDate.start !== date;
            })
        );
    };

    const handleConfirmSelection = async () => {
        // Aquí puedes enviar los datos de `selectedDates` al servidor o realizar otras acciones
        // para guardar los horarios seleccionados por el usuario.
        toast.loading("Guardando horarios...", {
            id: "loading",
            duration: Infinity,
        });

        await updateAvailableSchedule(selectedDates)
            .then(() => {
                toast.dismiss("loading");

                socket.emit("reject-all-requested-events", user._id);
                toast.success("Horarios guardados exitosamente.");

                if (calendarRef.current) {
                    calendarRef.current.getApi().refetchEvents();
                }
            })
            .catch((err: AxiosError) => {
                toast.dismiss("loading");
                toast.error("Ha ocurrido un error al guardar los horarios.");

                console.log(err);

                if (!err.response) return toast.error(err.message);
                if (err.response.status === 403)
                    return toast.error(
                        "Algunas de las fechas seleccionadas no son válidas."
                    );

                if (err.response.status === 405)
                    return toast.error(
                        "No puedes modificar tu horario mientras tienes tutorías agendadas."
                    );
            });
        // Luego, puedes desactivar el modo de selección y limpiar `selectedDates`.
        setIsSelecting(false);
        setSelectedDates([]);
    };

    socket.on(`all-events-rejected-${user._id}`, () => {
        toast.success("Todas las solicitudes de tutorías han sido rechazadas.");
    });

    return (
        <div className="stge__profileTabs-schedule">
            <h1>Mis Horarios</h1>

            {isSelecting ? (
                <div className="stge__profileTabs-schedule_info">
                    <button onClick={handleConfirmSelection}>
                        Confirmar Selección
                    </button>

                    <p>
                        Selecciona las fechas al arrastrar el cursor a través
                        del calendario. Recomendamos no seleccionar la opción
                        todo el día, eso ocasionará que puedan agendarte a
                        cualquier hora del día. En la parte inferior se
                        mostrarán las fechas seleccionadas. Si deseas eliminar
                        una fecha, puedes dar click en el botón de la papelera.
                    </p>

                    <button onClick={handleCancelSelection}>
                        Cancelar Selección
                    </button>
                </div>
            ) : (
                <div className="stge__profileTabs-schedule_info">
                    <p>
                        Si deseas modificar tu horario de tutorías, puedes dar
                        click en el siguiente botón y selecionar las fechas al
                        arrastras el cursor a través del calendario. Por
                        defecto, tu horario estará vacío, lo que indica que no
                        tienes horarios disponibles para tutorías. Ten en
                        cuenta, que si ya tienes reuniones agendadas, no podrás
                        modificar tu horario, debes completarlas primero.
                    </p>

                    <button onClick={() => changeToSelect()}>
                        Activar Modo de Selección
                    </button>
                </div>
            )}

            <FullCalendar
                ref={calendarRef}
                plugins={[
                    googleCalendarPlugin,
                    interactionPlugin,
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                ]}
                initialView="dayGridMonth"
                events={
                    isSelecting
                        ? selectedDates
                        : { googleCalendarId: user.tutorCalendarId }
                }
                googleCalendarApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                buttonText={{
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    list: "Lista",
                }}
                headerToolbar={{
                    left: isSelecting ? "" : "prev,next today",
                    center: "title",
                    right: isSelecting
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

                    if (!isSelecting) {
                        info.view.calendar.gotoDate(info.event.start);
                        info.view.calendar.changeView("timeGridDay");
                    }
                }}
                selectable={isSelecting}
                select={handleSelect}
                selectOverlap={false}
                locale="es"
            />

            <div className="stge__profileTabs-schedule_selectedDates">
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
        </div>
    );
}
