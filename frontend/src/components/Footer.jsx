import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
                py: 4,
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}
        >
            <Container maxWidth="lg">
                {/* Affiliate disclosure — required by Amazon Associates */}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mb: 2.5, lineHeight: 1.7 }}
                >
                    SupplementRatings is a participant in the Amazon Services LLC Associates Program,
                    an affiliate advertising program designed to provide a means for sites to earn
                    advertising fees by advertising and linking to Amazon.com. As an Amazon Associate
                    we earn from qualifying purchases.
                </Typography>

                <Divider sx={{ mb: 2.5 }} />

                {/* Medical disclaimer */}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mb: 2.5, lineHeight: 1.7 }}
                >
                    <strong>Medical Disclaimer:</strong> Nothing on SupplementRatings constitutes
                    medical advice. Reviews and ratings represent individual opinions only. Always
                    consult a qualified healthcare provider before starting any supplement.
                </Typography>

                {/* Footer links */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 3 }, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 3 } }}>
                        <MuiLink component={RouterLink} to="/about" underline="hover" variant="caption" color="text.secondary">
                            About
                        </MuiLink>
                        <MuiLink component={RouterLink} to="/terms" underline="hover" variant="caption" color="text.secondary">
                            Terms of Service
                        </MuiLink>
                        <MuiLink component={RouterLink} to="/privacy" underline="hover" variant="caption" color="text.secondary">
                            Privacy Policy
                        </MuiLink>
                        <MuiLink component={RouterLink} to="/contact" underline="hover" variant="caption" color="text.secondary">
                            Contact
                        </MuiLink>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        &copy; {new Date().getFullYear()} SupplementRatings
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
