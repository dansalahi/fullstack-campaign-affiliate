import { Link } from "react-router";
import { Campaign } from "../../../types";
import { formatDate } from "../../../utils/formatter";

const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
	return (
		<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
			<Link to={campaign._id}>
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{campaign.name}
				</h5>
			</Link>
			<div className="flex justify-between">
				<strong>Start Date:</strong>
				<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
					{formatDate(campaign.startDate)}
				</p>
			</div>
			<div className="flex justify-between">
				<strong>End Date:</strong>
				<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
					{formatDate(campaign.endDate)}
				</p>
			</div>
			<Link
				to={campaign._id}
				className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				View Campaign
				<svg
					className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 14 10"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M1 5h12m0 0L9 1m4 4L9 9"
					/>
				</svg>
			</Link>
		</div>
	);
};

export default CampaignCard;
