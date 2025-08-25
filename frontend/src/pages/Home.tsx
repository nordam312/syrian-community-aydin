import Layout from '@/components/layout/Layout';
import Logo from '@/components/home/Logo';
import Banner from '@/components/home/Banner';
import EventGallery from '@/components/home/EventGallery';
import CommunityRoles from '@/components/home/CommunityRoles';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<Layout>
			<Banner />
			<Logo />

			<section className="section bg-white pt-20">
				<div className="page-container text-center">
					<h2 className="section-title">
						Welcome to the Syrian Community in Aydın
					</h2>
					<p className="max-w-2xl mx-auto text-lg text-gray-700 mb-6">
						We are dedicated to supporting Syrian students and families in
						Aydın, promoting cultural exchange, and building a strong and
						connected community.
					</p>
					<div className="flex justify-center">
						<Link to="/about">
							<Button className="bg-syria-green-500 hover:bg-syria-green-600">
								Learn More About Us
							</Button>
						</Link>
					</div>
				</div>
			</section>

			<EventGallery />
			<CommunityRoles />
		</Layout>
	);
};

export default Home;
