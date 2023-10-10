import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course, User } from "../../Types/types.d";

const initialState: User = {
    _id: "",
    role: "Student",
    name: "",
    email: "",
    picture: "",
    career: "",
    coursesToTeach: [],
    score: 0,
    pga: 0,
    countReviews: 0,
    meetingTime: 0,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (_, action: PayloadAction<User>) => {
            return { ...action.payload };
        },

        updateCoursesToTeach: (state, action: PayloadAction<Course[]>) => {
            localStorage.setItem(
                "previousCoursesToTeach",
                JSON.stringify(state.coursesToTeach)
            );

            return { ...state, coursesToTeach: action.payload };
        },

        callPreviousCoursesToTeach: (state) => {
            return {
                ...state,
                coursesToTeach: JSON.parse(
                    localStorage.getItem("previousCoursesToTeach")!
                ),
            };
        },

        logout: () => {
            localStorage.removeItem("google-token");
            localStorage.removeItem("token");
            localStorage.removeItem("tutors");
            localStorage.removeItem("previousCoursesToTeach");

            return { ...initialState };
        },
    },
});

export default userSlice.reducer;

export const {
    setUserInfo,
    updateCoursesToTeach,
    callPreviousCoursesToTeach,
    logout,
} = userSlice.actions;
