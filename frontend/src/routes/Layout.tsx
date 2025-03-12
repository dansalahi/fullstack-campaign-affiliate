import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/Footer";

const Layout = () => {
	return (
		<>
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<main className=" px-20 py-10">
					<Outlet />
				</main>
			</div>
			<Footer />
		</>
	);
};

export default Layout;
