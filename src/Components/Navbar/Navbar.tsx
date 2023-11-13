import { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-hot-toast";
import { IoIosArrowDown } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

import { searchTutors } from "../../API/Tutors";
import { PathRoutes, Tutor } from "../../Types/types.d";
import { useAppSelector } from "../../Hooks/store";
import { useUserActions } from "../../Hooks/useUserActions";
import { useTutorsActions } from "../../Hooks/useTutorsActions";
import unab_logo from "../../Assets/unab_logo.svg";

import "./Navbar.css";

const loggedRoutes = [
    PathRoutes.Admin,
    PathRoutes.Home,
    PathRoutes.Profile,
    PathRoutes.TutorsList,
];

export function Navbar() {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user);
    const { logoutUser } = useUserActions();
    const { setSearchingTutors, resetTutors } = useTutorsActions();
    const [toggle, setToggle] = useState(false);
    const [data, setData] = useState({
        type_search: "name",
        search: "",
    });

    const onChange = (e: FormEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.currentTarget.name]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.search === "") return;

        navigate(PathRoutes.Home);

        await searchTutors(data)
            .then((tutors: Tutor[]) => {
                setSearchingTutors(tutors);
            })
            .catch((err: AxiosError) => {
                toast.error("Error al buscar tutores", { duration: 5000 });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });
    };

    if (!loggedRoutes.includes(window.location.pathname as PathRoutes))
        return null;

    return (
        <nav>
            <div className="stge__navbar-links">
                <Link to={PathRoutes.Home} onClick={() => resetTutors()}>
                    <img src={unab_logo} alt="Logo UNAB" />
                </Link>

                {(user.role === "Worker" || user.role === "Admin") && (
                    <Link to={PathRoutes.TutorsList}>Listado de Tutores</Link>
                )}

                {user.role === "Admin" && (
                    <Link to={PathRoutes.Admin}>Administración</Link>
                )}
            </div>

            <div className="stge__navbar-functions">
                <form onSubmit={handleSubmit}>
                    <select name="type_search" onChange={onChange}>
                        <option value="name">Nombre</option>
                        <option value="course">Curso</option>
                    </select>

                    <input
                        type="search"
                        name="search"
                        placeholder={`Buscar por ${
                            data.type_search === "name" ? "nombre" : "curso"
                        }`}
                        onChange={onChange}
                    />

                    <button type="submit">
                        <BsSearch />
                    </button>
                </form>

                <div>
                    <button>
                        <IoNotifications size={24} />
                    </button>

                    <button onClick={() => navigate(PathRoutes.Profile)}>
                        <CgProfile size={24} />
                    </button>

                    <button onClick={() => setToggle(!toggle)}>
                        {toggle ? <IoIosArrowDown /> : <GiHamburgerMenu />}
                    </button>
                </div>
            </div>

            {toggle && (
                <div className="stge__navbar-toggle">
                    <button
                        onClick={() => {
                            logoutUser();
                            setToggle(false);
                            navigate(PathRoutes.Login);
                        }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </nav>
    );
}
