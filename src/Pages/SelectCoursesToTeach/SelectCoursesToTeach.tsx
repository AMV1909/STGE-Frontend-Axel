import { useEffect, useState } from "react";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

import { SelectableCourse, SplitTitle } from "../../Components";
import { useAppSelector } from "../../Hooks/store";
import { Course, PathRoutes } from "../../Types/types.d";
import { googleRegisterTutor } from "../../API/Session";
import { useTempUserActions } from "../../Hooks/useTempUserActions";

import "./SelectCoursesToTeach.css";

export function SelectCoursesToTeach() {
    const navigate = useNavigate();
    const tempUser = useAppSelector((state) => state.tempUser);
    const { deleteData } = useTempUserActions();
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

    useEffect(() => {
        document.title = "Seleccionar cursos - Plan Padrino";
    }, []);

    const handleSelectCourse = (course: Course) => {
        if (selectedCourses.includes(course)) {
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
        toast.loading("Registrando cursos...", {
            id: "loading",
            duration: 5000,
        });

        await googleRegisterTutor(selectedCourses)
            .then(() => {
                toast.dismiss("loading");

                deleteData();
                navigate(PathRoutes.Login);

                toast.success("Cursos registrados con éxito", {
                    duration: 5000,
                });
            })
            .catch((err: AxiosError) => {
                toast.dismiss("loading");
                toast.error("Error al registrar los cursos", {
                    duration: 5000,
                });

                if (!err.response) return toast.error(err.message);

                if (err.response.status === 403)
                    toast.error(
                        "Algunos de los cursos que intenta registrar no cumplen con los requisitos"
                    );
            });
    };

    return (
        <main className="stge__selectCoursesToTeach">
            <div className="stge__selectCoursesToTeach-listCourses">
                <h1>Seleccionar cursos</h1>
                <p>
                    Promedio General Acumulado (PGA):{" "}
                    <p
                        style={{
                            color: tempUser.pga >= 3.8 ? "#008f39" : "#ff0000",
                        }}
                    >
                        {tempUser && tempUser.pga}
                    </p>
                </p>

                <div className="stge__selectCoursesToTeach-listCourses_container">
                    {tempUser &&
                        tempUser.courses &&
                        tempUser.pga >= 3.8 &&
                        tempUser.courses.map((course) => (
                            <SelectableCourse
                                key={course.nrc}
                                course={course}
                                handleSelectCourse={handleSelectCourse}
                            />
                        ))}

                    {tempUser && tempUser.courses && tempUser.pga <= 3.8 && (
                        <p>
                            Su PGA es demasiado bajo para poder registrarse como
                            tutor{" "}
                        </p>
                    )}

                    {tempUser && tempUser.active_disciplinary_processes && (
                        <p>
                            Tiene procesos disciplinarios activos, por lo que no
                            puede registrarse como tutor{" "}
                        </p>
                    )}

                    <div className="stge__selectCoursesToTeach-listCourses_container-button">
                        <button onClick={() => navigate(PathRoutes.Register)}>
                            <BsArrowLeft size={24} />
                            Regresar
                        </button>

                        {tempUser &&
                            tempUser.courses &&
                            tempUser.pga >= 3.8 && (
                                <button
                                    disabled={selectedCourses.length === 0}
                                    onClick={handleContinue}
                                >
                                    Continuar <BsArrowRight size={24} />
                                </button>
                            )}
                    </div>
                </div>
            </div>

            <SplitTitle title="¿Qué enseñarás?" />
        </main>
    );
}
