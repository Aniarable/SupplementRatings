// components/admin/StatsPanel.jsx
// Admin stats dashboard: users, reviews, supplements, visitor metrics, daily chart.

import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ScienceIcon from '@mui/icons-material/Science';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { getAdminStats } from '../../services/api';

function StatCard({ icon, label, value, sub, color = 'primary.main' }) {
    return (
        <Paper elevation={0} sx={{ p: 2.5, border: t => `1px solid ${t.palette.divider}`, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ color, display: 'flex' }}>{icon}</Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {label}
                </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1 }}>
                {value ?? '—'}
            </Typography>
            {sub && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {sub}
                </Typography>
            )}
        </Paper>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function StatsPanel() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getAdminStats()
            .then(setStats)
            .catch(() => setError('Failed to load stats.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;
    if (!stats) return null;

    const chartData = (stats.daily_chart || []).map(d => ({
        date: formatDate(d.date),
        'Page Views': d.views,
        'Unique Visitors': d.unique,
    }));

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Site Overview
            </Typography>

            {/* Row 1 — core counts */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        icon={<PeopleIcon />}
                        label="Total Users"
                        value={stats.users.total.toLocaleString()}
                        sub={`+${stats.users.new_7d} this week · +${stats.users.new_30d} this month`}
                        color="primary.main"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        icon={<RateReviewIcon />}
                        label="Total Reviews"
                        value={stats.reviews.total.toLocaleString()}
                        sub={`+${stats.reviews.new_7d} this week · +${stats.reviews.new_30d} this month`}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        icon={<StarIcon />}
                        label="Avg Rating"
                        value={stats.reviews.avg_rating ? `${stats.reviews.avg_rating} / 5` : '—'}
                        color="warning.main"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        icon={<ScienceIcon />}
                        label="Supplements"
                        value={stats.supplements.total.toLocaleString()}
                        color="secondary.main"
                    />
                </Grid>
            </Grid>

            {/* Row 2 — visitor metrics */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                    <StatCard
                        icon={<VisibilityIcon />}
                        label="Today (DAU)"
                        value={stats.visitors.dau.toLocaleString()}
                        sub="Unique sessions today"
                        color="info.main"
                    />
                </Grid>
                <Grid item xs={4}>
                    <StatCard
                        icon={<TrendingUpIcon />}
                        label="This Week (WAU)"
                        value={stats.visitors.wau.toLocaleString()}
                        sub="Unique sessions (7d)"
                        color="info.main"
                    />
                </Grid>
                <Grid item xs={4}>
                    <StatCard
                        icon={<TrendingUpIcon />}
                        label="This Month (MAU)"
                        value={stats.visitors.mau.toLocaleString()}
                        sub="Unique sessions (30d)"
                        color="info.main"
                    />
                </Grid>
            </Grid>

            {/* Daily activity chart */}
            {chartData.length > 0 && (
                <Paper elevation={0} sx={{ p: 2.5, border: t => `1px solid ${t.palette.divider}`, borderRadius: 2, mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                        Daily Activity — Last 30 Days
                    </Typography>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Area type="monotone" dataKey="Page Views" stroke="#1976d2" fill="url(#colorViews)" strokeWidth={2} />
                            <Area type="monotone" dataKey="Unique Visitors" stroke="#2e7d32" fill="url(#colorUnique)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </Paper>
            )}

            {chartData.length === 0 && (
                <Paper elevation={0} sx={{ p: 3, border: t => `1px solid ${t.palette.divider}`, borderRadius: 2, mb: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        No visitor data yet — chart will populate as users visit the site.
                    </Typography>
                </Paper>
            )}

            {/* Top reviewers */}
            {stats.top_reviewers.length > 0 && (
                <Paper elevation={0} sx={{ p: 2.5, border: t => `1px solid ${t.palette.divider}`, borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                        Top Reviewers
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {stats.top_reviewers.map((r, i) => (
                            <Chip
                                key={r.username}
                                label={`${i + 1}. ${r.username} — ${r.review_count} review${r.review_count !== 1 ? 's' : ''}`}
                                variant="outlined"
                                size="small"
                                color={i === 0 ? 'primary' : 'default'}
                            />
                        ))}
                    </Box>
                </Paper>
            )}

            <Divider sx={{ mt: 3, mb: 1 }} />
        </Box>
    );
}
