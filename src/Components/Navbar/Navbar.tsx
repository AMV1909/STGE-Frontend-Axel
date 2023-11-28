import { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { MdNotificationsActive } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-hot-toast";
import { IoIosArrowDown } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

import { Notifications } from "..";
import { searchTutors } from "../../API/Tutors";
import { getNotifications } from "../../API/Notifications";
import { Notification, PathRoutes, Tutor } from "../../Types/types.d";
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
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [data, setData] = useState({
        type_search: "name",
        search: "",
    });

    const fetchNotifications = async () => {
        await getNotifications()
            .then((notifications: Notification[]) => {
                setNotifications(notifications);
            })
            .catch((err: AxiosError) => {
                toast.error("Error al obtener notificaciones", {
                    duration: 5000,
                });

                if (!err.response)
                    return toast.error(err.message, { duration: 5000 });

                if (err.response.status === 500) {
                    logoutUser();
                    navigate(PathRoutes.Login);
                    return toast.error("La sesión ha expirado");
                }
            });
    };

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

    useEffect(() => {
        if (showNotifications) {
            fetchNotifications();
        }
    }, [showNotifications]);

    if (!loggedRoutes.includes(window.location.pathname as PathRoutes))
        return null;

    return (
        <nav>
            {showNotifications && (
                <Notifications notifications={notifications} />
            )}

            <div className="stge__navbar-links">
                <Link to={PathRoutes.Home} onClick={() => resetTutors()}>
                    <img src={unab_logo} alt="Logo UNAB" />
                </Link>

                {(user.role === "Worker" || user.role === "Admin") && (
                    <Link id="list-tutors" to={PathRoutes.TutorsList}>
                        Listado de Tutores
                    </Link>
                )}

                {user.role === "Admin" && (
                    <Link id="admin" to={PathRoutes.Admin}>
                        Administración
                    </Link>
                )}
            </div>

            <div className="stge__navbar-functions">
                <form id="form" onSubmit={handleSubmit}>
                    <select
                        aria-label="Search Type"
                        name="type_search"
                        onChange={onChange}
                    >
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

                    <button aria-label="Search" type="submit">
                        <BsSearch />
                    </button>
                </form>

                <div>
                    <button
                        id="notifications"
                        aria-label="Notifications"
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setToggle(false);
                        }}
                    >
                        <MdNotificationsActive size={24} />
                    </button>

                    <button
                        id="profile"
                        aria-label="Profile"
                        onClick={() => navigate(PathRoutes.Profile)}
                    >
                        <CgProfile size={24} />
                    </button>

                    <button
                        aria-label="More Options"
                        onClick={() => {
                            setToggle(!toggle);
                            setShowNotifications(false);
                        }}
                    >
                        {toggle ? <IoIosArrowDown /> : <GiHamburgerMenu />}
                    </button>
                </div>
            </div>

            {toggle && (
                <div className="stge__navbar-toggle">
                    <form id="toggle-form" onSubmit={handleSubmit}>
                        <select
                            aria-label="Search Type"
                            name="type_search"
                            onChange={onChange}
                        >
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

                        <button aria-label="Search" type="submit">
                            <BsSearch />
                        </button>
                    </form>

                    <div className="stge__navbar-toggle_buttons">
                        {(user.role === "Worker" || user.role === "Admin") && (
                            <button
                                id="toggle-list-tutors"
                                onClick={() => {
                                    navigate(PathRoutes.TutorsList);
                                    setToggle(false);
                                }}
                            >
                                Listado de Tutores
                            </button>
                        )}

                        {user.role === "Admin" && (
                            <button
                                id="toggle-admin"
                                onClick={() => {
                                    navigate(PathRoutes.Admin);
                                    setToggle(false);
                                }}
                            >
                                Administración
                            </button>
                        )}

                        <button
                            id="toggle-notifications"
                            aria-label="Notifications"
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setToggle(false);
                            }}
                        >
                            <MdNotificationsActive size={24} />
                        </button>

                        <button
                            id="toggle-profile"
                            aria-label="Profile"
                            onClick={() => {
                                navigate(PathRoutes.Profile);
                                setToggle(false);
                            }}
                        >
                            <CgProfile size={24} />
                        </button>

                        <button
                            aria-label="Logout"
                            onClick={() => {
                                logoutUser();
                                setToggle(false);
                                navigate(PathRoutes.Login);
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
