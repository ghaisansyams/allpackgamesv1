import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    // No custom web font is loaded: the booth runs on a LAN with no internet access, so the
    // theme relies on the OS's bundled system sans-serif stack (Tailwind's default `font-sans`).
    theme: {
        extend: {},
    },

    plugins: [forms],
};
