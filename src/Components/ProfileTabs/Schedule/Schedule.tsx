import FullCalendar from "@fullcalendar/react";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import { useAppSelector } from "../../../Hooks/store";

import "./Schedule.css";

export function Schedule() {
    const user = useAppSelector((state) => state.user);

    return (
        <div className="stge__profileTabs-schedule">
            <FullCalendar
                plugins={[
                    googleCalendarPlugin,
                    interactionPlugin,
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                ]}
                initialView="dayGridMonth"
                events={{ googleCalendarId: user.tutorCalendarId }}
                googleCalendarApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                buttonText={{
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    list: "Lista",
                }}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                eventClick={(info) => {
                    if (!info.event.start) return;

                    info.jsEvent.preventDefault();
                    info.view.calendar.gotoDate(info.event.start);
                    info.view.calendar.changeView("timeGridDay");
                }}
                locale="es"
            />
        </div>
    );
}
