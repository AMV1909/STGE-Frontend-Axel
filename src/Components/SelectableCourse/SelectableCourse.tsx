import { SlBookOpen } from "react-icons/sl";
import { Course } from "../../Types/types.d";
import "./SelectableCourse.css";

interface Props {
    course: Course;
    handleSelectCourse: (course: Course) => void;
    selected?: boolean;
}

export function SelectableCourse({
    course,
    handleSelectCourse,
    selected = false,
}: Props) {
    return (
        <div className="stge__selectableCourse">
            <input
                style={
                    course.grade >= 3.8
                        ? {}
                        : { appearance: "none", cursor: "auto" }
                }
                type="checkbox"
                aria-label={course.name}
                name={course.name}
                id={course.nrc}
                onClick={() =>
                    course.grade >= 3.8 && handleSelectCourse(course)
                }
                defaultChecked={selected}
            />

            <div className="stge__selectableCourse-card">
                <SlBookOpen />

                <div>
                    <p>
                        <strong>Nombre del curso: </strong>
                        {course.name}
                    </p>
                    <p
                        style={{
                            color: course.grade >= 3.8 ? "#008f39" : "#ff0000",
                        }}
                    >
                        <strong style={{ color: "black" }}>Nota Final: </strong>
                        {course.grade}
                    </p>
                    <p
                        style={{
                            color: course.grade >= 3.8 ? "#008f39" : "#ff0000",
                        }}
                    >
                        <strong style={{ color: "black" }}>Aprobado:</strong>
                        {course.grade >= 3.8 ? "Sí" : "No"}
                    </p>
                </div>
            </div>
        </div>
    );
}
