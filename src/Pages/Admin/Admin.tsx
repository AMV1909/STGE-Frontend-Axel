import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useUserActions } from "../../Hooks/useUserActions";
import { WorkerCard, WorkerModal } from "../../Components";
import { getWorkers } from "../../API/Workers";
import { Worker } from "../../Types/types.d";

import "./Admin.css";

export function Admin() {
    const { logoutUser } = useUserActions();
    const [workerSelected, setWorkerSelected] = useState<Worker | null>(null);
    const [workers, setWorkers] = useState<Worker[] | null>(null);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState<"Create" | "Update">("Create");
    const navigate = useNavigate();
    const originalWorkers = useRef<Worker[]>([]);

    const fetch = async () => {
        await getWorkers()
            .then((data: Worker[]) => {
                setWorkers(data);
                originalWorkers.current = data;
            })
            .catch((err: AxiosError) => {
                toast.error("Error al obtener trabajadores", {
                    duration: 5000,
                });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate("/login");
                    return toast.error("La sesión ha expirado");
                }
            });
    };

    useEffect(() => {
        document.title = "Admin - Plan Padrino";
        fetch();
    }, []);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filteredWorkers = useMemo(() => {
        if (workers === null) return [];

        if (search === "") return originalWorkers.current;

        const searchWorkers = workers.filter((worker) =>
            worker.name.toLowerCase().includes(search.toLowerCase())
        );

        return searchWorkers;
    }, [search, workers]);

    if (workers === null) {
        return (
            <div className="stge__home-loader">
                <h1>Cargando...</h1>
                <div></div>
            </div>
        );
    }

    return (
        <main className="stge__admin">
            <div className="stge__admin-wrapper">
                <div className="stge__admin-functions">
                    <input
                        type="search"
                        name="search"
                        autoComplete="off"
                        onChange={onChange}
                    />

                    <button
                        name="create-worker"
                        onClick={() => {
                            setShowModal(true);
                            setWorkerSelected(null);
                            setTypeModal("Create");
                        }}
                    >
                        Crear trabajador
                    </button>
                </div>

                <div className="stge__admin-workers">
                    {filteredWorkers.length !== 0 ? (
                        filteredWorkers.map((worker) => (
                            <WorkerCard
                                key={worker._id}
                                worker={worker}
                                fetch={fetch}
                                setShowModal={setShowModal}
                                setWorkerSelected={setWorkerSelected}
                                setTypeModal={setTypeModal}
                            />
                        ))
                    ) : (
                        <h3>
                            No se ha encontrado ningún trabajador con la
                            búsqueda proporcionada
                        </h3>
                    )}
                </div>
            </div>

            {showModal && (
                <WorkerModal
                    fetch={fetch}
                    setShowModal={setShowModal}
                    workerSelected={workerSelected}
                    type={typeModal}
                />
            )}
        </main>
    );
}
