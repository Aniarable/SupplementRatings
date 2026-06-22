// pages/ReviewPage.jsx
// Standalone page for a single review + full comment thread.

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Link as MuiLink,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShareIcon from '@mui/icons-material/Share';
import { getRating, upvoteRating } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ReviewDetail from '../components/ReviewDetail';
import { buildAmazonSearchUrl } from '../config';

export default function ReviewPage() {
    const { ratingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRating = useCallback(async () => {
        try {
            const data = await getRating(ratingId);
            setRating(data);
        } catch {
            toast.error('Review not found');
            navigate('/feed', { replace: true });
        } finally {
            setLoading(false);
        }
    }, [ratingId, navigate]);

    useEffect(() => {
        fetchRating();
    }, [fetchRating]);

    // Must be called unconditionally (before any early returns)
    const pageTitle = rating
        ? (rating.title ? `${rating.title} | SupplementRatings` : `${rating.user?.username}'s ${rating.supplement_display} Review | SupplementRatings`)
        : null;
    const metaDesc = rating
        ? `${rating.user?.username} rated ${rating.supplement_display} ${rating.score}/5 stars.${rating.comment ? ' ' + rating.comment.slice(0, 130) : ''}`
        : null;
    const jsonLd = rating ? {
        '@context': 'https://schema.org',
        '@type': 'Review',
        name: rating.title || `${rating.user?.username}'s review of ${rating.supplement_display}`,
        author: { '@type': 'Person', name: rating.user?.username },
        itemReviewed: { '@type': 'Product', name: rating.supplement_display },
        reviewRating: { '@type': 'Rating', ratingValue: rating.score, bestRating: 5, worstRating: 1 },
        reviewBody: rating.comment || '',
        datePublished: rating.created_at?.split('T')[0],
    } : null;
    usePageMeta({ title: pageTitle, description: metaDesc, ldJson: jsonLd });

    const handleCommentAdded = async () => {
        const updated = await getRating(ratingId);
        setRating(updated);
        toast.success('Comment added!');
    };

    const handleUpvoteRating = async (r) => {
        try {
            const response = await upvoteRating(r.id);
            setRating(prev => ({
                ...prev,
                upvotes: response.upvotes_count,
                downvotes: response.downvotes_count,
                has_upvoted: response.has_upvoted,
                has_downvoted: response.has_downvoted,
            }));
        } catch {
            toast.error('Failed to vote');
        }
    };

    // Editing isn't housed here — send user to the supplement page where the form lives.
    const handleEditRating = () => {
        navigate(`/supplements/${rating.supplement}`, {
            state: { ratingId: rating.id, openEditMode: true },
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!rating) return null;

    const amazonHref = buildAmazonSearchUrl(rating.supplement_display);
    const pageUrl = window.location.href;

    const handleShare = (platform) => {
        const encoded = encodeURIComponent(pageUrl);
        const text = encodeURIComponent(rating.title || `${rating.supplement_display} review on SupplementRatings`);
        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encoded}`, '_blank', 'noopener');
        } else if (platform === 'reddit') {
            window.open(`https://www.reddit.com/submit?url=${encoded}&title=${text}`, '_blank', 'noopener');
        } else {
            navigator.clipboard.writeText(pageUrl).then(() => toast.success('Link copied!')).catch(() => toast.error('Copy failed'));
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>

                {/* Left spacer — partial balance against sidebar */}
                <Box sx={{ width: 120, flexShrink: 0, display: { xs: 'none', md: 'block' } }} />

                {/* Main content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                        <Button
                            size="small"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                            Review of{' '}
                            <MuiLink
                                component={RouterLink}
                                to={`/supplements/${rating.supplement}`}
                                underline="hover"
                            >
                                {rating.supplement_display}
                            </MuiLink>
                        </Typography>
                    </Box>

                    <ReviewDetail
                        rating={rating}
                        onBack={() => navigate(-1)}
                        onEditRating={handleEditRating}
                        onCommentAdded={handleCommentAdded}
                        onUpvoteRating={handleUpvoteRating}
                        onRatingDeleted={() => navigate('/feed', { replace: true })}
                    />
                </Box>

                {/* Right sidebar — desktop only */}
                <Box sx={{
                    width: 240,
                    flexShrink: 0,
                    position: 'sticky',
                    top: 80,
                    display: { xs: 'none', md: 'block' },
                }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(160deg, #fffdf9 0%, #fff 100%)',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, lineHeight: 1.3 }}>
                            {rating.supplement_display}
                        </Typography>
                        <Button
                            href={amazonHref}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            component="a"
                            fullWidth
                            variant="outlined"
                            endIcon={<OpenInNewIcon sx={{ fontSize: 15 }} />}
                            sx={{
                                color: '#c07a0a',
                                borderColor: '#c07a0a',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    color: '#e47911',
                                    borderColor: '#e47911',
                                    bgcolor: '#fff8f0',
                                },
                            }}
                        >
                            Buy on Amazon
                        </Button>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5, lineHeight: 1.5 }}>
                            Using our link costs you nothing extra and helps keep this site free.
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" sx={{ mb: 1 }}>
                            Share this review
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Tooltip title="Share on X / Twitter">
                                <Button size="small" variant="outlined" onClick={() => handleShare('twitter')} sx={{ minWidth: 0, px: 1.25, fontSize: '0.72rem', textTransform: 'none' }}>
                                    X / Twitter
                                </Button>
                            </Tooltip>
                            <Tooltip title="Share on Reddit">
                                <Button size="small" variant="outlined" onClick={() => handleShare('reddit')} sx={{ minWidth: 0, px: 1.25, fontSize: '0.72rem', textTransform: 'none' }}>
                                    Reddit
                                </Button>
                            </Tooltip>
                            <Tooltip title="Copy link">
                                <Button size="small" variant="outlined" startIcon={<ShareIcon sx={{ fontSize: 14 }} />} onClick={() => handleShare('copy')} sx={{ minWidth: 0, px: 1.25, fontSize: '0.72rem', textTransform: 'none' }}>
                                    Copy
                                </Button>
                            </Tooltip>
                        </Box>
                    </Paper>
                </Box>

            </Box>
        </Container>
    );
}
