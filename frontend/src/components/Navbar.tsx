import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { logout, getCurrentUser } from "../utils/auth";
// import { Menu, X } from "lucide-react";

interface UserData {
	id: string;
	username: string;
	roles?: string[];
}

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [userData, setUserData] = useState<UserData | null>(null);

	useEffect(() => {
		// Get user data from localStorage on component mount
		const user = getCurrentUser();
		if (user && user.user) {
			setUserData(user.user);
		}
	}, []);

	return (
		<nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
			{/* Left Section - Logo */}
			<div className="flex items-center space-x-3">
				<span className="font-bold text-xl">🚀 RELIK</span>
			</div>

			{/* Middle Section - Navigation Links */}
			<ul className="hidden md:flex items-center space-x-6 text-gray-700">
				<li className="cursor-pointer hover:text-black">
					<NavLink to="#">Pages</NavLink>
				</li>
				<li className="cursor-pointer hover:text-black">
					<NavLink to="#">Performance</NavLink>
				</li>
				<li className="cursor-pointer hover:text-black">
					<NavLink to="#"> Products</NavLink>
				</li>
				<li className="cursor-pointer hover:text-black">
					<NavLink to="#"> Campaigns</NavLink>
				</li>
				<li className="cursor-pointer text-black font-semibold">
					<NavLink to="affiliate"> Affiliate</NavLink>
				</li>
				<li>
					<button
						className="cursor-pointer hover:text-red-500 transition-all duration-300"
						onClick={() => logout()}
					>
						Logout
					</button>
				</li>
			</ul>

			{/* Right Section - User Profile & Actions */}
			<div className="flex items-center space-x-4">
				{/* <button className="hidden md:block text-gray-500 hover:text-gray-700">
          Cancel
        </button>
        <button className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-lg">
          Publish
        </button> */}

				{/* User Profile */}
				<div className="flex items-center space-x-2">
					<div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
						<span className="text-gray-500">
							{userData?.username
								? userData.username.substring(0, 2).toUpperCase()
								: "?"}
						</span>
					</div>
					<div>
						<p className="text-sm font-semibold">
							{userData?.username || "Guest"}
						</p>
						<p className="text-xs text-gray-500">
							{userData?.id || "Not logged in"}
						</p>
					</div>
				</div>

				{/* Mobile Menu Button */}
				<button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
					{/* {isOpen ? <X size={24} /> : <Menu size={24} />} */}
				</button>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<ul className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col space-y-4 py-4 px-6 md:hidden">
					<li className="cursor-pointer hover:text-black">Pages</li>
					<li className="cursor-pointer hover:text-black">Performance</li>
					<li className="cursor-pointer hover:text-black">Products</li>
					<li className="cursor-pointer hover:text-black">Campaigns</li>
					<li className="cursor-pointer text-black font-semibold">Affiliate</li>
					<button className="text-gray-500 hover:text-gray-700">Cancel</button>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
						Publish
					</button>
				</ul>
			)}
		</nav>
	);
}
