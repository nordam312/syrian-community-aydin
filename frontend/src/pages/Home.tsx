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

			<section className="section bg-white pt-28 pb-20 ">
				<div className="page-container text-center">
					<h2 className="section-title">
						مرحباً بكم في الجالية السورية في أيدن
					</h2>
					<p className="max-w-2xl mx-auto text-lg text-gray-700 mb-6">
						.نحن هنا لدعم الطلاب في أيدين، وتعزيز التبادل الثقافي، وبناء مجتمع
						قوي ومترابط
					</p>
					<div className="flex justify-center">
						{/* <Link to="/about">
    						<Button className="bg-syria-green-500 hover:bg-syria-green-600">تعرف على المزيد عنا</Button>
            				</Link> */}
						<Link to="/about">
							<Button className="border border-syria-green-900 text-syria-green-900 hover:bg-syria-green-900 hover:text-white">
								تعرف على المزيد عنا
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
