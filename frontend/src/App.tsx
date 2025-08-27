import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import GpaCalculator from './pages/GpaCalculator';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import EventPage from './components/event/eventPage';
import ElectionsPage from './pages/ElectionsPage'
const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/gpa-calculator" element={<GpaCalculator />} />
					<Route path="/admin" element={<Admin />} />
					<Route path="/auth" element={<Auth />} />
					<Route path="/elections" element={<ElectionsPage />} />
					<Route path="*" element={<NotFound />} />
					<Route path="/events/:id" element={<EventPage />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
