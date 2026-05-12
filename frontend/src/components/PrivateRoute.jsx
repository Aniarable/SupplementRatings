import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Your AuthContext
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, adminOnly = false, dashboardAccess = false }) => {
    const { isAuthenticated, isAdmin, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Show a loading spinner while checking auth status
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to so we can send them along after they login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" state={{ error: 'Access Denied - Admin Only' }} replace />;
    }

    if (dashboardAccess && !isAdmin && !user?.has_dashboard_access) {
        return <Navigate to="/" state={{ error: 'Access Denied' }} replace />;
    }

    return children;
};

export default PrivateRoute; 