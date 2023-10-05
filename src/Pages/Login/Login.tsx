import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";

import { useUserActions } from "../../Hooks/useUserActions";
import { SplitTitle } from "../../Components";
import { PathRoutes, User } from "../../Types/types.d";
import { googleLogin } from "../../API/Session";

import "./Login.css";

export function Login() {
    const navigate = useNavigate();
    const { setUser } = useUserActions();
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        document.title = "Login - STGE";
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

    const handleGoogleLogin = async (
        response: Omit<TokenResponse, "credential">
    ) => {
        if (!response) {
            return toast.error("Error al iniciar sesión", { duration: 5000 });
        }

        localStorage.setItem("google-token", response.access_token);

        toast.loading("Iniciando sesión...", { id: "loading", duration: 5000 });

        await googleLogin()
            .then((res: { data: User; token: string }) => {
                toast.dismiss("loading");

                setUser(res.data);
                localStorage.setItem("token", res.token);
                navigate(PathRoutes.Home);

                toast.success("Sesion iniciada con éxito", { duration: 5000 });
            })
            .catch((err) => {
                toast.dismiss("loading");
                toast.error("Error al iniciar sesión", { duration: 5000 });

                if (!err.response) return toast.error(err.message);
                if (err.response.status === 404)
                    toast.error(
                        "No se encontró un usuario registrado con ese correo",
                        {
                            duration: 5000,
                        }
                    );
            });
    };

    const googleLoginHook = useGoogleLogin({
        flow: "implicit",
        scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send",
        onSuccess: handleGoogleLogin,
        onError: () =>
            toast.error("Error al iniciar sesión", {
                duration: 5000,
            }),
    });

    return (
        <main className="stge__login">
            <SplitTitle title="UNAB" />

            <div className="stge__login-container">
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>

                    <div id="google-login-button">
                        <button type="button" onClick={() => googleLoginHook()}>
                            Iniciar Sesión con Google 🚀
                        </button>
                    </div>

                    <span></span>

                    <input
                        type="email"
                        name="email"
                        placeholder="Correo"
                        onChange={onChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        onChange={onChange}
                        required
                    />

                    <button>Iniciar Sesión</button>

                    <Link to={PathRoutes.Register}>Registrarse</Link>
                </form>
            </div>
        </main>
    );
}
