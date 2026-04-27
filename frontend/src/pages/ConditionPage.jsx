// pages/ConditionPage.jsx
// Shows all supplements that users have tagged for a given condition,
// sorted by average rating. URL: /conditions/:conditionName

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import {
    Box,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Rating,
    Typography,
} from '@mui/material';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { getSupplements } from '../services/api';

export default function ConditionPage() {
    const { conditionName } = useParams();
    const [supplements, setSupplements] = useState([]);
    const [loading, setLoading] = useState(true);

    // conditionName comes URL-encoded from the router
    const decoded = conditionName ? decodeURIComponent(conditionName) : '';

    useEffect(() => {
        if (!decoded) return;
        let cancelled = false;
        setLoading(true);

        getSupplements({ conditions: decoded, ordering: '-avg_rating', limit: 50 })
            .then(data => { if (!cancelled) setSupplements(data.results || data || []); })
            .catch(() => { if (!cancelled) setSupplements([]); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [decoded]);

    usePageMeta({
        title: `Best Supplements for ${decoded} | SupplementRatings`,
        description: `See what supplements users have rated for ${decoded}. Real reviews, average ratings, and dosage data from the SupplementRatings community.`,
        canonicalUrl: `/conditions/${conditionName}`,
    });

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <MedicalServicesOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700}>
                    {loading ? 'Loading…' : `Supplements for ${decoded}`}
                </Typography>
            </Box>

            {!loading && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {supplements.length} supplement{supplements.length !== 1 ? 's' : ''} reviewed by users taking them for{' '}
                    <strong>{decoded}</strong>. Sorted by average community rating.
                </Typography>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            ) : supplements.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 6 }}>
                    No reviews yet for this condition.
                </Typography>
            ) : (
                <Paper elevation={0} sx={{ border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 3, overflow: 'hidden' }}>
                    {supplements.map((s, idx) => {
                        const avg = s.avg_rating;
                        const count = s.rating_count ?? 0;
                        return (
                            <React.Fragment key={s.id}>
                                {idx > 0 && <Divider />}
                                <Box
                                    component={RouterLink}
                                    to={`/supplements/${s.id}`}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        px: 2.5,
                                        py: 1.75,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        transition: 'background 120ms',
                                        '&:hover': { bgcolor: 'action.hover' },
                                    }}
                                >
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                                            {s.name}
                                        </Typography>
                                        {s.category && (
                                            <Chip label={s.category} size="small" variant="outlined"
                                                sx={{ fontSize: '0.65rem', height: 18, mt: 0.25 }} />
                                        )}
                                    </Box>
                                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                                            <Rating value={avg ?? 0} readOnly precision={0.1} size="small" />
                                            <Typography variant="body2" fontWeight={700}>
                                                {avg != null ? Number(avg).toFixed(1) : '—'}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.disabled">
                                            {count} {count === 1 ? 'review' : 'reviews'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </React.Fragment>
                        );
                    })}
                </Paper>
            )}

            <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 3, textAlign: 'center' }}>
                Based on user-reported data. Not medical advice.
            </Typography>
        </Container>
    );
}
