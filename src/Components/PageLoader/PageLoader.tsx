import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect } from "react";
import toast from "react-hot-toast";

import { useUserActions } from "../../Hooks/useUserActions";
import { restoreSession } from "../../API/RestoreSession";
import { User } from "../../Types/types.d";

import "./PageLoader.css";

export function PageLoader({
    setLoading,
}: {
    setLoading?: Dispatch<SetStateAction<boolean>>;
}) {
    const { setUser, logoutUser } = useUserActions();

    useEffect(() => {
        if (!setLoading) return;
        if (!localStorage.getItem("token")) return setLoading(false);

        restoreSession()
            .then((user: User) => {
                setUser(user);
                setLoading(false);
            })
            .catch((err: AxiosError) => {
                setLoading(false);

                if (err.response && err.response.status === 500) {
                    logoutUser();
                    return toast.error("La sesión ha expirado");
                }
            });
    }, [setLoading, setUser]);

    return (
        <main className="stge__pageLoader">
            <h1>Cargando...</h1>
            <div></div>
        </main>
    );
}
