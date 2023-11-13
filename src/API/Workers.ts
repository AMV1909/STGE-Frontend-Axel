/// <reference types="../vite-env.d.ts" />
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getWorkers = async () => {
    return await axios
        .get(`${API_URL}/workers`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        })
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.workers;
        });
};

export const createWorker = async ({
    name,
    email,
    picture,
}: {
    name: string;
    email: string;
    picture: File | null;
}) => {
    return await axios
        .post(
            `${API_URL}/workers`,
            {
                name,
                email,
                picture,
            },
            {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.worker;
        });
};

export const updateWorker = async ({
    id,
    name,
    email,
    picture,
}: {
    id: string;
    name: string;
    email: string;
    picture: File | null;
}) => {
    return await axios
        .put(
            `${API_URL}/workers/${id}`,
            {
                name,
                email,
                picture,
            },
            {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.worker;
        });
};

export const deleteWorker = async (id: string) => {
    return await axios
        .delete(`${API_URL}/workers/${id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        })
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.worker;
        });
};
