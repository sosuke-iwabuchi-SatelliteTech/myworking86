/// <reference types="vite/client" />
/// <reference types="@inertiajs/react" />

import axios from 'axios';

declare global {
    interface Window {
        axios: typeof axios;
    }
    const __BUILD_VERSION__: string;
}
