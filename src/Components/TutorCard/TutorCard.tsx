import { RatingStar } from "rating-star";
import { Tutor } from "../../Types/types.d";
import "./TutorCard.css";

export function TutorCard({ tutor }: { tutor: Tutor }) {
    return (
        <div className="stge__tutorCard">
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
