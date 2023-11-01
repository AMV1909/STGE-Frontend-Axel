/// <reference types="../vite-env.d.ts" />
import axios from "axios";
import { restoreSessionGoogle } from "./RestoreSession";
import { SelectedDates } from "../Types/types.d";

const API_URL = import.meta.env.VITE_API_URL;

export const getEventsByType = async (type: string, role: string) => {
    return await axios
        .get(`${API_URL}/events/${role}/${type}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        })
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.events;
        });
};

export const requestEvent = async (selectedDates: SelectedDates[]) => {
    return await axios
        .post(
            `${API_URL}/events/request`,
            { events: selectedDates },
            {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }
        )
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.message;
        });
};

export const acceptEvent = async (id: string) => {
    await restoreSessionGoogle();

    return await axios
        .put(
            `${API_URL}/events/accept/${id}`,
            {},
            {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "x-google-access-token":
                        localStorage.getItem("google-token"),
                },
            }
        )
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.message;
        });
};

export const rejectEvent = async (id: string) => {
    return await axios
        .put(
            `${API_URL}/events/reject/${id}`,
            {},
            {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }
        )
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.message;
        });
};

export const cancelRequestedEvent = async (id: string) => {
    return await axios
        .put(
            `${API_URL}/events/cancel/requested/${id}`,
            {},
            {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }
        )
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.message;
        });
};

export const cancelScheduledEvent = async (id: string) => {
    await restoreSessionGoogle();

    return await axios
        .put(
            `${API_URL}/events/cancel/scheduled/${id}`,
            {},
            {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "x-google-access-token":
                        localStorage.getItem("google-token"),
                },
            }
        )
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.message;
        });
};

export const completeEvent = async (id: string, score: number | null) => {
    await restoreSessionGoogle();

    return await axios
        .put(
            `${API_URL}/events/complete/${id}`,
            { score },
            {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "x-google-access-token":
                        localStorage.getItem("google-token"),
                },
            }
        )
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.message;
        });
};
