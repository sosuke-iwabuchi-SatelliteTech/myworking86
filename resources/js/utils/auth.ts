import { UserProfile } from "../types";

export const loginUser = async (id: string, name?: string, grade?: number): Promise<UserProfile> => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ id, name, grade }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    return data.user;
};
