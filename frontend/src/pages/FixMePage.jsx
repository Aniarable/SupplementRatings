// pages/FixMePage.jsx
// Local-only feature (VITE_FEATURE_FIX_ME=true).
// Lets users describe a problem in plain English and surfaces the most relevant reviews.

import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    InputAdornment,
    Paper,
    Rating,
    TextField,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HealingIcon from '@mui/icons-material/Healing';
import { fixMeSearch } from '../services/api';

function timeAgo(dateString) {
    const days = Math.floor((Date.now() - new Date(dateString)) / 86400000);
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
}

function ResultCard({ result }) {
    const snippet = result.comment
        ? result.comment.length > 240
            ? result.comment.slice(0, 240) + '…'
            : result.comment
        : null;

    return (
        <Paper
            elevation={0}
            sx={{ p: 2.5, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
                <Typography
                    component={RouterLink}
                    to={`/supplements/${result.supplement_id}`}
                    variant="subtitle1"
                    fontWeight={700}
                    color="primary.main"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                    {result.supplement_name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                    <Rating value={result.score} readOnly size="small" precision={0.5} />
                    <Typography variant="body2" fontWeight={700}>{result.score?.toFixed(1)}</Typography>
                </Box>
            </Box>

            {result.supplement_category && (
                <Chip label={result.supplement_category} size="small" variant="outlined"
                    sx={{ fontSize: '0.65rem', height: 18, mb: 1 }} />
            )}

            {snippet && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25, lineHeight: 1.55 }}>
                    "{snippet}"
                </Typography>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, mb: 0.75 }}>
                {result.condition_names.slice(0, 4).map(n => (
                    <Chip key={n} label={n} size="small" color="primary" variant="outlined"
                        sx={{ fontSize: '0.62rem', height: 18 }} />
                ))}
                {result.benefit_names.slice(0, 3).map(n => (
                    <Chip key={n} label={n} size="small" color="success" variant="outlined"
                        sx={{ fontSize: '0.62rem', height: 18 }} />
                ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.disabled">
                    {result.username && `by ${result.username} · `}{timeAgo(result.created_at)}
                </Typography>
                <Typography
                    component={RouterLink}
                    to={`/reviews/${result.id}`}
                    variant="caption"
                    color="primary.main"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                    Read full review →
                </Typography>
            </Box>
        </Paper>
    );
}

export default function FixMePage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState('');

    usePageMeta({
        title: 'For Me — Find Supplements for Your Issue | SupplementRatings',
        description: 'Describe what you want to fix and find the most relevant supplement reviews.',
        canonicalUrl: '/fix-me',
    });

    const handleSearch = async () => {
        const q = query.trim();
        if (q.length < 3) { setError('Please enter at least 3 characters.'); return; }
        setError('');
        setLoading(true);
        setResults(null);
        try {
            const data = await fixMeSearch(q);
            setResults(data);
            setSearched(q);
        } catch {
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <HealingIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700}>For Me</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Describe what you're trying to fix — in plain English. We'll find the most relevant reviews.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g. I can't sleep and feel anxious in the morning"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="contained" onClick={handleSearch} disabled={loading} sx={{ whiteSpace: 'nowrap' }}>
                    Find reviews
                </Button>
            </Box>

            {error && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>{error}</Typography>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            )}

            {results !== null && !loading && (
                <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {results.length === 0
                            ? `No reviews found for "${searched}".`
                            : `${results.length} review${results.length !== 1 ? 's' : ''} matching "${searched}"`}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {results.map((r, i) => (
                            <React.Fragment key={r.id}>
                                {i > 0 && <Divider sx={{ display: 'none' }} />}
                                <ResultCard result={r} />
                            </React.Fragment>
                        ))}
                    </Box>

                    {results.length > 0 && (
                        <Typography variant="caption" color="text.disabled" display="block"
                            sx={{ mt: 3, textAlign: 'center' }}>
                            Based on user-reported data. Not medical advice.
                        </Typography>
                    )}
                </>
            )}
        </Container>
    );
}
