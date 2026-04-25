import React from 'react';
import { Container, Typography, Box, Divider, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

export default function AboutPage() {
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                About SupplementRatings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Last updated: April 2026
            </Typography>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    What We Are
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                    SupplementRatings is a community-driven platform where real people share their
                    experiences with dietary supplements. Our goal is to make it easier to cut
                    through marketing claims and find out what supplements have actually done
                    for people like you.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    Every review on this site comes from a registered user sharing their personal
                    experience. We don't sell supplements, we don't manufacture them, and we have
                    no financial relationship with any supplement brand. Our only monetization is
                    through the Amazon Associates program, which helps keep the site running.
                </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    How It Works
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                    Browse supplements by name, category, or intended purpose. Each supplement page
                    shows aggregated ratings and individual reviews from our community. You can filter
                    by the condition you're looking to address, the dosage people used, and how
                    frequently they took it.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    Create a free account to write your own reviews. When you review a supplement,
                    you can share your dosage, the condition you were addressing, any benefits you
                    experienced, and any side effects. The more detail you share, the more useful
                    your review is to others.
                </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Important Disclaimer
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }}>
                    Nothing on SupplementRatings is medical advice. The reviews, ratings, and
                    supplement descriptions on this site represent personal opinions and general
                    informational content only. They are not a substitute for advice from a licensed
                    healthcare provider.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                    Before starting any supplement, especially if you have a health condition or
                    take prescription medications, consult your doctor or pharmacist. Supplements
                    can interact with medications and may not be appropriate for everyone.
                </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Amazon Affiliate Disclosure
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    SupplementRatings is a participant in the Amazon Services LLC Associates Program,
                    an affiliate advertising program designed to provide a means for sites to earn
                    advertising fees by advertising and linking to Amazon.com. When you click a
                    "Buy on Amazon" link and make a purchase, we may earn a small commission at no
                    additional cost to you. This does not influence our content or the order in which
                    supplements are shown.
                </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Contact Us
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    Questions, feedback, or concerns? Reach us at{' '}
                    <MuiLink href="mailto:supplementratings.contact@gmail.com" underline="hover">
                        supplementratings.contact@gmail.com
                    </MuiLink>{' '}
                    or use the{' '}
                    <MuiLink component={RouterLink} to="/contact" underline="hover">
                        Contact page
                    </MuiLink>.
                </Typography>
            </Paper>
        </Container>
    );
}
