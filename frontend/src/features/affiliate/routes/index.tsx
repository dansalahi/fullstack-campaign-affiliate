import { Route, Routes } from "react-router";
import Affiliate from "./affiliate";
import Campaign from "./campaign";

const AffiliateRoutes = () => {
	return (
		<Routes>
			<Route path="" element={<Campaign />} />
			<Route path=":id" element={<Affiliate />} />
		</Routes>
	);
};

export default AffiliateRoutes;
