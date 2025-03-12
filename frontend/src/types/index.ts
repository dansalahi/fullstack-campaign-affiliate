export type Influencer = {
	_id: string;
	name: string;
	country: string;
	followers: number;
	status: "active" | "inactive"; // assuming these are the only statuses
	baseCost: number;
	avatar: string;
	createdAt: string;
	updatedAt: string;
	campaignInfluencerId: string;
	cost: number;
	assignedCoupons: number;
};

export type Campaign = {
	_id: string;
	name: string;
	type: string;
	brandUrl: string;
	countries: string[];
	startDate: string;
	endDate: string;
	discountValue: number;
	couponsAvailable: number;
	createdAt: string;
	updatedAt: string;
	influencers: Influencer[];
};
