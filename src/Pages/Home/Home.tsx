import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

import { HomeFunctions } from "../../Components/HomeFunctions/HomeFunctions";
import { useTutorsActions } from "../../Hooks/useTutorsActions";
import { useUserActions } from "../../Hooks/useUserActions";
import { getTutors } from "../../API/Tutors";
import { Tutor } from "../../Types/types.d";
import { TutorCard } from "../../Components";
import { useAppSelector } from "../../Hooks/store";

import "./Home.css";

export function Home() {
    const { logoutUser } = useUserActions();
    const { setTutors } = useTutorsActions();
    const tutors = useAppSelector((state) => state.tutors);
    const navigate = useNavigate();
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

    console.log(tutors);

    useEffect(() => {
        document.title = "Home - STGE";

        if (tutors.length === 0 || tutors[0]._id !== "") return;

        getTutors()
            .then((tutors: Tutor[]) => setTutors(tutors))
            .catch((err: AxiosError) => {
                toast.error("Error al obtener tutores", { duration: 5000 });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate("/login");
                    return toast.error("La sesión ha expirado");
                }
            });
    }, [setTutors, tutors]);

    return (
        <main className="stge__home">
            {tutors.length !== 0 ? (
                tutors[0]._id !== "" ? (
                    <>
                        <div className="stge__home-tutors">
                            {tutors &&
                                tutors.map((tutor: Tutor) => (
                                    <TutorCard
                                        key={`${tutor._id} - ${tutor.coursesToTeach.nrc}`}
                                        tutor={tutor}
                                        setSelectedTutor={setSelectedTutor}
                                    />
                                ))}
                        </div>
                    </>
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

            <HomeFunctions selectedTutor={selectedTutor} />
        </main>
    );
}
