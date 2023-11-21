import { useEffect, useState } from "react";

import { useAppSelector } from "../../Hooks/store";
import { ProfileTabs } from "../../Types/types.d";
import { ProfileTabsComponent } from "../../Components";

import "./Profile.css";

export function Profile() {
    const user = useAppSelector((state) => state.user);
    const [tab, setTab] = useState<ProfileTabs>("");

    useEffect(() => {
        document.title = "Perfil - Plan Padrino";
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

            <div className="stge__profile-component">
                <ProfileTabsComponent tab={tab} />
            </div>
        </main>
    );
}
