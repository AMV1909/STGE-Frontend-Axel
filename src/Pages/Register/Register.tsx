import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";

import { ToastRole } from "../../Components";
import { SplitTitle } from "../../Components";
import { PathRoutes } from "../../Types/types.d";

import "./Register.css";

export function Register() {
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        document.title = "Registro - STGE";
    }, []);

    const onChange = (e: FormEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.currentTarget.name]: e.currentTarget.value,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handleGoogleRegister = async (
        response: Omit<TokenResponse, "credential">
    ) => {
        if (!response) {
            return toast.error("Error al registrarse", { duration: 5000 });
        }

        localStorage.setItem("google-token", response.access_token);

        toast((t) => <ToastRole t={t} />, {
            duration: Infinity,
        });
    };

    const googleRegisterHook = useGoogleLogin({
        flow: "implicit",
        scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send",
        onSuccess: handleGoogleRegister,
        onError: () =>
            toast.error("Error al registrarse", {
                duration: 5000,
            }),
    });

    return (
        <main className="stge__register">
            <div className="stge__register-container">
                <form onSubmit={handleSubmit}>
                    <h1>Registro</h1>

                    <div id="google-register-button">
                        <button
                            type="button"
                            onClick={() => googleRegisterHook()}
                        >
                            Registrarse con Google 🚀
                        </button>
                    </div>

                    <span></span>

                    <input
                        type="email"
                        name="email"
                        placeholder="Correo"
                        onChange={onChange}
                        disabled
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        onChange={onChange}
                        disabled
                    />

                    <button type="button" disabled>
                        Registrarse
                    </button>

                    <Link to={PathRoutes.Login}>Iniciar Sesión</Link>
                </form>
            </div>

            <SplitTitle title="UNAB" />
        </main>
    );
}
