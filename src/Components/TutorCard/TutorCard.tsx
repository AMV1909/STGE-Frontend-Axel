import { Dispatch } from "react";
import { RatingStar } from "rating-star";
import { toast } from "react-hot-toast";

import { useAppSelector } from "../../Hooks/store";
import { PathRoutes, Tutor } from "../../Types/types.d";

import "./TutorCard.css";

interface Props {
    tutor: Tutor;
    setSelectedTutor: Dispatch<any>;
}

export function TutorCard({ tutor, setSelectedTutor }: Props) {
    const user = useAppSelector((state) => state.user);

    const onClick = () => {
        if (user.role === "Student") {
            return setSelectedTutor(tutor);
        } else {
            if (
                window.location.pathname === PathRoutes.TutorsList &&
                (user.role === "Worker" || user.role === "Admin")
            )
                return setSelectedTutor(tutor);
        }

        toast.error(
            "Solo los estudiantes pueden seleccionar tutores para agendar tutorías",
            { duration: 5000 }
        );
    };

    return (
        <div className="stge__tutorCard" onClick={onClick}>
            <img src={tutor.picture} alt={tutor.name} />

            <div className="stge__tutorCard-information">
                <div>
                    <div className="stge__tutorCard-information_data">
                        <p>
                            <strong>Nombre: </strong>
                            {tutor.name}
                        </p>
                        <p>
                            <strong>Carrera: </strong>
                            {tutor.career}
                        </p>
                    </div>

                    <div className="stge__tutorCard-information_score">
                        <RatingStar
                            id={tutor._id}
                            maxScore={5}
                            rating={tutor.score}
                        />

                        <p>({tutor.score})</p>
                    </div>
                </div>

                <p>
                    {tutor.coursesToTeach.name} ({tutor.coursesToTeach.grade})
                </p>
            </div>
        </div>
    );
}
