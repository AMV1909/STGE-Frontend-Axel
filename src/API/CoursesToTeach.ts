/// <reference types="../vite-env.d.ts" />
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCoursesToTeach = async () => {
    return await axios
        .get(`${API_URL}/courses-to-teach`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        })
        .then((res) => res.data);
};
