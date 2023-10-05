import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User/slice";
import tempUserReducer from "./TempUser/slice";
import tutorsReducer from "./Tutors/slice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        tempUser: tempUserReducer,
        tutors: tutorsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
