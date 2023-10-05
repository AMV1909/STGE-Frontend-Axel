import { Dispatch, SetStateAction, useEffect } from "react";

import { useUserActions } from "../../Hooks/useUserActions";
import { User } from "../../Types/types.d";
import { restoreSession } from "../../API/User";

import "./PageLoader.css";

export function PageLoader({
    setLoading,
}: {
    setLoading: Dispatch<SetStateAction<boolean>>;
}) {
    const { setUser } = useUserActions();

    useEffect(() => {
        if (!localStorage.getItem("token")) return setLoading(false);

        restoreSession()
            .then((user: User) => {
                setUser(user);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setLoading(false);
            });
    }, [setLoading, setUser]);

    return (
        <main className="stge__pageLoader">
            <h1>Cargando...</h1>
            <div></div>
        </main>
    );
}
