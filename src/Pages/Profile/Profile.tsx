import { useEffect, useState } from "react";

import { useAppSelector } from "../../Hooks/store";
import { ProfileTabs } from "../../Types/types.d";
import { ProfileTabsComponent } from "../../Components";

import "./Profile.css";

export function Profile() {
    const user = useAppSelector((state) => state.user);
    const [tab, setTab] = useState<ProfileTabs>("");

    useEffect(() => {
        document.title = "Perfil - STGE";
    }, []);

    return (
        <main className="stge__profile">
            <div className="stge__profile-information">
                <img src={user.picture} alt={user.name} />
                <p>
                    <p>{user.name}</p>
                </p>
                <p>
                    ID: <p>{user._id}</p>
                </p>
                <p>
                    Carrera: <p>{user.career}</p>
                </p>
                <p>
                    PGA: <p>{user.pga}</p>
                </p>

                {user.role === "Tutor" && (
                    <p>
                        Tiempo en reunión: <p>{user.meetingTime}</p>
                    </p>
                )}

                <div className="stge__profile-information_buttons">
                    {user.role === "Tutor" && (
                        <button onClick={() => setTab("schedule")}>
                            Horarios
                        </button>
                    )}

                    {(user.role === "Student" || user.role === "Tutor") && (
                        <button onClick={() => setTab("requested")}>
                            Reuniones Solicitadas
                        </button>
                    )}

                    {(user.role === "Tutor" || user.role === "Student") && (
                        <button onClick={() => setTab("scheduled")}>
                            Reuniones Agendadas
                        </button>
                    )}

                    {(user.role === "Tutor" || user.role === "Student") && (
                        <button onClick={() => setTab("completed")}>
                            Reuniones Realizadas
                        </button>
                    )}

                    {user.role === "Tutor" && (
                        <button onClick={() => setTab("modify")}>
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
