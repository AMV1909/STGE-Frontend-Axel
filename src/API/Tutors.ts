/// <reference types="../vite-env.d.ts" />
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getTutors = async () => {
    return await axios
        .get(`${API_URL}/tutors`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        })
        .then((res) => res.data);
};

export const searchTutors = async ({
    type_search,
    search,
}: {
    type_search: string;
    search: string;
}) => {
    return await axios
        .get(`${API_URL}/tutors/search`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
            params: {
                type_search,
                search,
            },
        })
        .then((res) => res.data);
};
