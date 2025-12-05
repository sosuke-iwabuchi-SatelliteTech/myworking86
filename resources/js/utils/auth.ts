import { UserProfile } from "../types";

export const loginUser = async (id: string, name?: string, grade?: number): Promise<UserProfile> => {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': decodeURIComponent(csrfToken || ''),
        },
        body: JSON.stringify({ id, name, grade }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    return data.user;
};
