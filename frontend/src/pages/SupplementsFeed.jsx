// frontend/src/pages/SupplementsFeed.jsx
// Reddit-style infinite-scroll feed of supplement reviews.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Link as MuiLink,
    Paper,
    Rating,
    Skeleton,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import StarIcon from '@mui/icons-material/Star';
import { getFeed, upvoteRating, getCategories, getAllSupplements, getConditions } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { DEFAULT_PROFILE_IMAGE_URL } from '../config';
import debounce from 'lodash/debounce';

const PAGE_SIZE = 15;

const SORT_OPTIONS = [
    { value: '-upvotes', label: 'Hot', icon: <WhatshotIcon fontSize="small" /> },
    { value: '-created_at', label: 'New', icon: <NewReleasesIcon fontSize="small" /> },
    { value: '-score', label: 'Top Rated', icon: <StarIcon fontSize="small" /> },
];

function timeAgo(dateString) {
    const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
}

function FeedCardSkeleton() {
    return (
        <Paper
            elevation={0}
            sx={{ p: 2, mb: 1.5, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
        >
            <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton width="30%" height={16} sx={{ mb: 0.5 }} />
                    <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                    <Skeleton width="90%" height={14} />
                    <Skeleton width="75%" height={14} />
                </Box>
            </Box>
        </Paper>
    );
}

function FeedCard({ rating, onUpvote, onDownvote, currentUser }) {
    const navigate = useNavigate();
    const supplementId = rating.supplement;
    const supplementName = rating.supplement_display || 'Unknown Supplement';
    const canVote = currentUser && currentUser.id !== rating.user?.id;
    const isOwnPost = currentUser && currentUser.id === rating.user?.id;

    const handleCardClick = () => navigate(`/reviews/${rating.id}`);

    const handleUpvote = (e) => {
        e.stopPropagation();
        if (!currentUser) { toast.info('Log in to vote'); return; }
        if (!canVote) return;
        onUpvote(rating.id);
    };

    const handleDownvote = (e) => {
        e.stopPropagation();
        if (!currentUser) { toast.info('Log in to vote'); return; }
        if (!canVote) return;
        onDownvote(rating.id);
    };

    return (
        <Paper
            elevation={0}
            onClick={handleCardClick}
            sx={{
                mb: 1.5,
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'border-color 120ms ease, box-shadow 120ms ease',
                '&:hover': { borderColor: 'primary.main', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
            }}
        >
            <Box sx={{ display: 'flex' }}>
                {/* Vote rail */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        pt: 1.5,
                        px: 1,
                        bgcolor: theme => theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
                        minWidth: 48,
                        borderRight: theme => `1px solid ${theme.palette.divider}`,
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <IconButton size="small" onClick={handleUpvote} color={rating.has_upvoted ? 'primary' : 'default'} sx={{ p: 0.5 }}>
                        <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" fontWeight={700} color={rating.has_upvoted ? 'primary.main' : 'text.secondary'}>
                        {rating.upvotes ?? 0}
                    </Typography>
                    <IconButton size="small" onClick={handleDownvote} color={rating.has_downvoted ? 'error' : 'default'} sx={{ p: 0.5 }}>
                        <ThumbDownIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" fontWeight={700} color={rating.has_downvoted ? 'error.main' : 'text.secondary'}>
                        {rating.downvotes ?? 0}
                    </Typography>
                    {isOwnPost && (
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem', mt: 0.5 }}>
                            yours
                        </Typography>
                    )}
                </Box>

                {/* Main content */}
                <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>

                        {/* Left: primary content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* Title — primary headline when present */}
                            {rating.title && (
                                <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3, mb: 0.25 }}>
                                    {rating.title}
                                </Typography>
                            )}

                            {/* Supplement name — headline when no title, secondary context otherwise */}
                            <Typography
                                variant="body2"
                                fontWeight={rating.title ? 400 : 700}
                                color="primary.main"
                                sx={{ '&:hover': { textDecoration: 'underline' }, mb: 0.25 }}
                            >
                                {supplementName}
                            </Typography>

                            {/* User + stars + time */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                <RouterLink
                                    to={`/profile/${rating.user?.username}`}
                                    onClick={e => e.stopPropagation()}
                                    style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Avatar
                                        src={rating.user?.profile_image_url || DEFAULT_PROFILE_IMAGE_URL}
                                        alt={rating.user?.username}
                                        sx={{ width: 22, height: 22, fontSize: '0.75rem' }}
                                    />
                                    <Typography variant="caption" fontWeight={600} sx={{ '&:hover': { textDecoration: 'underline' } }}>
                                        {rating.user?.username}
                                    </Typography>
                                </RouterLink>
                                <Rating value={rating.score} readOnly size="small" precision={0.5} />
                                <Typography variant="caption" color="text.secondary">
                                    {timeAgo(rating.created_at)}
                                </Typography>
                                {rating.is_edited && (
                                    <Typography variant="caption" color="text.disabled">(edited)</Typography>
                                )}
                            </Box>

                            {/* Comment body preview */}
                            {rating.comment && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {rating.comment}
                                </Typography>
                            )}

                            {/* Image thumbnail */}
                            {rating.image_url && (
                                <Box
                                    component="img"
                                    src={rating.image_url}
                                    alt="Review image"
                                    sx={{ maxHeight: 160, maxWidth: '100%', borderRadius: 1, mb: 1, objectFit: 'cover' }}
                                    onClick={e => e.stopPropagation()}
                                />
                            )}

                            {/* Footer: comment count · dosage · amazon */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <ForumOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                    <Typography variant="caption" color="text.disabled">
                                        {rating.comments_count ?? 0} {rating.comments_count === 1 ? 'comment' : 'comments'}
                                    </Typography>
                                </Box>
                                {rating.dosage && (
                                    <Typography variant="caption" color="text.disabled">
                                        {rating.dosage}
                                        {rating.dosage_frequency && rating.frequency_unit
                                            ? ` · ${rating.dosage_frequency}x/${rating.frequency_unit}`
                                            : ''}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {/* Right: tags panel — only rendered if any tag data exists */}
                        {(rating.condition_names?.length > 0 || rating.benefit_names?.length > 0 || rating.side_effect_names?.length > 0) && (
                            <Box
                                sx={{
                                    flexShrink: 0,
                                    width: { xs: 130, sm: 160 },
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.75,
                                    alignItems: 'flex-start',
                                }}
                            >
                                {/* Reusable chip style */}
                                {[
                                    { label: 'For:', items: rating.condition_names, color: 'primary' },
                                    { label: 'Helped with:', items: rating.benefit_names, color: 'success' },
                                    { label: 'Side effects:', items: rating.side_effect_names, color: 'error' },
                                ].map(({ label, items, color }) =>
                                    items?.length > 0 ? (
                                        <Box key={label} sx={{ width: '100%', minWidth: 0 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.25 }}>
                                                {label}
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                                                {items.slice(0, 3).map((item) => (
                                                    <Tooltip key={item} title={item} placement="top" enterDelay={400}>
                                                        <Chip
                                                            size="small"
                                                            label={item}
                                                            variant="outlined"
                                                            color={color}
                                                            sx={{
                                                                fontSize: '0.65rem',
                                                                height: 18,
                                                                maxWidth: '100%',
                                                                overflow: 'hidden',
                                                                '& .MuiChip-label': {
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    display: 'block',
                                                                },
                                                            }}
                                                        />
                                                    </Tooltip>
                                                ))}
                                                {items.length > 3 && (
                                                    <Chip size="small" label={`+${items.length - 3}`} variant="outlined" color={color} sx={{ fontSize: '0.65rem', height: 18 }} />
                                                )}
                                            </Box>
                                        </Box>
                                    ) : null
                                )}
                                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem', fontStyle: 'italic', mt: 0.25 }}>
                                    User-reported, not proven
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}

function SupplementsFeed() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState('-upvotes');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [conditionOptions, setConditionOptions] = useState([]);
    const [filterFor, setFilterFor] = useState([]);
    const [filterHelped, setFilterHelped] = useState([]);
    const [filterSideEffects, setFilterSideEffects] = useState([]);
    const sentinelRef = useRef(null);

    // Write-a-review dialog
    const [writeReviewOpen, setWriteReviewOpen] = useState(false);
    const [suppForReview, setSuppForReview] = useState(null);
    const [suppOptions, setSuppOptions] = useState([]);
    const [suppOptionsLoading, setSuppOptionsLoading] = useState(false);

    const handleOpenWriteReview = async () => {
        if (!isAuthenticated) { toast.error('Log in to write a review'); return; }
        setWriteReviewOpen(true);
        setSuppForReview(null);
        if (suppOptions.length === 0) {
            setSuppOptionsLoading(true);
            try {
                const results = await getAllSupplements();
                setSuppOptions(results);
            } catch {
                toast.error('Failed to load supplements');
            } finally {
                setSuppOptionsLoading(false);
            }
        }
    };

    const handleConfirmWriteReview = () => {
        if (!suppForReview) return;
        setWriteReviewOpen(false);
        navigate(`/supplements/${suppForReview.id}`, { state: { openRatingDialog: true } });
    };

    // Debounce search
    const debouncedSetSearch = useCallback(
        debounce((val) => setSearch(val), 350),
        []
    );

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
        debouncedSetSearch(e.target.value);
    };

    // Load categories + conditions for filters
    useEffect(() => {
        getCategories().then(setCategories).catch(() => {});
        getConditions('').then(data => setConditionOptions(Array.isArray(data) ? data : [])).catch(() => {});
    }, []);

    // Reset + load when any filter changes
    useEffect(() => {
        setFeed([]);
        setOffset(0);
        setHasMore(true);
        loadPage(0, true);
    }, [sort, search, selectedCategory, filterFor, filterHelped, filterSideEffects]);

    const loadPage = useCallback(async (pageOffset, reset = false) => {
        if (reset) setLoading(true);
        else setLoadingMore(true);

        try {
            const params = {
                ordering: sort,
                limit: PAGE_SIZE,
                offset: pageOffset,
            };
            if (search) params.search = search;
            if (selectedCategory) params.category = selectedCategory;
            if (filterFor.length) params.conditions = filterFor.map(c => c.name).join(',');
            if (filterHelped.length) params.benefits = filterHelped.map(c => c.name).join(',');
            if (filterSideEffects.length) params.side_effects = filterSideEffects.map(c => c.name).join(',');

            const data = await getFeed(params);
            const results = data.results || [];

            setFeed(prev => reset ? results : [...prev, ...results]);
            setOffset(pageOffset + results.length);
            setHasMore(data.next !== null);
        } catch {
            toast.error('Failed to load feed');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [sort, search, selectedCategory, filterFor, filterHelped, filterSideEffects]);

    // Infinite scroll via IntersectionObserver
    useEffect(() => {
        if (!sentinelRef.current || !hasMore || loadingMore) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadPage(offset);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loadingMore, offset, loadPage]);

    const handleVote = async (ratingId, voteType) => {
        try {
            const response = await upvoteRating(ratingId, voteType);
            setFeed(prev =>
                prev.map(r =>
                    r.id === ratingId
                        ? { ...r, upvotes: response.upvotes_count, downvotes: response.downvotes_count, has_upvoted: response.has_upvoted, has_downvoted: response.has_downvoted }
                        : r
                )
            );
        } catch (err) {
            console.error('Vote error:', err);
            toast.error('Failed to vote');
        }
    };
    const handleUpvote = (ratingId) => handleVote(ratingId, 'up');
    const handleDownvote = (ratingId) => handleVote(ratingId, 'down');

    const sortedCategories = [...categories].sort((a, b) => a.localeCompare(b));

    return (
        <>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>

                    {/* Main feed column */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>

                        {/* Write a Review button */}
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleOpenWriteReview}
                            sx={{ mb: 1, py: 1.25, fontWeight: 700, borderRadius: 2, fontSize: '1rem' }}
                        >
                            + Write a Review
                        </Button>

                        {/* Medical disclaimer */}
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2, textAlign: 'center' }}>
                            Reviews are personal opinions, not medical advice.{' '}
                            <MuiLink component={RouterLink} to="/terms" underline="hover" color="inherit">
                                Terms
                            </MuiLink>
                            {' · '}
                            <MuiLink component={RouterLink} to="/privacy" underline="hover" color="inherit">
                                Privacy
                            </MuiLink>
                        </Typography>

                        {/* Sort + search + tag filters — single bar */}
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.5,
                                py: 0.75,
                                mb: 2,
                                border: theme => `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                flexWrap: 'nowrap',
                                overflowX: 'auto',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': { display: 'none' },
                            }}
                        >
                            <ToggleButtonGroup
                                value={sort}
                                exclusive
                                onChange={(_, v) => v && setSort(v)}
                                size="small"
                                sx={{ flexShrink: 0 }}
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <ToggleButton key={opt.value} value={opt.value} sx={{ gap: 0.4, px: 1 }}>
                                        {opt.icon}
                                        <Typography variant="caption" fontWeight={600}>{opt.label}</Typography>
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>

                            {conditionOptions.length > 0 && [
                                { label: 'For', value: filterFor, setter: setFilterFor, color: 'primary' },
                                { label: 'Helped', value: filterHelped, setter: setFilterHelped, color: 'success' },
                                { label: 'Side effects', value: filterSideEffects, setter: setFilterSideEffects, color: 'error' },
                            ].map(({ label, value, setter, color }) => (
                                <Autocomplete
                                    key={label}
                                    multiple
                                    limitTags={1}
                                    size="small"
                                    options={conditionOptions}
                                    getOptionLabel={o => o.name}
                                    value={value}
                                    onChange={(_, v) => setter(v)}
                                    isOptionEqualToValue={(o, v) => o.id === v.id}
                                    disableCloseOnSelect
                                    sx={{ width: 115, flexShrink: 0 }}
                                    renderTags={(vals, getTagProps) =>
                                        vals.map((opt, i) => (
                                            <Chip
                                                {...getTagProps({ index: i })}
                                                key={opt.id}
                                                label={opt.name}
                                                size="small"
                                                color={color}
                                                variant="outlined"
                                                sx={{ fontSize: '0.6rem', height: 18, maxWidth: 70 }}
                                            />
                                        ))
                                    }
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            label={label}
                                            placeholder={value.length ? '' : 'Any'}
                                        />
                                    )}
                                />
                            ))}

                            <TextField
                                size="small"
                                placeholder="Search..."
                                value={searchInput}
                                onChange={handleSearchChange}
                                sx={{ width: 110, flexShrink: 0 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Paper>

                        {/* Category pills (mobile — above feed) */}
                        {sortedCategories.length > 0 && (
                            <Box
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    gap: 1,
                                    mb: 2,
                                    flexWrap: 'nowrap',
                                    overflowX: 'auto',
                                    pb: 0.5,
                                    scrollbarWidth: 'none',
                                    '&::-webkit-scrollbar': { display: 'none' },
                                }}
                            >
                                <Chip
                                    label="All"
                                    size="small"
                                    onClick={() => setSelectedCategory('')}
                                    color={selectedCategory === '' ? 'primary' : 'default'}
                                    variant={selectedCategory === '' ? 'filled' : 'outlined'}
                                    sx={{ flexShrink: 0 }}
                                />
                                {sortedCategories.map(cat => (
                                    <Chip
                                        key={cat}
                                        label={cat}
                                        size="small"
                                        onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                                        color={selectedCategory === cat ? 'primary' : 'default'}
                                        variant={selectedCategory === cat ? 'filled' : 'outlined'}
                                        sx={{ flexShrink: 0 }}
                                    />
                                ))}
                            </Box>
                        )}

                        {/* Feed */}
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => <FeedCardSkeleton key={i} />)
                        ) : feed.length === 0 ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    py: 8,
                                    textAlign: 'center',
                                    border: theme => `1px solid ${theme.palette.divider}`,
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No reviews found
                                </Typography>
                                <Typography variant="body2" color="text.disabled">
                                    {search ? 'Try a different search term' : 'Be the first to leave a review!'}
                                </Typography>
                            </Paper>
                        ) : (
                            feed.map(rating => (
                                <FeedCard
                                    key={rating.id}
                                    rating={rating}
                                    onUpvote={handleUpvote}
                                    onDownvote={handleDownvote}
                                    currentUser={user}
                                />
                            ))
                        )}

                        {/* Infinite scroll sentinel */}
                        <Box ref={sentinelRef} sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
                            {loadingMore && <CircularProgress size={24} />}
                            {!hasMore && feed.length > 0 && (
                                <Typography variant="caption" color="text.disabled">
                                    You've reached the end
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Sidebar — desktop only */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                            gap: 2,
                            width: 280,
                            flexShrink: 0,
                            position: 'sticky',
                            top: 80,
                        }}
                    >
                        {/* Category filter */}
                        {sortedCategories.length > 0 && (
                            <Paper
                                elevation={0}
                                sx={{ border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
                            >
                                <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                        Browse by Category
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                        <Chip
                                            label="All"
                                            size="small"
                                            onClick={() => setSelectedCategory('')}
                                            color={selectedCategory === '' ? 'primary' : 'default'}
                                            variant={selectedCategory === '' ? 'filled' : 'outlined'}
                                        />
                                        {sortedCategories.map(cat => (
                                            <Chip
                                                key={cat}
                                                label={cat}
                                                size="small"
                                                onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                                                color={selectedCategory === cat ? 'primary' : 'default'}
                                                variant={selectedCategory === cat ? 'filled' : 'outlined'}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Paper>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
        {/* Write a Review dialog */}
        <Dialog open={writeReviewOpen} onClose={() => setWriteReviewOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 0.5 }}>
                    Search for the supplement you want to review.
                </Typography>
                <Autocomplete
                    options={suppOptions}
                    loading={suppOptionsLoading}
                    getOptionLabel={(opt) => opt.name}
                    value={suppForReview}
                    onChange={(_, val) => setSuppForReview(val)}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Supplement"
                            placeholder="e.g. Vitamin D, Magnesium..."
                            autoFocus
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setWriteReviewOpen(false)}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleConfirmWriteReview}
                    disabled={!suppForReview}
                >
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
}

export default SupplementsFeed;
