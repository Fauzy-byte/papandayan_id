import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                navy: {
                    50: '#f0f4fa',
                    100: '#dce5f4',
                    200: '#bcd0ec',
                    300: '#90b2e0',
                    400: '#5c8ed0',
                    500: '#3870be',
                    600: '#2358aa',
                    700: '#1b468a',
                    800: '#173a72',
                    900: '#0f2252', // Biru Dongker Papandayan
                    950: '#0a1638', // Midnight Deep Navy
                },
                brand: {
                    navy: '#0f2252',
                    navyDark: '#0a1638',
                    navyLight: '#1b468a',
                    gold: '#f59e0b',
                    goldHover: '#d97706',
                    yellow: '#fbbf24',
                }
            },
        },
    },

    plugins: [forms],
};
