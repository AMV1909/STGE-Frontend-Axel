import { AxiosError } from "axios";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useState,
} from "react";

import { useUserActions } from "../../Hooks/useUserActions";
import { createWorker, updateWorker } from "../../API/Workers";
import { Worker } from "../../Types/types.d";

import "./WorkerModal.css";

interface Props {
    fetch: () => Promise<void>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    workerSelected: Worker | null;
    type: "Create" | "Update";
}

export function WorkerModal({
    fetch,
    setShowModal,
    workerSelected,
    type,
}: Props) {
    const navigate = useNavigate();
    const { logoutUser } = useUserActions();
    const [data, setData] = useState({
        name: workerSelected ? workerSelected.name : "",
        email: workerSelected ? workerSelected.email : "",
        picture: null as File | null,
        pictureUrl: workerSelected ? workerSelected.picture : "",
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "picture") {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files![0]);

            reader.onloadend = () => {
                setData({
                    ...data,
                    picture: e.target.files![0],
                    pictureUrl: reader.result as string,
                });
            };
        }

        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        toast.loading("Creando trabajador...", {
            id: "loading",
            duration: Infinity,
        });

        await createWorker({
            name: data.name,
            email: data.email,
            picture: data.picture,
        })
            .then(() => {
                toast.dismiss("loading");
                toast.success("Trabajador creado con éxito", {
                    duration: 5000,
                });

                fetch();
                setShowModal(false);
            })
            .catch((err: AxiosError) => {
                toast.dismiss("loading");
                toast.error("Error al crear trabajador", { duration: 5000 });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 405) {
                    return toast.error("El correo ya está en uso", {
                        duration: 5000,
                    });
                }

                if (err.response.status === 500) {
                    logoutUser();
                    navigate("/login");
                    return toast.error("La sesión ha expirado");
                }
            });
    };

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        toast.loading("Actualizando trabajador...", {
            id: "loading",
            duration: Infinity,
        });

        await updateWorker({
            id: workerSelected!._id,
            name: data.name,
            email: data.email,
            picture: data.picture,
        })
            .then(() => {
                toast.dismiss("loading");
                toast.success("Trabajador actualizado con éxito", {
                    duration: 5000,
                });

                fetch();
                setShowModal(false);
            })
            .catch((err: AxiosError) => {
                toast.dismiss("loading");
                toast.error("Error al actualizar trabajador", {
                    duration: 5000,
                });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 405) {
                    return toast.error("El correo ya está en uso", {
                        duration: 5000,
                    });
                }

                if (err.response.status === 500) {
                    logoutUser();
                    navigate("/login");
                    return toast.error("La sesión ha expirado");
                }
            });
    };

    return (
        <div className="stge__workerModal">
            <div className="stge__workerModal-content">
                <header>
                    <h1>{type === "Create" ? "Crear" : "Actualizar"} Tutor</h1>

                    <button
                        name="close-modal"
                        onClick={() => setShowModal(false)}
                    >
                        <IoIosCloseCircleOutline />
                    </button>
                </header>

                <form
                    onSubmit={type === "Create" ? handleCreate : handleUpdate}
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        onChange={onChange}
                        required
                        defaultValue={data.name}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Correo"
                        onChange={onChange}
                        required
                        defaultValue={data.email}
                    />

                    <input
                        type="file"
                        name="picture"
                        accept="image/*"
                        onChange={onChange}
                        onClick={() =>
                            setData({ ...data, picture: null, pictureUrl: "" })
                        }
                        required={type === "Create"}
                    />

                    {data.picture || data.pictureUrl ? (
                        <img src={data.pictureUrl} alt="Imagen" />
                    ) : (
                        <p>No se cargado una imagen</p>
                    )}

                    <button name="create-worker" type="submit">
                        {type === "Create" ? "Crear" : "Actualizar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
