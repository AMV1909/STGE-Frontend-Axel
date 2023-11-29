import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["unab_logo_orange.png", "unab_logo.svg"],
            manifest: {
                short_name: "Plan Padrino",
                name: "Plan Padrino",
                description:
                    "Plan Padrino UNAB, Sistema de Gestión y Seguimiento De Tutorías Estudiantiles En Línea Por Estudiantes Para Estudiantes.",
                start_url: "https://plan-padrino.pages.dev",
                display: "standalone",
                theme_color: "#000000",
                background_color: "#ffffff",
                icons: [
                    {
                        src: "./logo.png",
                        sizes: "32x32",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
});
