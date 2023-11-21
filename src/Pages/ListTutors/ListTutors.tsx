import { useNavigate } from "react-router-dom";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

import { getTutorsWithEvents } from "../../API/Tutors";
import { useUserActions } from "../../Hooks/useUserActions";
import { TutorCard, TutorInfo } from "../../Components";
import { PathRoutes, Tutor, TutorWithEvents } from "../../Types/types.d";

import "./ListTutors.css";

export function ListTutors() {
    const { logoutUser } = useUserActions();
    const navigate = useNavigate();
    const [tutors, setTutors] = useState<TutorWithEvents[] | null>(null);
    const [selectedTutor, setSelectedTutor] = useState<TutorWithEvents | null>(
        null
    );
    const [search, setSearch] = useState("");
    const [toggle, setToggle] = useState(false);
    const originalTutors = useRef<TutorWithEvents[]>([]);

    useEffect(() => {
        document.title = "Tutores - Plan Padrino";

        getTutorsWithEvents()
            .then((data: TutorWithEvents[]) => {
                setTutors(data);
                originalTutors.current = data;
            })
            .catch((err: AxiosError) => {
                toast.error("Error al obtener tutores", { duration: 5000 });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });
    }, []);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filteredTutors = useMemo(() => {
        if (tutors === null) return [];

        if (search === "" && !toggle) return originalTutors.current;

        const searchTutors = tutors.filter(
            (tutor) =>
                tutor.name.toLowerCase().includes(search.toLowerCase()) ||
                tutor.career.toLowerCase().includes(search.toLowerCase())
        );

        return toggle
            ? searchTutors.filter((tutor) => tutor.meetingTime >= 80)
            : searchTutors;
    }, [search, toggle, tutors]);

    if (tutors === null) {
        return (
            <div className="stge__home-loader">
                <h1>Cargando...</h1>
                <div></div>
            </div>
        );
    }

    return (
        <main className="stge__home">
            <div className="stge__home-filters">
                <div className="stge__home-tutors_filters">
                    <input
                        type="search"
                        name="name"
                        autoComplete="off"
                        onChange={onChange}
                        value={search}
                    />

                    <button
                        name="filter-tutors-with-80-hours"
                        className={`${!toggle && "off"}`}
                        onClick={() => setToggle(!toggle)}
                    >
                        +80 Horas
                    </button>
                </div>

                {filteredTutors.length !== 0 ? (
                    filteredTutors[0]._id !== "" ? (
                        <div className="stge__home-tutors">
                            {filteredTutors &&
                                filteredTutors.map((tutor: Tutor) => (
                                    <TutorCard
                                        key={tutor._id}
                                        tutor={tutor}
                                        setSelectedTutor={setSelectedTutor}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="stge__home-loader">
                            <h1>Cargando...</h1>
                            <div></div>
                        </div>
                    )
                ) : (
                    <div className="stge__home-noInfo">
                        <h3>
                            No se ha encontrado ningún tutor con la búsqueda
                            proporcionada
                        </h3>
                    </div>
                )}
            </div>

            <TutorInfo selectedTutor={selectedTutor} />
        </main>
    );
}
