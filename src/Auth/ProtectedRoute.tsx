import { Navigate } from "react-router-dom";

import { useAppSelector } from "../Hooks/store";
import { PathRoutes } from "../Types/types.d";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const user = useAppSelector((state) => state.user);
    const tempUser = useAppSelector((state) => state.tempUser);

    switch (window.location.pathname as PathRoutes) {
        case PathRoutes.Home: {
            if (user._id === "" || user._id === undefined)
                return <Navigate to={PathRoutes.Login} />;
            break;
        }

        case PathRoutes.Login: {
            if (user._id !== "" && user._id !== undefined)
                return <Navigate to={PathRoutes.Home} />;
            break;
        }

        case PathRoutes.Register: {
            if (user._id !== "" && user._id !== undefined)
                return <Navigate to={PathRoutes.Home} />;
            break;
        }

        case PathRoutes.SelectCoursesToTeach: {
            if (tempUser.id === "")
                return <Navigate to={PathRoutes.Register} />;
            break;
        }

        case PathRoutes.TutorsList: {
            if (user.role !== "Worker" && user.role !== "Admin")
                return <Navigate to={PathRoutes.Home} />;
            break;
        }

        case PathRoutes.Admin: {
            if (user.role !== "Admin") return <Navigate to={PathRoutes.Home} />;
            break;
        }

        case PathRoutes.Profile: {
            if (user._id === "" || user._id === undefined)
                return <Navigate to={PathRoutes.Login} />;
            break;
        }

        default:
            break;
    }

    return children;
}
