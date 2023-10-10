import { useAppDispatch } from "./store";
import { Course, User } from "../Types/types";
import {
    setUserInfo,
    updateCoursesToTeach,
    callPreviousCoursesToTeach,
    logout,
} from "../Store/User/slice";

export const useUserActions = () => {
    const dispatch = useAppDispatch();

    const setUser = (user: User) => {
        dispatch(setUserInfo(user));
    };

    const updateCourses = (courses: Course[]) => {
        dispatch(updateCoursesToTeach(courses));
    };

    const callPreviousCourses = () => {
        dispatch(callPreviousCoursesToTeach());
    };

    const logoutUser = () => {
        dispatch(logout());
    };

    return { setUser, updateCourses, callPreviousCourses, logoutUser };
};
