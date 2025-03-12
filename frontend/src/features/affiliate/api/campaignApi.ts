import axios from "axios";
import api from "../../../api/api";
import { Campaign } from "../../../types";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllCampaigns = async (): Promise<Campaign[]> => {
	const response = await api.get(`/campaigns`);
	return response.data;
};

export const getCampaign = async (id: string): Promise<Campaign> => {
	const response = await api.get(`/campaigns/${id}`);
	return response.data;
};
