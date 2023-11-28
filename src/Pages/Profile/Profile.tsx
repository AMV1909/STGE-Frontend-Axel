import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

import { useAppSelector } from "../../Hooks/store";
import { ProfileTabs } from "../../Types/types.d";
import { ProfileTabsComponent } from "../../Components";

import "./Profile.css";

export function Profile() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [tab, setTab] = useState<ProfileTabs>("");
    const user = useAppSelector((state) => state.user);

    useEffect(() => {
        document.title = "Perfil - Plan Padrino";

        const handleResize = () => setWindowWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <main className="stge__profile">
            <div className="stge__profile-information">
                <img src={user.picture} alt={user.name} />

                <strong>{user.name}</strong>

                <p>
                    <strong>ID: </strong>
                    {user._id}
                </p>

                {(user.role === "Tutor" || user.role === "Student") && (
                    <>
                        <p>
                            <strong>Carrera: </strong>
                            {user.career}
                        </p>

                        <p>
                            <strong>PGA: </strong>
                            {user.pga}
                        </p>
                    </>
                )}

                {user.role === "Tutor" && (
                    <p>
                        <strong>Tiempo en reunión: </strong>
                        {new Date(user.meetingTime! * 60000)
                            .toISOString()
                            .substr(11, 8)}
                    </p>
                )}

                <div className="stge__profile-information_buttons">
                    {user.role === "Tutor" && (
                        <button
                            name="schedule-tab"
                            onClick={() => setTab("schedule")}
                        >
                            Horarios
                        </button>
                    )}

                    {(user.role === "Student" || user.role === "Tutor") && (
                        <button
                            name="requested-events-tab"
                            onClick={() => setTab("requested")}
                        >
                            Reuniones Solicitadas
                        </button>
                    )}

                    {(user.role === "Tutor" || user.role === "Student") && (
                        <button
                            name="scheduled-events-tab"
                            onClick={() => setTab("scheduled")}
                        >
                            Reuniones Agendadas
                        </button>
                    )}

                    {(user.role === "Tutor" || user.role === "Student") && (
                        <button
                            name="completed-events-tab"
                            onClick={() => setTab("completed")}
                        >
                            Reuniones Completadas
                        </button>
                    )}

                    {user.role === "Tutor" && (
                        <button
                            name="modify-courses-to-teach-tab"
                            onClick={() => setTab("modify")}
                        >
                            Modificar Asignaturas A Impartir
                        </button>
                    )}
                </div>
            </div>

            <div
                className={`${
                    windowWidth <= 800
                        ? tab
                            ? "stge__profile-component"
                            : "hidden"
                        : "stge__profile-component"
                }`}
            >
                {windowWidth <= 800 && (
                    <button id="close" onClick={() => setTab("")}>
                        <IoCloseCircleOutline />
                    </button>
                )}

                <ProfileTabsComponent tab={tab} />
            </div>
        </main>
    );
}
