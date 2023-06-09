import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],

        server: {
            proxy: {
                '/api': env.VITE_APP_URL,
            },
        },
    };
};
