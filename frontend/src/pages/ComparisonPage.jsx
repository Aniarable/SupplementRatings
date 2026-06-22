// pages/ComparisonPage.jsx
// Side-by-side supplement comparison. URL: /compare?a=123&b=456

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Rating,
    TextField,
    Typography,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getSupplement, getAllSupplements } from '../services/api';
import { buildAmazonSearchUrl } from '../config';

function pct(count, total) {
    if (!total) return 0;
    return Math.round((count / total) * 100);
}

function SupplementColumn({ suppId, onClear }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!suppId) { setData(null); return; }
        setLoading(true);
        getSupplement(suppId)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [suppId]);

    if (!suppId) return null;

    if (loading) {
        return (
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', pt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ flex: 1, textAlign: 'center', pt: 6 }}>
                <Typography color="text.secondary">Not found</Typography>
            </Box>
        );
    }

    const ratings = data.ratings || [];
    const count = ratings.length;
    const avg = count > 0 ? (ratings.reduce((s, r) => s + r.score, 0) / count).toFixed(1) : null;

    // Score distribution
    const dist = [5, 4, 3, 2, 1].map(star => ({
        star,
        n: ratings.filter(r => r.score === star).length,
    }));

    // Top conditions (from condition_names on ratings)
    const condCounts = {};
    ratings.forEach(r => (r.condition_names || []).forEach(c => { condCounts[c] = (condCounts[c] || 0) + 1; }));
    const topConditions = Object.entries(condCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Top benefits
    const benCounts = {};
    ratings.forEach(r => (r.benefit_names || []).forEach(b => { benCounts[b] = (benCounts[b] || 0) + 1; }));
    const topBenefits = Object.entries(benCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

    // Top side effects
    const seCounts = {};
    ratings.forEach(r => (r.side_effect_names || []).forEach(s => { seCounts[s] = (seCounts[s] || 0) + 1; }));
    const topSideEffects = Object.entries(seCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

    // Dosage median
    const dosageValues = ratings
        .map(r => { const m = (r.dosage || '').match(/^(\d*\.?\d+)/); return m ? parseFloat(m[1]) : null; })
        .filter(v => v !== null)
        .sort((a, b) => a - b);
    const medDosage = dosageValues.length > 0
        ? dosageValues[Math.floor(dosageValues.length / 2)]
        : null;
    const dosageUnit = ratings.find(r => r.dosage)?.dosage?.replace(/^[\d.]+/, '').trim() || '';

    const amazonHref = buildAmazonSearchUrl(data.name);

    return (
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper elevation={0} sx={{ p: 2.5, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box>
                        <Typography
                            component={RouterLink}
                            to={`/supplements/${data.id}`}
                            variant="h6"
                            fontWeight={700}
                            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}
                        >
                            {data.name}
                        </Typography>
                        {data.category && (
                            <Typography variant="caption" color="text.secondary" display="block">
                                {data.category}
                            </Typography>
                        )}
                    </Box>
                    <Button size="small" onClick={onClear} sx={{ minWidth: 0, px: 1, fontSize: '0.7rem', color: 'text.disabled' }}>
                        ✕
                    </Button>
                </Box>

                {/* Rating summary */}
                {avg ? (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1 }}>{avg}</Typography>
                            <Rating value={parseFloat(avg)} readOnly precision={0.1} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">{count} review{count !== 1 ? 's' : ''}</Typography>

                        {/* Star bars */}
                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                            {dist.map(({ star, n }) => (
                                <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ width: 12 }}>{star}</Typography>
                                    <Box sx={{ flex: 1, height: 6, bgcolor: 'grey.100', borderRadius: 1, overflow: 'hidden' }}>
                                        <Box sx={{ width: `${pct(n, count)}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 1 }} />
                                    </Box>
                                    <Typography variant="caption" color="text.disabled" sx={{ width: 28, textAlign: 'right' }}>
                                        {pct(n, count)}%
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>No reviews yet</Typography>
                )}

                <Divider sx={{ mb: 1.5 }} />

                {/* Dosage */}
                {medDosage !== null && (
                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                            MEDIAN DOSAGE
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {medDosage}{dosageUnit}
                        </Typography>
                    </Box>
                )}

                {/* Taken for */}
                {topConditions.length > 0 && (
                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                            TAKEN FOR
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                            {topConditions.map(([name, n]) => (
                                <Chip key={name} label={`${name} (${n})`} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.65rem', height: 20 }} />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Benefits */}
                {topBenefits.length > 0 && (
                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                            TOP BENEFITS
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                            {topBenefits.map(([name, n]) => (
                                <Chip key={name} label={`${name} (${n})`} size="small" variant="outlined" color="success" sx={{ fontSize: '0.65rem', height: 20 }} />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Side effects */}
                {topSideEffects.length > 0 && (
                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                            REPORTED SIDE EFFECTS
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                            {topSideEffects.map(([name, n]) => (
                                <Chip key={name} label={`${name} (${n})`} size="small" variant="outlined" color="error" sx={{ fontSize: '0.65rem', height: 20 }} />
                            ))}
                        </Box>
                    </Box>
                )}

                <Divider sx={{ mb: 1.5 }} />

                <Button
                    href={amazonHref}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    component="a"
                    fullWidth
                    size="small"
                    variant="outlined"
                    endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
                    sx={{ color: '#c07a0a', borderColor: '#c07a0a', textTransform: 'none', fontSize: '0.78rem',
                        '&:hover': { color: '#e47911', borderColor: '#e47911', bgcolor: '#fff8f0' } }}
                >
                    Buy on Amazon
                </Button>
            </Paper>
        </Box>
    );
}

export default function ComparisonPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [suppOptions, setSuppOptions] = useState([]);
    const [pickA, setPickA] = useState(null);
    const [pickB, setPickB] = useState(null);

    const aId = searchParams.get('a');
    const bId = searchParams.get('b');

    // Load all supplements for the pickers
    useEffect(() => {
        getAllSupplements().then(setSuppOptions).catch(() => {});
    }, []);

    // Sync pickers from URL
    useEffect(() => {
        if (suppOptions.length === 0) return;
        if (aId && !pickA) setPickA(suppOptions.find(s => String(s.id) === aId) || null);
        if (bId && !pickB) setPickB(suppOptions.find(s => String(s.id) === bId) || null);
    }, [suppOptions, aId, bId]); // eslint-disable-line react-hooks/exhaustive-deps

    const setA = (obj) => {
        setPickA(obj);
        setSearchParams(prev => { const n = new URLSearchParams(prev); if (obj) n.set('a', obj.id); else n.delete('a'); return n; }, { replace: true });
    };
    const setB = (obj) => {
        setPickB(obj);
        setSearchParams(prev => { const n = new URLSearchParams(prev); if (obj) n.set('b', obj.id); else n.delete('b'); return n; }, { replace: true });
    };

    const nameA = pickA?.name || '';
    const nameB = pickB?.name || '';

    usePageMeta({
        title: nameA && nameB
            ? `${nameA} vs ${nameB} | SupplementRatings`
            : 'Compare Supplements | SupplementRatings',
        description: nameA && nameB
            ? `Compare ${nameA} and ${nameB} — ratings, dosage, benefits, and side effects from real user reviews.`
            : 'Compare two supplements side by side using real community reviews.',
        canonicalUrl: '/compare',
    });

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <CompareArrowsIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                <Typography variant="h5" fontWeight={700}>Compare Supplements</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Pick two supplements to see ratings, dosage, benefits, and side effects side by side.
            </Typography>

            {/* Pickers */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Autocomplete
                    sx={{ flex: 1, minWidth: 200 }}
                    options={suppOptions.filter(s => !pickB || s.id !== pickB.id)}
                    getOptionLabel={o => o.name}
                    value={pickA}
                    onChange={(_, v) => setA(v)}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    renderInput={params => <TextField {...params} label="Supplement A" />}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.disabled', fontWeight: 700, fontSize: '1.1rem' }}>
                    vs
                </Box>
                <Autocomplete
                    sx={{ flex: 1, minWidth: 200 }}
                    options={suppOptions.filter(s => !pickA || s.id !== pickA.id)}
                    getOptionLabel={o => o.name}
                    value={pickB}
                    onChange={(_, v) => setB(v)}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    renderInput={params => <TextField {...params} label="Supplement B" />}
                />
            </Box>

            {(!aId && !bId) && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 6 }}>
                    Choose two supplements above to start comparing.
                </Typography>
            )}

            {(aId || bId) && (
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    {aId && <SupplementColumn suppId={aId} onClear={() => setA(null)} />}
                    {bId && <SupplementColumn suppId={bId} onClear={() => setB(null)} />}
                </Box>
            )}

            <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 4, textAlign: 'center' }}>
                All data is user-reported and not a substitute for medical advice.
            </Typography>
        </Container>
    );
}
