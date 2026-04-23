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
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getRating, upvoteRating } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ReviewDetail from '../components/ReviewDetail';
import AmazonLink from '../components/AmazonLink';

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

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            {/* Nav bar */}
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
                <AmazonLink supplementName={rating.supplement_display} />
            </Box>

            <ReviewDetail
                rating={rating}
                onBack={() => navigate(-1)}
                onEditRating={handleEditRating}
                onCommentAdded={handleCommentAdded}
                onUpvoteRating={handleUpvoteRating}
            />
        </Container>
    );
}
