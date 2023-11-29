import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "favicon.ico",
                "robots.txt",
                "sitemap.xml",
                "plan_padrino.jpg",
                "unab_logo_black.svg",
            ],
            manifest: {
                short_name: "Plan Padrino UNAB",
                name: "Plan Padrino UNAB",
                description:
                    "Plan Padrino UNAB, Sistema de Gestión y Seguimiento De Tutorías Estudiantiles En Línea Por Estudiantes Para Estudiantes.",
                start_url: "https://plan-padrino.pages.dev",
                display: "fullscreen",
                theme_color: "#000000",
                background_color: "#ffffff",
                screenshots: [
                    {
                        src: "https://plan-padrino.pages.dev/plan_padrino.jpg",
                        sizes: "1600x900",
                        type: "image/jpg",
                    },
                ],
                icons: [
                    {
                        src: "https://plan-padrino.pages.dev/unab_logo_black.svg",
                        sizes: "32x32",
                        type: "image/svg+xml",
                    },
                    {
                        src: "https://plan-padrino.pages.dev/unab_logo_black.svg",
                        sizes: "192x192",
                        type: "image/svg+xml",
                    },
                    {
                        src: "https://plan-padrino.pages.dev/unab_logo_black.svg",
                        sizes: "512x512",
                        type: "image/svg+xml",
                    },
                    {
                        src: "https://plan-padrino.pages.dev/unab_logo_black.svg",
                        sizes: "512x512",
                        type: "image/svg+xml",
                        purpose: "any maskable",
                    },
                ],
            },
        }),
    ],
});
