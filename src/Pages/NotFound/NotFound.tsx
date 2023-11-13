import { useEffect } from "react";
import "./NotFound.css";

export function NotFound() {
    useEffect(() => {
        document.title = "Página no encontrada - STGE";
    }, []);

    return <div>Hola</div>;
}
