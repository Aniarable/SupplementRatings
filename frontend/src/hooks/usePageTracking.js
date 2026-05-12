// hooks/usePageTracking.js
// Fires a fire-and-forget POST on every route change.
// Session ID is a UUID stored in localStorage — anonymous, no cookies.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../services/api';

function getSessionId() {
    const key = 'sr_session_id';
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }
    return id;
}

export function usePageTracking() {
    const location = useLocation();

    useEffect(() => {
        const sessionId = getSessionId();
        trackPageView(sessionId, location.pathname);
    }, [location.pathname]);
}
