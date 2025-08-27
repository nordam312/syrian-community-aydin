import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ContentItem } from '@/pages/Home';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '@/config';
interface LayoutProps {
	children: ReactNode;

}


const Layout = ({ children }: LayoutProps) => {
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
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<main className="flex-grow">{children}</main>
			<Footer content={content} />
		</div>
	);
};

export default Layout;
