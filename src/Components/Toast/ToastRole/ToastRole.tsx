import { ChangeEvent, FormEvent, useState } from "react";
import { Toast, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { googleRegisterStudent, getTempUserData } from "../../../API/Session";
import { useUserActions } from "../../../Hooks/useUserActions";
import { useTempUserActions } from "../../../Hooks/useTempUserActions";
import { PathRoutes, TempUser } from "../../../Types/types.d";

import "./ToastRole.css";

export function ToastRole({ t }: { t: Toast }) {
    const navigate = useNavigate();
    const { logoutUser } = useUserActions();
    const { setTempUser } = useTempUserActions();
    const [role, setRole] = useState<"" | "Student" | "Tutor">("");

    const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRole(e.target.value as "" | "Student" | "Tutor");

        if (e.target.value !== "") {
            toast.dismiss("role");
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        switch (role) {
            case "":
                toast.error("Seleccione un rol", {
                    id: "role",
                    duration: Infinity,
                });

                break;

            case "Student":
                toast.dismiss(t.id);
                toast.loading("Registrando usuario...", {
                    id: "loading",
                    duration: 5000,
                });

                await googleRegisterStudent()
                    .then(() => {
                        toast.dismiss("loading");
                        toast.success("Usuario registrado con éxito", {
                            duration: 5000,
                        });

                        navigate(PathRoutes.Login);
                    })
                    .catch((err: AxiosError) => {
                        toast.dismiss("loading");
                        toast.error("Error al registrarse", { duration: 5000 });

                        if (!err.response) return toast.error(err.message);

                        if (err.response?.status === 400) {
                            return toast.error(
                                "El correo seleccionado no es válido",
                                {
                                    duration: 5000,
                                }
                            );
                        }

                        if (err.response?.status === 409) {
                            return toast.error(
                                "Ya existe una cuenta con este correo",
                                {
                                    duration: 5000,
                                }
                            );
                        }

                        if (err.response?.status === 500) {
                            logoutUser();
                            navigate(PathRoutes.Login);
                            return toast.error("La sesión ha expirado");
                        }

                        toast.error(err.message, { duration: 5000 });
                    });

                break;

            case "Tutor":
                toast.dismiss(t.id);
                toast.loading("Obteniendo información...", {
                    id: "loading",
                    duration: 5000,
                });

                await getTempUserData()
                    .then((res: TempUser) => {
                        toast.dismiss("loading");

                        res.courses.forEach((course) => {
                            return (course.grade = Number(course.grade));
                        });

                        setTempUser(res);
                        navigate(PathRoutes.SelectCoursesToTeach);

                        toast.success("Bienvenido", { duration: 5000 });
                        toast.success(
                            "Por favor, seleccione los cursos que desea registrar",
                            {
                                duration: 5000,
                            }
                        );
                    })
                    .catch((err: AxiosError) => {
                        toast.dismiss("loading");
                        toast.error("Error al registrarse", { duration: 5000 });

                        if (!err.response) return toast.error(err.message);

                        if (err.response?.status === 400) {
                            return toast.error(
                                "El correo seleccionado no es válido",
                                {
                                    duration: 5000,
                                }
                            );
                        }

                        if (err.response?.status === 405) {
                            return toast.error(
                                "Ya existe una cuenta con este correo",
                                {
                                    duration: 5000,
                                }
                            );
                        }

                        if (err.response?.status === 500) {
                            logoutUser();
                            navigate(PathRoutes.Login);
                            return toast.error("La sesión ha expirado");
                        }

                        toast.error(err.message, { duration: 5000 });
                    });
        }
    };

    return (
        <div className="stge__toastRole">
            <p>Seleccione el rol con el que desea registrarse</p>

            <form onSubmit={handleSubmit}>
                <select name="role" onChange={onChange}>
                    <option defaultChecked value="">
                        Seleccione un rol
                    </option>
                    <option value="Student">Estudiante</option>
                    <option value="Tutor">Tutor</option>
                </select>

                <button name="continue" type="submit">
                    Continuar
                </button>
            </form>
        </div>
    );
}
