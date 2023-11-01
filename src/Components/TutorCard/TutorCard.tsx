import { Dispatch, SetStateAction } from "react";
import { RatingStar } from "rating-star";
import { toast } from "react-hot-toast";

import { useAppSelector } from "../../Hooks/store";
import { Tutor } from "../../Types/types.d";

import "./TutorCard.css";

interface Props {
    tutor: Tutor;
    setSelectedTutor: Dispatch<SetStateAction<Tutor | null>>;
}

export function TutorCard({ tutor, setSelectedTutor }: Props) {
    const user = useAppSelector((state) => state.user);

    const onClick = () => {
        if (user.role !== "Student") {
            enum RoleString {
                "Student" = "estudiante",
                "Tutor" = "tutor",
                "Admin" = "administrador",
                "Worker" = "trabajador",
            }

            return toast.error(
                `Los ${
                    RoleString[user.role]
                }es no pueden seleccionar tutores para tutorías`
            );
        }

        setSelectedTutor(tutor);
    };

    return (
        <div className="stge__tutorCard" onClick={onClick}>
            <img src={tutor.picture} alt={tutor.name} />

            <div className="stge__tutorCard-information">
                <div>
                    <div className="stge__tutorCard-information_data">
                        <p>
                            Nombre: <p>{tutor.name}</p>
                        </p>
                        <p>
                            Carrera: <p>{tutor.career}</p>
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
