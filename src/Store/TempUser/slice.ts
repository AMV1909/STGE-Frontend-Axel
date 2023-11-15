import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TempUser } from "../../Types/types";

const initialState: TempUser = {
    id: "",
    name: "",
    email: "",
    picture: "",
    career: "",
    program_type: "Pregrado",
    active_disciplinary_processes: false,
    pga: 0,
    courses: [],
};

export const tempUserSlice = createSlice({
    name: "tempUser",
    initialState,
    reducers: {
        setTempUserInfo: (_, action: PayloadAction<TempUser>) => {
            return { ...action.payload };
        },

        deleteTempUserInfo: () => {
            return { ...initialState };
        },
    },
});

export default tempUserSlice.reducer;
export const { setTempUserInfo, deleteTempUserInfo } = tempUserSlice.actions;
