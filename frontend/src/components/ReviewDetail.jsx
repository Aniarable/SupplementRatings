import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    TextField,
    Rating as MuiRating,
    IconButton,
    Avatar,
    Divider,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReplyIcon from '@mui/icons-material/Reply';
import { addComment, updateComment, upvoteRating, upvoteComment, deleteMyRating, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ImageModal from './ImageModal';
import ReviewTagChips from './ReviewTagChips';
import { DEFAULT_PROFILE_IMAGE_URL } from '../config';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
};

// ─── Compact comment row ───────────────────────────────────────────────────────
function CommentRow({ comment, currentUser, onEdit, onUpvote, onDownvote, onReply, onDelete, depth = 0 }) {
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content ?? '');
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [repliesOpen, setRepliesOpen] = useState(false);

    const isOwn = currentUser && (currentUser.id === comment.user?.id || currentUser.username === comment.user?.username);
    const canVote = currentUser && !isOwn;

    const handleSaveEdit = async () => {
        try {
            await onEdit(comment.id, editText);
            setEditing(false);
        } catch {
            toast.error('Failed to save edit');
        }
    };

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        await onReply(comment, replyText.trim());
        setReplyText('');
        setReplyOpen(false);
        setRepliesOpen(true); // auto-open so the new reply is visible
    };

    return (
        <Box sx={{ display: 'flex', gap: 1, mb: 1.25, pl: depth > 0 ? 2.5 : 0 }}>
            {depth > 0 && (
                <Box sx={{ width: 2, flexShrink: 0, bgcolor: 'divider', borderRadius: 1, alignSelf: 'stretch', mt: 0.5 }} />
            )}
            <RouterLink to={`/profile/${comment.user?.username}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <Avatar
                    src={comment.user?.profile_image_url || DEFAULT_PROFILE_IMAGE_URL}
                    alt={comment.user?.username}
                    sx={{ width: 24, height: 24 }}
                />
            </RouterLink>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Meta row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 0.25 }}>
                    <RouterLink to={`/profile/${comment.user?.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="caption" fontWeight={700} sx={{ '&:hover': { textDecoration: 'underline' } }}>
                            {comment.user?.username}
                        </Typography>
                    </RouterLink>
                    <Typography variant="caption" color="text.disabled">{formatDate(comment.created_at)}</Typography>
                    {comment.is_edited && <Typography variant="caption" color="text.disabled">(edited)</Typography>}
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.25 }}>
                        <IconButton size="small" sx={{ p: 0.25 }} onClick={() => canVote && onUpvote(comment)} color={comment.has_upvoted ? 'primary' : 'default'} disabled={!canVote}>
                            <ThumbUpIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                        <Typography variant="caption" color="text.secondary">{comment.upvotes ?? 0}</Typography>
                        <IconButton size="small" sx={{ p: 0.25 }} onClick={() => canVote && onDownvote(comment)} color={comment.has_downvoted ? 'error' : 'default'} disabled={!canVote}>
                            <ThumbDownIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                        <Typography variant="caption" color="text.secondary">{comment.downvotes ?? 0}</Typography>
                        {currentUser && !isOwn && (
                            <Button size="small" sx={{ minWidth: 0, px: 0.5, fontSize: '0.68rem' }} onClick={() => setReplyOpen(v => !v)}>
                                Reply
                            </Button>
                        )}
                        {isOwn && !editing && (
                            <Button size="small" sx={{ minWidth: 0, px: 0.5, fontSize: '0.68rem' }} onClick={() => setEditing(true)}>
                                Edit
                            </Button>
                        )}
                        {isOwn && !editing && (
                            <Button size="small" color="error" sx={{ minWidth: 0, px: 0.5, fontSize: '0.68rem' }} onClick={() => onDelete && onDelete(comment.id)}>
                                Delete
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Content */}
                {editing ? (
                    <Box sx={{ mt: 0.5 }}>
                        <TextField size="small" fullWidth multiline value={editText} onChange={e => setEditText(e.target.value)} sx={{ mb: 0.5 }} />
                        <Button size="small" variant="contained" onClick={handleSaveEdit} sx={{ mr: 0.5 }}>Save</Button>
                        <Button size="small" onClick={() => setEditing(false)}>Cancel</Button>
                    </Box>
                ) : (
                    <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                    </Typography>
                )}

                {/* Inline reply box */}
                {replyOpen && (
                    <Box component="form" onSubmit={handleSubmitReply} sx={{ mt: 0.75, display: 'flex', gap: 0.75, alignItems: 'flex-start' }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder={`Reply to ${comment.user?.username}…`}
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            autoFocus
                        />
                        <Button size="small" variant="contained" type="submit" disabled={!replyText.trim()}>Post</Button>
                        <Button size="small" onClick={() => setReplyOpen(false)}>Cancel</Button>
                    </Box>
                )}

                {/* Replies toggle */}
                {(comment.replies || []).length > 0 && (
                    <Button
                        size="small"
                        sx={{ fontSize: '0.68rem', px: 0.5, minWidth: 0, mt: 0.25, display: 'block' }}
                        onClick={() => setRepliesOpen(v => !v)}
                    >
                        {repliesOpen
                            ? 'Hide replies'
                            : `View ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
                    </Button>
                )}

                {/* Nested replies (collapsed by default) */}
                {repliesOpen && (comment.replies || []).map(reply => (
                    <CommentRow
                        key={reply.id}
                        comment={reply}
                        currentUser={currentUser}
                        onEdit={onEdit}
                        onUpvote={onUpvote}
                        onDownvote={onDownvote}
                        onReply={onReply}
                        onDelete={onDelete}
                        depth={depth + 1}
                    />
                ))}
            </Box>
        </Box>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────
function ReviewDetail({ rating, onBack, onCommentAdded, onEditRating, onRatingDeleted }) {
    const { user: currentUser } = useAuth();
    const location = useLocation();
    const [currentRating, setCurrentRating] = useState(rating);
    const [newComment, setNewComment] = useState('');
    const [isImageModalOpen, setImageModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

    useEffect(() => {
        setCurrentRating(rating);
    }, [rating]);

    // ── Voting on the review ────────────────────────────────────────────────
    const handleVoteRating = async (voteType) => {
        if (!currentUser) { toast.error('Log in to vote'); return; }
        if (currentRating.user?.id === currentUser.id) { toast.error('Cannot vote on your own review'); return; }
        try {
            const res = await upvoteRating(currentRating.id, voteType);
            setCurrentRating(prev => ({ ...prev, upvotes: res.upvotes_count, downvotes: res.downvotes_count, has_upvoted: res.has_upvoted, has_downvoted: res.has_downvoted }));
        } catch {
            toast.error('Failed to vote');
        }
    };

    const handleDeleteRating = async () => {
        if (!window.confirm('Delete this review? This cannot be undone.')) return;
        try {
            await deleteMyRating(currentRating.id);
            toast.success('Review deleted');
            if (onRatingDeleted) onRatingDeleted();
        } catch {
            toast.error('Failed to delete review');
        }
    };

    // ── Voting on comments ──────────────────────────────────────────────────
    const patchCommentInTree = (comments, id, patch) =>
        comments.map(c => {
            if (c.id === id) return { ...c, ...patch };
            if (c.replies?.length) return { ...c, replies: patchCommentInTree(c.replies, id, patch) };
            return c;
        });

    const handleVoteComment = async (comment, voteType) => {
        if (!currentUser) { toast.error('Log in to vote'); return; }
        if (comment.user?.id === currentUser.id) { toast.error('Cannot vote on your own comment'); return; }
        try {
            const res = await upvoteComment(comment.id, voteType);
            setCurrentRating(prev => ({
                ...prev,
                comments: patchCommentInTree(prev.comments || [], comment.id, {
                    upvotes: res.upvotes,
                    downvotes: res.downvotes,
                    has_upvoted: res.has_upvoted,
                    has_downvoted: res.has_downvoted,
                }),
            }));
        } catch {
            toast.error('Failed to vote');
        }
    };

    // ── Editing comments ────────────────────────────────────────────────────
    const handleCommentEdit = async (commentId, newContent) => {
        const updated = await updateComment(commentId, newContent);
        setCurrentRating(prev => ({
            ...prev,
            comments: patchCommentInTree(prev.comments || [], commentId, updated),
        }));
        toast.success('Comment updated');
    };

    // ── Adding comments / replies ───────────────────────────────────────────
    const addCommentToTree = (comments, parentId, newReply) =>
        comments.map(c => {
            if (c.id === parentId) return { ...c, replies: [...(c.replies || []), newReply] };
            if (c.replies?.length) return { ...c, replies: addCommentToTree(c.replies, parentId, newReply) };
            return c;
        });

    const handleSubmitTopLevel = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const formData = new FormData();
            formData.append('rating', currentRating.id);
            formData.append('content', newComment.trim());
            const res = await addComment(formData);
            setCurrentRating(prev => ({ ...prev, comments: [...(prev.comments || []), { ...res, replies: [] }] }));
            setNewComment('');
            if (onCommentAdded) onCommentAdded(res);
            toast.success('Comment added!');
        } catch {
            toast.error('Failed to add comment');
        }
    };

    const handleReply = async (parentComment, text) => {
        try {
            const formData = new FormData();
            formData.append('rating', currentRating.id);
            formData.append('parent_comment', parentComment.id);
            formData.append('content', text);
            const res = await addComment(formData);
            setCurrentRating(prev => ({
                ...prev,
                comments: addCommentToTree(prev.comments || [], parentComment.id, { ...res, replies: [] }),
            }));
            if (onCommentAdded) onCommentAdded(res);
        } catch {
            toast.error('Failed to add reply');
        }
    };

    const removeCommentFromTree = (comments, id) =>
        comments.reduce((acc, c) => {
            if (c.id === id) return acc;
            return [...acc, { ...c, replies: removeCommentFromTree(c.replies || [], id) }];
        }, []);

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await deleteComment(commentId);
            setCurrentRating(prev => ({
                ...prev,
                comments: removeCommentFromTree(prev.comments || [], commentId),
            }));
            toast.success('Comment deleted');
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    if (!currentRating?.user) return null;

    const isOwnReview = currentUser && currentUser.id === currentRating.user.id;
    const canVoteReview = currentUser && !isOwnReview;

    return (
        <Box>
            {/* ── Review card ── */}
            <Box sx={{ mb: 2 }}>
                {currentRating.title && (
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, lineHeight: 1.3 }}>
                        {currentRating.title}
                    </Typography>
                )}

                {/* Meta: avatar · username · stars · date · votes · edit */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 0.75 }}>
                    <RouterLink to={`/profile/${currentRating.user.username}`} style={{ textDecoration: 'none' }}>
                        <Avatar src={currentRating.user.profile_image_url || DEFAULT_PROFILE_IMAGE_URL} alt={currentRating.user.username} sx={{ width: 26, height: 26 }} />
                    </RouterLink>
                    <RouterLink to={`/profile/${currentRating.user.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="caption" fontWeight={700} sx={{ '&:hover': { textDecoration: 'underline' } }}>
                            {currentRating.user.username}
                        </Typography>
                    </RouterLink>
                    <MuiRating value={currentRating.score} readOnly size="small" precision={0.5} />
                    <Typography variant="caption" color="text.secondary">{formatDate(currentRating.created_at)}</Typography>
                    {currentRating.is_edited && <Typography variant="caption" color="text.disabled">(edited)</Typography>}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, ml: 'auto' }}>
                        <IconButton size="small" sx={{ p: 0.25 }} onClick={() => handleVoteRating('up')} color={currentRating.has_upvoted ? 'primary' : 'default'} disabled={!canVoteReview}>
                            <ThumbUpIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        <Typography variant="caption">{currentRating.upvotes ?? 0}</Typography>
                        <IconButton size="small" sx={{ p: 0.25 }} onClick={() => handleVoteRating('down')} color={currentRating.has_downvoted ? 'error' : 'default'} disabled={!canVoteReview}>
                            <ThumbDownIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        <Typography variant="caption">{currentRating.downvotes ?? 0}</Typography>
                        {isOwnReview && onEditRating && (
                            <Button size="small" sx={{ ml: 0.5, fontSize: '0.72rem' }} onClick={() => onEditRating(currentRating)}>
                                Edit
                            </Button>
                        )}
                        {isOwnReview && (
                            <Button size="small" color="error" sx={{ ml: 0.5, fontSize: '0.72rem' }} onClick={handleDeleteRating}>
                                Delete
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Tags */}
                <ReviewTagChips
                    conditionNames={currentRating.condition_names}
                    benefitNames={currentRating.benefit_names}
                    sideEffectNames={currentRating.side_effect_names}
                />

                {/* Review text */}
                {currentRating.comment && (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 0.75 }}>
                        {currentRating.comment}
                    </Typography>
                )}

                {/* Dosage / brands */}
                {(currentRating.dosage || currentRating.brands) && (
                    <Typography variant="caption" color="text.disabled">
                        {currentRating.dosage}
                        {currentRating.dosage_frequency && currentRating.frequency_unit
                            ? ` · ${currentRating.dosage_frequency}x/${currentRating.frequency_unit}` : ''}
                        {currentRating.brands ? ` · ${currentRating.brands}` : ''}
                    </Typography>
                )}

                {/* Image */}
                {currentRating.image_url && (
                    <Box sx={{ mt: 1 }}>
                        <Box
                            component="img"
                            src={currentRating.image_url}
                            alt="Review attachment"
                            onClick={() => { setModalImageUrl(currentRating.image_url); setImageModalOpen(true); }}
                            sx={{ maxHeight: 200, maxWidth: '100%', borderRadius: 1, objectFit: 'contain', cursor: 'pointer' }}
                        />
                    </Box>
                )}
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            {/* ── Comment form ── */}
            {currentUser && (
                <Box component="form" onSubmit={handleSubmitTopLevel} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start' }}>
                    <Avatar src={currentUser.profile_image_url || DEFAULT_PROFILE_IMAGE_URL} alt={currentUser.username} sx={{ width: 24, height: 24, flexShrink: 0, mt: 0.5 }} />
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Add a comment…"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        multiline
                        maxRows={4}
                    />
                    <Button type="submit" variant="contained" size="small" disabled={!newComment.trim()} sx={{ flexShrink: 0, mt: 0.5 }}>
                        Post
                    </Button>
                </Box>
            )}

            {/* ── Comments ── */}
            {(currentRating.comments || []).length === 0 ? (
                <Typography variant="caption" color="text.disabled">No comments yet — be the first.</Typography>
            ) : (
                <Box>
                    {(currentRating.comments || []).map(comment => (
                        <CommentRow
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            onEdit={handleCommentEdit}
                            onUpvote={c => handleVoteComment(c, 'up')}
                            onDownvote={c => handleVoteComment(c, 'down')}
                            onReply={handleReply}
                            onDelete={handleDeleteComment}
                            depth={0}
                        />
                    ))}
                </Box>
            )}

            {modalImageUrl && (
                <ImageModal imageUrl={modalImageUrl} onClose={() => setImageModalOpen(false)} open={isImageModalOpen} />
            )}
        </Box>
    );
}

export default ReviewDetail;
