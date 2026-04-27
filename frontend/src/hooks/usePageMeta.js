// Simple hook that directly manipulates document.title, meta tags,
// a JSON-LD script tag, and a canonical link — no third-party library needed.

import { useEffect } from 'react';

const DEFAULT_TITLE = 'SupplementRatings';
const DEFAULT_DESC  = 'Real user reviews for vitamins, minerals, and supplements.';
const DEFAULT_IMAGE = 'https://supplementratings.com/Supplement_Ratings_Logo.png';
const SITE_BASE     = 'https://supplementratings.com';

function getOrCreate(selector, tag, attrs = {}) {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        document.head.appendChild(el);
    }
    return el;
}

export function usePageMeta({ title, description, ldJson, ogImage, canonicalUrl } = {}) {
    useEffect(() => {
        const prevTitle = document.title;

        const descEl      = getOrCreate('meta[name="description"]', 'meta', { name: 'description' });
        const ogTitleEl   = getOrCreate('meta[property="og:title"]', 'meta', { property: 'og:title' });
        const ogDescEl    = getOrCreate('meta[property="og:description"]', 'meta', { property: 'og:description' });
        const ogImgEl     = getOrCreate('meta[property="og:image"]', 'meta', { property: 'og:image' });
        const ogUrlEl     = getOrCreate('meta[property="og:url"]', 'meta', { property: 'og:url' });
        const twCardEl    = getOrCreate('meta[name="twitter:card"]', 'meta', { name: 'twitter:card' });
        const twImgEl     = getOrCreate('meta[name="twitter:image"]', 'meta', { name: 'twitter:image' });
        const canonicalEl = getOrCreate('link[rel="canonical"]', 'link', { rel: 'canonical' });
        const ldEl        = getOrCreate('script[type="application/ld+json"][data-page]', 'script', {
            type: 'application/ld+json',
            'data-page': 'true',
        });

        const prevDesc      = descEl.getAttribute('content') || '';
        const prevOgTitle   = ogTitleEl.getAttribute('content') || '';
        const prevOgDesc    = ogDescEl.getAttribute('content') || '';
        const prevOgImg     = ogImgEl.getAttribute('content') || '';
        const prevOgUrl     = ogUrlEl.getAttribute('content') || '';
        const prevTwImg     = twImgEl.getAttribute('content') || '';
        const prevCanonical = canonicalEl.getAttribute('href') || '';
        const prevLd        = ldEl.textContent;

        const resolvedTitle    = title || DEFAULT_TITLE;
        const resolvedDesc     = description || DEFAULT_DESC;
        const resolvedImg      = ogImage || DEFAULT_IMAGE;
        const resolvedCanonical = canonicalUrl
            ? (canonicalUrl.startsWith('http') ? canonicalUrl : SITE_BASE + canonicalUrl)
            : SITE_BASE + window.location.pathname;

        document.title = resolvedTitle;
        descEl.setAttribute('content', resolvedDesc);
        ogTitleEl.setAttribute('content', resolvedTitle);
        ogDescEl.setAttribute('content', resolvedDesc);
        ogImgEl.setAttribute('content', resolvedImg);
        ogUrlEl.setAttribute('content', resolvedCanonical);
        twCardEl.setAttribute('content', 'summary_large_image');
        twImgEl.setAttribute('content', resolvedImg);
        canonicalEl.setAttribute('href', resolvedCanonical);
        if (ldJson) ldEl.textContent = JSON.stringify(ldJson);

        return () => {
            document.title = prevTitle || DEFAULT_TITLE;
            descEl.setAttribute('content', prevDesc || DEFAULT_DESC);
            ogTitleEl.setAttribute('content', prevOgTitle || DEFAULT_TITLE);
            ogDescEl.setAttribute('content', prevOgDesc || DEFAULT_DESC);
            ogImgEl.setAttribute('content', prevOgImg || DEFAULT_IMAGE);
            ogUrlEl.setAttribute('content', prevOgUrl || SITE_BASE);
            twImgEl.setAttribute('content', prevTwImg || DEFAULT_IMAGE);
            canonicalEl.setAttribute('href', prevCanonical || SITE_BASE);
            ldEl.textContent = prevLd || '';
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, description, ldJson ? JSON.stringify(ldJson) : null, ogImage, canonicalUrl]);
}
