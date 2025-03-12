const Footer = () => {
	return (
		<footer className="px-20 py-5 bg-gray-50">
			<div className="w-full mx-auto max-w-screen-xl flex items-center justify-between">
				<span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
					© 2023 Trademark and other legal information
				</span>
				<button className="cursor-pointer py-2.5 px-5 text-sm text-gray-500 focus:outline-none ">
					<a
						className="flex gap-x-1 items-center "
						href="mailto:contact@relik.com"
					>
						<svg
							className="w-5 h-5 text-gray-500 dark:text-white"
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
								strokeWidth="2"
								d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
							/>
						</svg>
						contact@relik.com
					</a>
				</button>
			</div>
		</footer>
	);
};

export default Footer;
