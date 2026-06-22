const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
    ? 'http://127.0.0.1:8000/api/'
    : 'https://supplementratings.com/api/';

// Centralized default profile image URL to avoid mixed-content and hardcoded localhost
// Derive from API_BASE_URL so it works in both dev and prod
// Compute media base by stripping a trailing /api or /api/
const MEDIA_BASE = API_BASE_URL.endsWith('/api/')
    ? API_BASE_URL.slice(0, -5)
    : (API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL);
export const DEFAULT_PROFILE_IMAGE_URL = `${MEDIA_BASE}/media/profile_pics/default.jpg`;

// ---------------------------------------------------------------------------
// Amazon Associates affiliate config
// ---------------------------------------------------------------------------
// Single source of truth for the affiliate tracking tag. If the Associates
// account is ever reset/reissued (e.g. after an inactivity delisting), change
// THIS ONE VALUE and every affiliate link across the site updates.
export const AMAZON_AFFILIATE_TAG = 'supplemen05d7-20';

// Build an Amazon affiliate search URL for a supplement / keyword.
export const buildAmazonSearchUrl = (keyword) =>
    `https://www.amazon.com/s?linkCode=ll2&tag=${AMAZON_AFFILIATE_TAG}&language=en_US&ref_=as_li_ss_tl&k=${encodeURIComponent(keyword || '')}`;

// Amazon homepage affiliate link (used by the support banner).
export const buildAmazonHomeUrl = () =>
    `https://www.amazon.com/?linkCode=ll2&tag=${AMAZON_AFFILIATE_TAG}&language=en_US&ref_=as_li_ss_tl`;