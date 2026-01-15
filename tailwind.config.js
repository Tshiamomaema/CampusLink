/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Twitter Blue
                primary: {
                    50: '#e8f5fd',
                    100: '#d1ebfc',
                    200: '#a3d7f9',
                    300: '#75c3f6',
                    400: '#47aff3',
                    500: '#1d9bf0', // Twitter Blue
                    600: '#1a8cd8',
                    700: '#166cad',
                    800: '#114d82',
                    900: '#0d3d68',
                },
                // Twitter Dark Theme
                twitter: {
                    black: '#000000',
                    darkBg: '#15202b',
                    darkCard: '#192734',
                    dimBg: '#15202b',
                    border: '#38444d',
                    lightBorder: '#2f3336',
                    textGray: '#71767b',
                    textLight: '#e7e9ea',
                }
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
