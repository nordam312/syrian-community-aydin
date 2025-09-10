import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
// import MaintenanceChecker from '@/components/MaintenanceChecker';
import { AuthProvider } from '@/contexts/AuthContext';

// Lazy load all pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const GpaCalculator = lazy(() => import('./pages/GpaCalculator'));
const Admin = lazy(() => import('./pages/Admin'));
const Auth = lazy(() => import('./pages/Auth'));
const NotFound = lazy(() => import('./pages/NotFound'));
const EventPage = lazy(() => import('./components/event/eventPage'));
const ElectionsPage = lazy(() => import('./pages/ElectionsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const Developer = lazy(() => import('./pages/Developer'));

const queryClient = new QueryClient();

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syria-green"></div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* <MaintenanceChecker> */}
        <AuthProvider> {/* 🔥 ضع AuthProvider هنا */}
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/gpa-calculator" element={<GpaCalculator />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/verify-email/:token" element={<Auth />} />
                <Route path="/elections" element={<ElectionsPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/developer" element={<Developer />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider> {/* 🔥 أغلق AuthProvider هنا */}
        {/* </MaintenanceChecker> */}
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;