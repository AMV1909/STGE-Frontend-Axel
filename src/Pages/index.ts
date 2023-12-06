// export { Home } from "./Home/Home";
// export { Login } from "./Login/Login";
// export { Register } from "./Register/Register";
// export { SelectCoursesToTeach } from "./SelectCoursesToTeach/SelectCoursesToTeach";
// export { Profile } from "./Profile/Profile";
// export { ListTutors } from "./ListTutors/ListTutors";
// export { Admin } from "./Admin/Admin";
// export { NotFound } from "./NotFound/NotFound";

import { lazy } from "react";

export const Home = lazy(() =>
    import("./Home/Home").then(({ Home }) => ({ default: Home }))
);

export const Login = lazy(() =>
    import("./Login/Login").then(({ Login }) => ({ default: Login }))
);

export const Register = lazy(() =>
    import("./Register/Register").then(({ Register }) => ({
        default: Register,
    }))
);

export const SelectCoursesToTeach = lazy(() =>
    import("./SelectCoursesToTeach/SelectCoursesToTeach").then(
        ({ SelectCoursesToTeach }) => ({ default: SelectCoursesToTeach })
    )
);

export const Profile = lazy(() =>
    import("./Profile/Profile").then(({ Profile }) => ({ default: Profile }))
);
export const ListTutors = lazy(() =>
    import("./ListTutors/ListTutors").then(({ ListTutors }) => ({
        default: ListTutors,
    }))
);
export const Admin = lazy(() =>
    import("./Admin/Admin").then(({ Admin }) => ({ default: Admin }))
);
export const NotFound = lazy(() =>
    import("./NotFound/NotFound").then(({ NotFound }) => ({
        default: NotFound,
    }))
);
