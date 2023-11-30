import { lazy } from "react";

const routes = {
    Home: lazy(() =>
        import("./Home/Home").then(({ Home }) => ({ default: Home }))
    ),
    Login: lazy(() =>
        import("./Login/Login").then(({ Login }) => ({ default: Login }))
    ),
    Register: lazy(() =>
        import("./Register/Register").then(({ Register }) => ({
            default: Register,
        }))
    ),
    SelectCoursesToTeach: lazy(() =>
        import("./SelectCoursesToTeach/SelectCoursesToTeach").then(
            ({ SelectCoursesToTeach }) => ({ default: SelectCoursesToTeach })
        )
    ),
    Profile: lazy(() =>
        import("./Profile/Profile").then(({ Profile }) => ({
            default: Profile,
        }))
    ),
    ListTutors: lazy(() =>
        import("./ListTutors/ListTutors").then(({ ListTutors }) => ({
            default: ListTutors,
        }))
    ),
    Admin: lazy(() =>
        import("./Admin/Admin").then(({ Admin }) => ({ default: Admin }))
    ),
    NotFound: lazy(() =>
        import("./NotFound/NotFound").then(({ NotFound }) => ({
            default: NotFound,
        }))
    ),
};

export const Home = routes.Home;
export const Login = routes.Login;
export const Register = routes.Register;
export const SelectCoursesToTeach = routes.SelectCoursesToTeach;
export const Profile = routes.Profile;
export const ListTutors = routes.ListTutors;
export const Admin = routes.Admin;
export const NotFound = routes.NotFound;
