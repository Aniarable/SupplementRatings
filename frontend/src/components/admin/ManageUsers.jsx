import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, TextField, InputAdornment,
    CircularProgress, Alert, Pagination, Chip, Table,
    TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { getAdminUsers } from '../../services/api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const PAGE_SIZE = 20;

    const fetchUsers = useCallback(async (currentPage, search) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = { page: currentPage, page_size: PAGE_SIZE };
            if (search) params.search = search;
            const data = await getAdminUsers(params);
            setUsers(data.results || []);
            setCount(data.count || 0);
        } catch (err) {
            setError('Failed to load users.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(page, searchTerm); }, [page, searchTerm, fetchUsers]);

    const handleSearch = (e) => { setSearchTerm(e.target.value); setPage(1); };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>All Reviewers</Typography>
            <TextField
                label="Search by username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            />
            {isLoading && <CircularProgress size={20} sx={{ mb: 1 }} />}
            {error && !isLoading && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Username</strong></TableCell>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell><strong>Joined</strong></TableCell>
                        <TableCell align="center"><strong>Reviews</strong></TableCell>
                        <TableCell align="center"><strong>Status</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((u) => (
                        <TableRow key={u.id} hover>
                            <TableCell>
                                <Link to={`/profile/${u.username}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>
                                    {u.username}
                                </Link>
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{u.email || '—'}</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{u.date_joined}</TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={u.review_count}
                                    size="small"
                                    color={u.review_count > 0 ? 'primary' : 'default'}
                                    variant={u.review_count > 0 ? 'filled' : 'outlined'}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={u.is_active ? 'Active' : 'Unverified'}
                                    size="small"
                                    color={u.is_active ? 'success' : 'warning'}
                                    variant="outlined"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                    {users.length === 0 && !isLoading && (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {count > PAGE_SIZE && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination count={Math.ceil(count / PAGE_SIZE)} page={page} onChange={(_, v) => setPage(v)} color="primary" />
                </Box>
            )}
        </Paper>
    );
};

export default ManageUsers;
