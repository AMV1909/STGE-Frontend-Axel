/// <reference types="../vite-env.d.ts" />
import axios from "axios";
import { Course } from "../Types/types";

const API_URL = import.meta.env.VITE_API_URL;

export const getTempUserData = async () => {
    return await axios
        .get(`${API_URL}/google/user`, {
            headers: {
                "x-google-access-token": localStorage.getItem("google-token"),
            },
        })
        .then((res) => res.data);
};

// export const login = async (email: string, password: string) => {};

export const googleLogin = async () => {
    return await axios
        .post(`${API_URL}/google/login`, null, {
            headers: {
                "x-google-access-token": localStorage.getItem("google-token"),
            },
        })
        .then((res) => res.data);
};

export const googleRegisterTutor = async (coursesToTeach: Course[]) => {
    return await axios
        .post(
            `${API_URL}/google/register/tutor`,
            { coursesToTeach },
            {
                headers: {
                    "x-google-access-token":
                        localStorage.getItem("google-token"),
                },
            }
        )
        .then((res) => res.data);
};

export const googleRegisterStudent = async () => {
    return await axios
        .post(`${API_URL}/google/register/student`, null, {
            headers: {
                "x-google-access-token": localStorage.getItem("google-token"),
            },
        })
        .then((res) => res.data);
};
