import { useQuery } from "@tanstack/react-query";
import { getAllCampaigns, getCampaign } from "./campaignApi";
import { Campaign } from "../../../types";

export const useGetAllCampaigns = () => {
  return useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: getAllCampaigns,
  });
};

export const useGetCampaign = (campaignId?: string) => {
  return useQuery<Campaign>({
    queryKey: ["campaign", campaignId],
    queryFn: () => getCampaign(campaignId!),
    enabled: !!campaignId,
  });
};
