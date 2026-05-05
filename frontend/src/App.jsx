import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BannerProvider } from './context/BannerContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import SessionWarning from './components/SessionWarning';
import { useAuth } from './context/AuthContext';
import { sessionManager } from './services/api';

// Eagerly loaded — always needed on first paint
import SupplementsFeed from './pages/SupplementsFeed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

// Lazy-loaded routes — only downloaded when navigated to
const SearchableSupplementList = lazy(() => import('./components/SearchableSupplementList'));
const SupplementDetailPage     = lazy(() => import('./pages/SupplementDetailPage'));
const ReviewPage                = lazy(() => import('./pages/ReviewPage'));
const Logout                    = lazy(() => import('./pages/Logout'));
const Contact                   = lazy(() => import('./pages/Contact'));
const ForgotPassword            = lazy(() => import('./pages/ForgotPassword'));
const ResetPasswordConfirm      = lazy(() => import('./pages/ResetPasswordConfirm'));
const EmailVerification         = lazy(() => import('./pages/EmailVerification'));
const AccountsPage              = lazy(() => import('./pages/AccountsPage'));
const UserProfilePage           = lazy(() => import('./pages/UserProfilePage'));
const AboutPage                 = lazy(() => import('./pages/AboutPage'));
const TermsPage                 = lazy(() => import('./pages/TermsPage'));
const PrivacyPage               = lazy(() => import('./pages/PrivacyPage'));
const UploadCSV                 = lazy(() => import('./components/UploadCSV'));
const UploadBrands              = lazy(() => import('./pages/UploadBrands'));
const AdminDashboard            = lazy(() => import('./pages/AdminDashboard'));
const TopRatedPage              = lazy(() => import('./pages/TopRatedPage'));
const ConditionPage             = lazy(() => import('./pages/ConditionPage'));
const ComparisonPage            = lazy(() => import('./pages/ComparisonPage'));
const FixMePage                 = lazy(() => import('./pages/FixMePage'));

const SHOW_FIX_ME = import.meta.env.VITE_FEATURE_FIX_ME === 'true';

function PageFallback() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
            <CircularProgress />
        </Box>
    );
}

function App() {
    const { isAuthenticated } = useAuth();
    const [sessionWarningOpen, setSessionWarningOpen] = useState(false);
    const [sessionTimeRemaining] = useState(120);

    useEffect(() => {
        if (!isAuthenticated) return;
        const originalShowWarning = sessionManager.showSessionWarning;
        sessionManager.showSessionWarning = () => setSessionWarningOpen(true);
        const originalHandleExpired = sessionManager.handleSessionExpired;
        sessionManager.handleSessionExpired = () => {
            setSessionWarningOpen(false);
            originalHandleExpired();
        };
        return () => {
            sessionManager.showSessionWarning = originalShowWarning;
            sessionManager.handleSessionExpired = originalHandleExpired;
        };
    }, [isAuthenticated]);

    const handleExtendSession = async () => {
        try {
            await sessionManager.refreshToken();
            setSessionWarningOpen(false);
        } catch {}
    };

    return (
        <BannerProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false}
                        newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    <Toaster position="top-center" />
                    <SessionWarning
                        open={sessionWarningOpen}
                        onExtend={handleExtendSession}
                        onLogout={() => { setSessionWarningOpen(false); sessionManager.handleSessionExpired(); }}
                        timeRemaining={sessionTimeRemaining}
                    />
                    <Box sx={{ flex: 1 }}>
                        <ErrorBoundary>
                        <Suspense fallback={<PageFallback />}>
                            <Routes>
                                <Route path="/" element={<Navigate to="/feed" replace />} />
                                <Route path="/feed" element={<SupplementsFeed />} />
                                <Route path="/supplements" element={<SearchableSupplementList />} />
                                <Route path="/supplements/:id" element={<SupplementDetailPage />} />
                                <Route path="/reviews/:ratingId" element={<ReviewPage />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password-confirm/:uidb64/:token" element={<ResetPasswordConfirm />} />
                                <Route path="/verify-email/:token" element={<EmailVerification />} />
                                <Route path="/accounts" element={<PrivateRoute><AccountsPage /></PrivateRoute>} />
                                <Route path="/profile/:username" element={<UserProfilePage />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/terms" element={<TermsPage />} />
                                <Route path="/privacy" element={<PrivacyPage />} />
                                <Route path="/upload-supplements" element={<PrivateRoute adminOnly><UploadCSV type="supplements" /></PrivateRoute>} />
                                <Route path="/upload-conditions" element={<PrivateRoute adminOnly><UploadCSV type="conditions" /></PrivateRoute>} />
                                <Route path="/upload-brands" element={<PrivateRoute adminOnly><UploadBrands /></PrivateRoute>} />
                                <Route path="/admin-dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
                                <Route path="/top-rated" element={<TopRatedPage />} />
                                <Route path="/conditions/:conditionName" element={<ConditionPage />} />
                                <Route path="/compare" element={<ComparisonPage />} />
                                {SHOW_FIX_ME && <Route path="/fix-me" element={<FixMePage />} />}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                        </ErrorBoundary>
                    </Box>
                    <Footer />
                </Box>
        </BannerProvider>
    );
}

export default App;
