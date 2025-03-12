import api from "../../../api/api";
const API_URL = import.meta.env.VITE_API_URL;

export const signUp = async (data: {
	username: string;
	email: string;
	password: string;
}) => {
	const response = await api.post(`/auth/register`, data);
	return response.data;
};

export const signIn = async (data: { username: string; password: string }) => {
	const response = await api.post(`/auth/login`, data);
	return response.data;
};
