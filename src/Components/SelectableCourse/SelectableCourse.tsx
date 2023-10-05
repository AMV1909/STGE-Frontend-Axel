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
                    <p style={{ fontWeight: "bold" }}>
                        Nombre del curso:{" "}
                        <p style={{ fontWeight: "normal" }}>{course.name}</p>
                    </p>
                    <p style={{ fontWeight: "bold" }}>
                        Nota Final:{" "}
                        <p
                            style={{
                                fontWeight: "normal",
                                color:
                                    course.grade >= 3.8 ? "#008f39" : "#ff0000",
                            }}
                        >
                            {course.grade}
                        </p>
                    </p>
                    <p style={{ fontWeight: "bold" }}>
                        Aprobado:{" "}
                        <p
                            style={{
                                fontWeight: "normal",
                                color:
                                    course.grade >= 3.8 ? "#008f39" : "#ff0000",
                            }}
                        >
                            {course.grade >= 3.8 ? "Sí" : "No"}
                        </p>
                    </p>
                </div>
            </div>
        </div>
    );
}
