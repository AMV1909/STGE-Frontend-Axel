import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { IoCloseCircleOutline } from "react-icons/io5";
import FullCalendar from "@fullcalendar/react";

import { socket } from "../../Socket";
import { useAppSelector } from "../../Hooks/store";
import { Calendar } from "../Calendar/Calendar";
import { requestEvent } from "../../API/Events";
import { useUserActions } from "../../Hooks/useUserActions";
import { PathRoutes, SelectedDates, Tutor } from "../../Types/types.d";
import unab_logo from "../../Assets/unab_logo_orange.png";

import "./HomeFunctions.css";

export function HomeFunctions({
    selectedTutor,
    setSelectedTutor,
}: {
    selectedTutor: Tutor | null;
    setSelectedTutor: Dispatch<SetStateAction<Tutor | null>>;
}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedDates, setSelectedDates] = useState<SelectedDates[]>([]);
    const calendarRef = useRef<FullCalendar | null>(null);
    const { logoutUser } = useUserActions();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user);

    useEffect(() => {
        setIsSelecting(false);
    }, [selectedTutor]);

    const changeToSelect = () => {
        if (calendarRef.current) {
            if (isSelecting) {
                calendarRef.current.getApi().changeView("dayGridMonth");
                setSelectedDates([]);
            } else {
                calendarRef.current.getApi().changeView("timeGridWeek");
                calendarRef.current.getApi().gotoDate(new Date());
            }
        }

        setIsSelecting(!isSelecting);
    };

    const handleContinue = async () => {
        await requestEvent(selectedDates)
            .then(() => {
                socket.emit(
                    "event-requested",
                    user._id,
                    selectedTutor!._id,
                    selectedDates[0].course
                );

                toast.success("Tutoría agendada con éxito", { duration: 5000 });
            })
            .catch((err: AxiosError) => {
                toast.error("Error al agendar tutoría", { duration: 5000 });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 413) {
                    return toast.error(
                        "Ya tienes una tutoría agendada con este tutor, por favor espera a que se complete para agendar otra",
                        { duration: 5000 }
                    );
                }

                if (err.response.status === 415) {
                    return toast.error(
                        "El horario seleccionado se cruza con una tutoría que ya tienes agendada o que has solicitado, por favor selecciona otro horario",
                        { duration: 5000 }
                    );
                }

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });

        setIsSelecting(false);
        setSelectedDates([]);
    };

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [selectedTutor]);

    return (
        <div
            className={`${
                windowWidth <= 900
                    ? selectedTutor
                        ? "stge__home-functions"
                        : "hidden"
                    : "stge__home-functions"
            }`}
        >
            <button id="close" onClick={() => setSelectedTutor(null)}>
                <IoCloseCircleOutline />
            </button>

            {selectedTutor ? (
                <div className="stge__home-functions_tutor">
                    <img src={selectedTutor.picture} alt={selectedTutor.name} />

                    <div className="stge__home-functions_tutor-info">
                        <p>{selectedTutor.name}</p>

                        <p>
                            <strong>Carrera: </strong>
                            {selectedTutor.career}
                        </p>

                        <p>
                            <strong>Curso: </strong>
                            {selectedTutor.coursesToTeach.name} (
                            {selectedTutor.coursesToTeach.grade})
                        </p>
                    </div>

                    <button
                        aria-label={
                            isSelecting ? "Cancel Selection" : "New Tutoring"
                        }
                        onClick={() => changeToSelect()}
                    >
                        {isSelecting ? "Cancelar Selección" : "Nueva Tutoría"}
                    </button>

                    {isSelecting && <p>Selecciona la fecha </p>}

                    <Calendar
                        key={selectedTutor._id}
                        typeCalendar="Home"
                        calendarRef={calendarRef}
                        googleCalendarId={selectedTutor.tutorCalendarId}
                        isSelecting={isSelecting}
                        selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}
                        tutor={selectedTutor}
                        user={user}
                    />

                    {isSelecting && selectedDates.length > 0 && (
                        <button
                            id="continue"
                            aria-label="Add Tutoring"
                            onClick={handleContinue}
                        >
                            Agendar Tutoría
                        </button>
                    )}
                </div>
            ) : (
                <div className="stge__home-functions_unselectedTutor">
                    <img src={unab_logo} alt="UNAB logo" />
                </div>
            )}
        </div>
    );
}
