import React, { useMemo } from "react";
import Header from "../components/Header";
import CampaignOverview from "../components/CampaignOverview";
import InfluencersTable from "../components/Influencers";
import { useParams } from "react-router";
import { useGetCampaign } from "../api/useCampaign";
import { Campaign } from "../../../types";

const Coupons = ({ couponsAvailable }: { couponsAvailable: number }) => {
	return (
		<div className="card-wrapper">
			<p>
				{" "}
				Coupons: <span className="font-bold">{couponsAvailable}</span>
			</p>
		</div>
	);
};

const Influencers = ({ campaign }: { campaign: Campaign }) => {
	return (
		<div className="card-wrapper">
			<p className="mb-2">
				Influencers: <span className="font-bold">100</span>{" "}
			</p>

			<div className="flex gap-x-2 gap-y-2.5 flex-wrap">
				<div className="badge">
					{" "}
					<span>{campaign.countries?.join(", ") || ""}</span>
				</div>
				<div className="badge">
					{" "}
					<span>
						{" "}
						followers {`<`} <span>500K</span>{" "}
					</span>
				</div>
				<div className="badge">
					<span> Status:</span> <span>Verified</span>
				</div>
			</div>
		</div>
	);
};

const Affiliate = () => {
	const { id } = useParams<{ id: string }>();

	const { data: campaign, isFetching, isLoading, isError } = useGetCampaign(id);

	if (isLoading || isFetching)
		return <p className="text-blue-600">Loading campaign...</p>;

	if (isError) return <p className="text-red-600">Failed to load campaign.</p>;
	if (!campaign) return null;

	return (
		<>
			<Header title={campaign.name} />
			<div className="py-6">
				<div className="flex gap-x-6 mb-6">
					<div className="w-8/12">
						<CampaignOverview campaign={campaign} />
					</div>
					<div className="w-4/12 flex flex-col gap-y-6 ">
						<div>
							<h2 className="mb-3 font-semibold">Coupons</h2>
							<Coupons couponsAvailable={campaign.couponsAvailable} />
						</div>
						<div>
							<h2 className="mb-3 font-semibold">Influencers</h2>
							<Influencers campaign={campaign} />
						</div>
					</div>
				</div>
				<InfluencersTable influencers={campaign.influencers} />
			</div>
		</>
	);
};
export default Affiliate;
