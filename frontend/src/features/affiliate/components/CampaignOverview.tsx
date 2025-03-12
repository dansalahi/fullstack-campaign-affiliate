import React from "react";
import { Campaign } from "../../../types";
import { formatDate } from "../../../utils/formatter";

const CampaignOverview = ({ campaign }: { campaign: Campaign }) => {
	return (
		<div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-lg sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
			<form className="space-y-6">
				<h5 className="text-xl font-medium text-gray-900 dark:text-white">
					Campaign overview
				</h5>
				<div className="grid grid-cols-2 grid-rows-4 gap-x-4 gap-y-3">
					<div>
						<input
							type="text"
							name="campaignType"
							id="campaignType"
							className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
							value={campaign.type}
							readOnly
						/>
						<label
							htmlFor="campaignType"
							className="block mt-1 text-sm font-medium text-gray-900 dark:text-white"
						>
							Campaign Type
						</label>
					</div>
					<div>
						<input
							type="text"
							name="CampaignRegion"
							id="CampaignRegion"
							className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
							value={campaign.countries}
							readOnly
						/>
						<label
							htmlFor="CampaignRegion"
							className="block mt-1 text-sm font-medium text-gray-900 dark:text-white"
						>
							Campaig region or country
						</label>
					</div>
					<div>
						<input
							type="text"
							name="startDate"
							id="startDate"
							className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
							value={formatDate(campaign.startDate)}
							readOnly
						/>
						<label
							htmlFor="startDate"
							className="block mt-1 text-sm font-medium text-gray-900 dark:text-white"
						>
							Starts
						</label>
					</div>
					<div>
						<input
							type="text"
							name="endDate"
							id="endDate"
							className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
							value={formatDate(campaign.endDate)}
							readOnly
						/>
						<label
							htmlFor="endDate"
							className="block mt-1 text-sm font-medium text-gray-900 dark:text-white"
						>
							Ends
						</label>
					</div>
					<div>
						<input
							type="text"
							name="title"
							id="title"
							className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
							value={campaign.name}
							readOnly
						/>
						<label
							htmlFor="title"
							className="block mt-1 text-sm font-medium text-gray-900 dark:text-white"
						>
							Title
						</label>
					</div>
					<div>
						<input
							type="text"
							name="link"
							id="link"
							className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
							value={campaign.brandUrl}
							readOnly
						/>
						<label
							htmlFor="link"
							className="block mt-1 text-sm font-medium text-gray-900 dark:text-white"
						>
							Link
						</label>
					</div>
					<div>
						<input
							type="text"
							name="discountValue"
							id="discountValue"
							className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
							value={campaign.discountValue}
							readOnly
						/>
						<label
							htmlFor="discountValue"
							className="block mt-1 text-sm font-medium text-gray-900 dark:text-white"
						>
							% of referral rewards
						</label>
					</div>
					<div>
						<input
							type="text"
							name="assignedCoupons"
							id="assignedCoupons"
							className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
							value={"Random"}
							readOnly
						/>
						<label
							htmlFor="assignedCoupons"
							className="block mt-1 text-sm font-medium text-gray-900 dark:text-white"
						>
							Assigned Coupons
						</label>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CampaignOverview;
