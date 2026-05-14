import axios from "axios";

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(new Error(error.response?.data?.error || 'An error occurred'))
)