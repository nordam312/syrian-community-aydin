import { Link } from 'react-router-dom';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-syria-green-50 text-gray-700 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<h2 className="text-syria-green-700 font-bold text-lg mb-2">
							Syrian Community in Aydın
						</h2>
						<p className="text-sm">
							Supporting and connecting Syrians in Aydın, Turkey
						</p>
					</div>

					<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
						<div>
							<h3 className="font-semibold text-syria-green-600 mb-2">
								Quick Links
							</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<Link
										to="/"
										className="hover:text-syria-green-600 transition-colors"
									>
										Home
									</Link>
								</li>
								<li>
									<Link
										to="/about"
										className="hover:text-syria-green-600 transition-colors"
									>
										About Us
									</Link>
								</li>
								<li>
									<Link
										to="/gpa-calculator"
										className="hover:text-syria-green-600 transition-colors"
									>
										GPA Calculator
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold text-syria-green-600 mb-2">
								Contact
							</h3>
							<ul className="space-y-2 text-sm">
								<li>Email: contact@syrianaydin.com</li>
								<li>Location: Aydın, Turkey</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="border-t border-syria-green-200 mt-6 pt-6 text-center text-sm">
					<p>
						&copy; {currentYear} Syrian Community in Aydın. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
