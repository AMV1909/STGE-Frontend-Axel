import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

import { EventCardTutor } from "..";
import { TutorWithEvents } from "../../Types/types.d";
import unab_logo from "../../Assets/unab_logo_orange.png";

import "./TutorInfo.css";

export function TutorInfo({
    selectedTutor,
    setSelectedTutor,
}: {
    selectedTutor: TutorWithEvents | null;
    setSelectedTutor: Dispatch<SetStateAction<TutorWithEvents | null>>;
}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                            <strong>ID: </strong>
                            {selectedTutor._id}
                        </p>

                        <p>
                            <strong>Carrera: </strong>
                            {selectedTutor.career}
                        </p>

                        <p>
                            <strong>Tiempo en reunión: </strong>
                            {new Date(selectedTutor.meetingTime * 60000)
                                .toISOString()
                                .substr(11, 8)}
                        </p>
                    </div>

                    {selectedTutor.events.length > 0 ? (
                        <div className="stge__home-functions_tutor-events">
                            {selectedTutor.events.map((event) => (
                                <EventCardTutor key={event._id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <p className="stge__home-functions_tutor_noEvents">
                            El tutor no tiene eventos registrados
                        </p>
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
