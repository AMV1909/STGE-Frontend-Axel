/// <reference types="../vite-env.d.ts" />
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface SelectedDates {
    title: string;
    description: string;
    attendees: [];
    start: Date;
    end: Date;
}

export const updateAvailableSchedule = async (
    selectedDates: SelectedDates[]
) => {
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
        .then((res) => res.data);
};
