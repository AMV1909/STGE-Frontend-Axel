/// <reference types="../vite-env.d.ts" />
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const restoreSession = async () => {
    return await axios
        .get(`${API_URL}/session`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        })
        .then((res) => {
            if (res.status === 229) {
                localStorage.setItem("token", res.data.token);
            }

            return res.data.user;
        });
};

export const restoreSessionGoogle = async () => {
    const googleToken = localStorage.getItem("google-token");

    if (googleToken) {
        const googleTokenExpirationDate = localStorage.getItem(
            "google-token-expiration-date"
        );

        if (googleTokenExpirationDate) {
            const expirationDate = new Date(
                parseInt(googleTokenExpirationDate)
            );

            const now = new Date();

            if (now.getTime() > expirationDate.getTime() - 600000) {
                await axios
                    .get(`${API_URL}/session/google`, {
                        headers: {
                            "x-google-access-token":
                                localStorage.getItem("google-token"),
                        },
                    })
                    .then((res) => {
                        localStorage.setItem("google-token", res.data.token);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }
};
