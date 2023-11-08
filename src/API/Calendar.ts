/// <reference types="../vite-env.d.ts" />
import axios from "axios";
import { restoreSessionGoogle } from "./RestoreSession";
import { SelectedDates } from "../Types/types.d";

const API_URL = import.meta.env.VITE_API_URL;

export const getAvailableSchedule = async (
    calendarId: string,
    tutorId?: string
) => {
    await restoreSessionGoogle();

    return await axios
        .get(`${API_URL}/calendar/available/${calendarId}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "x-google-access-token": localStorage.getItem("google-token"),
            },
            params: {
                tutorId,
            },
        })
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.events;
        });
};

export const updateAvailableSchedule = async (
    selectedDates: SelectedDates[]
) => {
    await restoreSessionGoogle();

    return await axios
        .put(
            `${API_URL}/calendar/available`,
            { events: selectedDates },
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

            return res.data;
        });
};
