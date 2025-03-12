import React from "react";
import { Link } from "react-router";

const Header = ({ title }: { title: string }) => {
	return (
		<>
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-x-1.5">
					<Link to="../">
						<svg
							className="w-7 h-7 text-gray-800 dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 12h14M5 12l4-4m-4 4 4 4"
							/>
						</svg>
					</Link>
					<h2 className="text-xl">{title}</h2>
				</div>
				<div>
					<button
						type="button"
						className="cursor-pointer py-2.5 px-5 me-2 mb-2 text-sm font-medium text-red-700 focus:outline-none bg-white rounded-full  hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						type="button"
						className="inline-flex items-center gap-x-2 cursor-pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me- mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
					>
						<svg
							className="w-4 h-4 dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 5a1 1 0 0 1 1-1h11.586a1 1 0 0 1 .707.293l2.414 2.414a1 1 0 0 1 .293.707V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Z"
							/>
							<path
								stroke="currentColor"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M8 4h8v4H8V4Zm7 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
						Publish
					</button>
				</div>
			</div>
			<hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
		</>
	);
};

export default Header;
