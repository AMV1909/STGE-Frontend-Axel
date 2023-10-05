import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useAppSelector } from "../../../Hooks/store";
import { Course } from "../../../Types/types.d";

import "./Modify.css";
import { SelectableCourse } from "../..";
import { getCoursesToTeach } from "../../../API/CoursesToTeach";

export function Modify() {
    const user = useAppSelector((state) => state.user);
    const [coursesToTeach, setCoursesToTeach] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>(
        user.coursesToTeach || []
    );

    useEffect(() => {
        toast.loading("Obteniendo cursos...", {
            id: "loading",
            duration: 5000,
        });

        getCoursesToTeach()
            .then((courses: Course[]) => {
                toast.dismiss("loading");
                setCoursesToTeach(courses);
            })
            .catch((err) => {
                toast.error("Error al obtener los cursos", { duration: 5000 });
                toast.error(err.message, { duration: 5000 });
            });
    }, []);

    const handleSelectCourse = (course: Course) => {
        if (
            selectedCourses.find(
                (selectedCourse) => selectedCourse.nrc === course.nrc
            )
        ) {
            setSelectedCourses(
                selectedCourses.filter((selectedCourse) => {
                    return selectedCourse.nrc !== course.nrc;
                })
            );
        } else {
            setSelectedCourses([...selectedCourses, course]);
        }
    };

    return (
        <div className="stge__profileTabs-modify">
            <h1>Modificar Asignaturas A Enseñar</h1>

            <div className="stge__profileTabs-modify_listCourses">
                {coursesToTeach &&
                    coursesToTeach.map((course) => (
                        <SelectableCourse
                            key={course.nrc}
                            course={course}
                            handleSelectCourse={handleSelectCourse}
                            selected={
                                user.coursesToTeach &&
                                user.coursesToTeach.find((courseToTeach) => {
                                    return courseToTeach.nrc === course.nrc;
                                })
                                    ? true
                                    : false
                            }
                        />
                    ))}
            </div>
        </div>
    );
}
