import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            keyframes: {
                bspin: {
                    "0%": { transform: "rotate3d(0, 1, 0, 0deg)" },
                    "100%": { transform: "rotate3d(0, 1, 0, 360deg)" },
                },
            },
            animation: {
                bspin: "bspin 0.8s ease-in-out",
            },
            animationDelay: {
                0: "0ms",
                300: "300ms",
                600: "600ms",
                900: "900ms",
                1200: "1200ms",
                1500: "1500ms",
            }
        },
    },
    plugins: [
        require("tailwindcss-animation-delay"),
    ],
};
export default config;
