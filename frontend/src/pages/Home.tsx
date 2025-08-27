import Layout from '@/components/layout/Layout';
import Logo from '@/components/home/Logo';
import Banner from '@/components/home/Banner';
import EventGallery from '@/components/home/EventGallery';
import CommunityRoles from '@/components/home/CommunityRoles';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '@/config';

export interface ContentItem {
	id: number;
	home_title: string;
	home_description: string;
	about_title: string;
	about_content: string;
	contact_email: string;
	contact_phone: string;
	contact_address: string;
	social_facebook: string;
	social_instagram: string;
	social_telegram: string;
	created_at: string;
	updated_at: string;
}

const Home = () => {
	const [content, setContent] = useState<ContentItem>(null);
	const [isLoading, setIsLoading] = useState(true);

	const GetContent = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(`${API_URL}/content`);
			setContent(response.data);

			// console.log(response.data);
		} catch (error) {
			console.error('Error fetching banners:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);
	useEffect(() => {
		GetContent();
	}, [GetContent]);

	return (
		<Layout >
			<Banner content={content} />
			<Logo />

			<section className="section bg-white pt-28 pb-20 ">
				<div className="page-container text-center">
					<p className="max-w-2xl mx-auto text-lg text-gray-700 mb-6 whitespace-pre-line">
						{content?.home_description || (
							<span className="animate-pulse bg-white/40 rounded px-6 py-2">
								......
							</span>
						)}
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
			{/* <CommunityRoles /> */}
		</Layout>
	);
};

export default Home;
