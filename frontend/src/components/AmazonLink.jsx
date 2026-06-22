// components/AmazonLink.jsx
// Subtle inline affiliate link shown on supplement detail pages.

import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { buildAmazonSearchUrl } from '../config';

export default function AmazonLink({ supplementName }) {
    if (!supplementName) return null;

    const href = buildAmazonSearchUrl(supplementName);

    return (
        <Link
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            underline="none"
            onClick={e => e.stopPropagation()}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.4,
                fontSize: '0.78rem',
                color: '#c07a0a',
                opacity: 0.85,
                '&:hover': { opacity: 1, color: '#e47911' },
                transition: 'color 150ms ease, opacity 150ms ease',
            }}
        >
            Buy on Amazon
            <OpenInNewIcon sx={{ fontSize: 11 }} />
        </Link>
    );
}
