import { Link } from 'react-router-dom';
import { ContentItem } from '@/pages/Home';
import { useEffect, useState } from 'react';

interface FooterProps {
	content: ContentItem | null;
}
// عم اجبرو يسوي الفوتر Functional Component
const Footer: React.FC<FooterProps> = ({ content }) => {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="bg-syria-green-50 text-gray-700 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0" dir="rtl">
						<h2 className="text-syria-green-700 font-bold text-lg mb-2">
							{content?.about_title || 'Syrian Community in Aydın'}
						</h2>
						<p className="text-sm whitespace-pre-line">
							{content?.about_content ||
								'Supporting and connecting Syrians in Aydın, Turkey'}
						</p>
					</div>

					<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
						{/* <div>
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
						</div> */}

						<div dir="rtl">
							<h3 className="font-semibold text-syria-green-600 mb-2">
								تواصل معنا
							</h3>
							<ul className="space-y-2 text-sm">
								<li>
									البريد الإلكتروني:{' '}
									{content?.contact_email || 'contact@syrianaydin.com'}
								</li>
								<li>الموقع: {content?.contact_address || 'أيدن، تركيا'}</li>
								<li>الهاتف: {content?.contact_phone || 'N/A'}</li>
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
