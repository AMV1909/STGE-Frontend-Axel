import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-hot-toast";

import { ToastDeleteWorker } from "..";
import { Worker } from "../../Types/types.d";

import "./WorkerCard.css";

interface Props {
    worker: Worker;
    setTypeModal: Dispatch<SetStateAction<"Create" | "Update">>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    setWorkerSelected: Dispatch<SetStateAction<Worker | null>>;
    fetch: () => Promise<void>;
}

export function WorkerCard({
    worker,
    setTypeModal,
    setShowModal,
    setWorkerSelected,
    fetch,
}: Props) {
    useEffect(() => {
        const image = new Image();
        image.src = worker.picture;
    }, [worker.picture]);

    const handleEdit = () => {
        setTypeModal("Update");
        setWorkerSelected(worker);
        setShowModal(true);
    };

    const handleDelete = async () => {
        toast(
            (t) => <ToastDeleteWorker t={t} worker={worker} fetch={fetch} />,
            {
                duration: 5000,
            }
        );
    };

    return (
        <div className="stge__workerCard">
            <img src={worker.picture} alt={worker.name} />
            <h3>{worker.name}</h3>

            <div className="stge__workerCard-buttons">
                <button name="edit-worker" onClick={handleEdit}>
                    Editar
                </button>

                <button name="detele-worker" onClick={handleDelete}>
                    Eliminar
                </button>
            </div>
        </div>
    );
}
