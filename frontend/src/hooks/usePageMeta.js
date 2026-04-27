// Simple hook that directly manipulates document.title, meta[name=description],
// and a JSON-LD script tag — no third-party library needed.

import { useEffect } from 'react';

const DEFAULT_TITLE = 'SupplementRatings';
const DEFAULT_DESC  = 'Real user reviews for vitamins, minerals, and supplements.';

function getOrCreate(selector, tag, attrs = {}) {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        document.head.appendChild(el);
    }
    return el;
}

export function usePageMeta({ title, description, ldJson } = {}) {
    useEffect(() => {
        const prevTitle = document.title;
        const descEl = getOrCreate('meta[name="description"]', 'meta', { name: 'description' });
        const prevDesc = descEl.getAttribute('content') || '';
        const ldEl = getOrCreate('script[type="application/ld+json"][data-page]', 'script', {
            type: 'application/ld+json',
            'data-page': 'true',
        });
        const prevLd = ldEl.textContent;

        if (title)       document.title = title;
        if (description) descEl.setAttribute('content', description);
        if (ldJson)      ldEl.textContent = JSON.stringify(ldJson);

        return () => {
            document.title = prevTitle || DEFAULT_TITLE;
            descEl.setAttribute('content', prevDesc || DEFAULT_DESC);
            ldEl.textContent = prevLd || '';
        };
    }, [title, description, ldJson ? JSON.stringify(ldJson) : null]); // eslint-disable-line react-hooks/exhaustive-deps
}
