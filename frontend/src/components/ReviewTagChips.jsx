// components/ReviewTagChips.jsx
// Shared blue/green/red chip rows for For / Helped with / Side effects.
// Used on review cards across the whole site.

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

const ROWS = [
    { key: 'conditions', label: 'For:',          color: 'primary' },
    { key: 'benefits',   label: 'Helped with:',  color: 'success' },
    { key: 'sideEffects',label: 'Side effects:',  color: 'error'   },
];

export default function ReviewTagChips({ conditionNames, benefitNames, sideEffectNames }) {
    const data = {
        conditions:  conditionNames,
        benefits:    benefitNames,
        sideEffects: sideEffectNames,
    };

    const hasAny = Object.values(data).some(arr => arr?.length > 0);
    if (!hasAny) return null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, mb: 1 }}>
            {ROWS.map(({ key, label, color }) => {
                const items = data[key];
                if (!items?.length) return null;
                return (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 600, whiteSpace: 'nowrap', mr: 0.25 }}
                        >
                            {label}
                        </Typography>
                        {items.map((item) => (
                            <Chip
                                key={item}
                                size="small"
                                label={item}
                                variant="outlined"
                                color={color}
                                sx={{ fontSize: '0.72rem', height: 22 }}
                            />
                        ))}
                    </Box>
                );
            })}
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem', fontStyle: 'italic', mt: 0.25 }}>
                User-reported — not clinically proven
            </Typography>
        </Box>
    );
}
