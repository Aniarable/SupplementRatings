// pages/TopRatedPage.jsx
// Leaderboard of the highest-rated supplements (min 3 reviews).

import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import {
    Box,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Rating,
    Typography,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { getTopRated } from '../services/api';

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function TopRatedPage() {
    const [supplements, setSupplements] = useState([]);
    const [loading, setLoading] = useState(true);

    usePageMeta({
        title: 'Top Rated Supplements | SupplementRatings',
        description: 'Discover the highest-rated vitamins, minerals, and supplements based on real user reviews.',
    });

    useEffect(() => {
        getTopRated()
            .then(data => setSupplements(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 32 }} />
                <Typography variant="h5" fontWeight={700}>
                    Top Rated Supplements
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ranked by average user rating — minimum 3 reviews required.
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            ) : supplements.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 6 }}>
                    Not enough data yet — check back soon!
                </Typography>
            ) : (
                <Paper elevation={0} sx={{ border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 3, overflow: 'hidden' }}>
                    {supplements.map((s, idx) => {
                        const avgRating = typeof s.avg_rating === 'number' ? s.avg_rating : null;
                        const ratingCount = s.rating_count ?? 0;
                        const medalColor = MEDAL_COLORS[idx] || null;

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
                                        py: 2,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        transition: 'background 120ms',
                                        '&:hover': { bgcolor: 'action.hover' },
                                    }}
                                >
                                    {/* Rank */}
                                    <Box sx={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
                                        {medalColor ? (
                                            <EmojiEventsIcon sx={{ color: medalColor, fontSize: 22 }} />
                                        ) : (
                                            <Typography variant="body2" fontWeight={700} color="text.disabled">
                                                {idx + 1}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Name + rating */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                                            {s.name}
                                        </Typography>
                                        {s.category && (
                                            <Typography variant="caption" color="text.disabled">
                                                {s.category}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Score */}
                                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                                            <Rating value={avgRating} readOnly precision={0.1} size="small" />
                                            <Typography variant="body2" fontWeight={700}>
                                                {avgRating !== null ? avgRating.toFixed(1) : '—'}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.disabled">
                                            {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </React.Fragment>
                        );
                    })}
                </Paper>
            )}
        </Container>
    );
}
