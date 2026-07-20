import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/api';
import { Container, Paper, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

function EmailVerification() {
    const [verifying, setVerifying] = useState(true);
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                const data = await verifyEmail(token);
                toast.success(data?.message || 'Email verified successfully! You can now login.');
                setTimeout(() => navigate('/login'), 2000);
            } catch (error) {
                const msg = error.data?.error || error.message || 'Verification failed';
                if (msg.toLowerCase().includes('already been used')) {
                    toast.success('Your email is already verified. You can log in!');
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    toast.error(msg);
                }
            } finally {
                setVerifying(false);
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
                {verifying ? (
                    <>
                        <CircularProgress sx={{ mb: 2 }} />
                        <Typography>Verifying your email...</Typography>
                    </>
                ) : (
                    <Typography>
                        Redirecting to login page...
                    </Typography>
                )}
            </Paper>
        </Container>
    );
}

export default EmailVerification; 