import { UserProfile } from "../types";
import axios from 'axios';

export const loginUser = async (id: string, name?: string, grade?: number): Promise<UserProfile> => {
    const response = await axios.post('/login', { id, name, grade });
    return response.data.user;
};
