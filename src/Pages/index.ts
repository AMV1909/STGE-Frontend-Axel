import { lazy } from "react";

const pages = {
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

export const Home = pages.Home;
export const Login = pages.Login;
export const Register = pages.Register;
export const SelectCoursesToTeach = pages.SelectCoursesToTeach;
export const Profile = pages.Profile;
export const ListTutors = pages.ListTutors;
export const Admin = pages.Admin;
export const NotFound = pages.NotFound;
