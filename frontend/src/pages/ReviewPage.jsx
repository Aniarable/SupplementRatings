// pages/ReviewPage.jsx
// Standalone page for a single review + full comment thread.

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Link as MuiLink,
    Paper,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getRating, upvoteRating } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ReviewDetail from '../components/ReviewDetail';

const AMAZON_BASE = 'https://www.amazon.com/s?linkCode=ll2&tag=supplementrat-20&language=en_US&ref_=as_li_ss_tl&k=';

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

    const amazonHref = AMAZON_BASE + encodeURIComponent(rating.supplement_display);

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>

                {/* Phantom left spacer — mirrors sidebar width to keep review centered */}
                <Box sx={{ width: 240, flexShrink: 0, display: { xs: 'none', md: 'block' } }} />

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
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2.5 }}>
                            Check prices and reviews on Amazon
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
                            As an Amazon Associate we earn from qualifying purchases.
                        </Typography>
                    </Paper>
                </Box>

            </Box>
        </Container>
    );
}
