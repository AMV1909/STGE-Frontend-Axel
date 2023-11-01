import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BsArrowRight } from "react-icons/bs";

import { Course, PathRoutes } from "../../../Types/types.d";
import { useAppSelector } from "../../../Hooks/store";
import { SelectableCourse } from "../..";
import { useUserActions } from "../../../Hooks/useUserActions";
import {
    getCoursesToTeach,
    updateCoursesToTeach,
} from "../../../API/CoursesToTeach";

import "./Modify.css";

export function Modify() {
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    const { updateCourses, callPreviousCourses, logoutUser } = useUserActions();
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

                courses.forEach((course) => {
                    return (course.grade = Number(course.grade));
                });

                setCoursesToTeach(courses);
            })
            .catch((err) => {
                toast.error("Error al obtener los cursos", { duration: 5000 });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
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

    const handleContinue = async () => {
        updateCourses(selectedCourses);

        toast.loading("Actualizando cursos...", {
            id: "loading",
            duration: 5000,
        });

        await updateCoursesToTeach(selectedCourses)
            .then(() => {
                toast.dismiss("loading");
                toast.success("Cursos actualizados", { duration: 5000 });
            })
            .catch((err: AxiosError) => {
                callPreviousCourses();

                toast.dismiss("loading");
                toast.error("Error al actualizar los cursos", {
                    duration: 5000,
                });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 409)
                    toast.error(
                        "Algunos de los cursos que intenta registrar no cumplen con los requisitos",
                        { duration: 5000 }
                    );

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });
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

            <div className="stge__profileTabs-modify_button">
                <button
                    onClick={handleContinue}
                    disabled={
                        selectedCourses.length === 0 ||
                        (selectedCourses.every((course) =>
                            user.coursesToTeach?.find(
                                (courseToTeach) =>
                                    courseToTeach.nrc === course.nrc
                            )
                        ) &&
                            user.coursesToTeach?.every((course) =>
                                selectedCourses.find(
                                    (courseToTeach) =>
                                        courseToTeach.nrc === course.nrc
                                )
                            ))
                    }
                >
                    Continuar <BsArrowRight size={24} />
                </button>
            </div>
        </div>
    );
}
