import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { Link as MuiLink } from '@mui/material';

const Section = ({ title, children }) => (
    <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
        </Typography>
        {children}
    </Box>
);

export default function TermsPage() {
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Terms of Service
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Last updated: April 2026
            </Typography>

            <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>

                <Section title="1. Acceptance of Terms">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        By accessing or using SupplementRatings ("the Site"), you agree to be bound
                        by these Terms of Service. If you do not agree, please do not use the Site.
                        We may update these terms at any time. Continued use of the Site after
                        changes are posted constitutes your acceptance of the updated terms.
                    </Typography>
                </Section>

                <Section title="2. Medical Disclaimer — Please Read Carefully">
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                        <strong>Nothing on SupplementRatings constitutes medical advice.</strong> All
                        content on this Site — including reviews, ratings, supplement descriptions,
                        comments, and any other user-generated content — is provided for
                        informational and entertainment purposes only. It is not a substitute for
                        professional medical advice, diagnosis, or treatment.
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                        Never disregard professional medical advice or delay seeking it because of
                        something you have read on this Site. Always consult a qualified healthcare
                        provider before starting, stopping, or changing any supplement, medication,
                        or health regimen. Supplements may interact with prescription medications or
                        be contraindicated for certain health conditions.
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        SupplementRatings does not endorse any specific supplement, brand, or health
                        claim made by users on this Site. User reviews represent individual opinions
                        and personal experiences only.
                    </Typography>
                </Section>

                <Section title="3. User Accounts">
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                        You must be at least 18 years old to create an account. You are responsible
                        for maintaining the confidentiality of your account credentials and for all
                        activity that occurs under your account. You agree to notify us immediately
                        of any unauthorized use of your account.
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        We reserve the right to suspend or terminate accounts that violate these
                        Terms or that we determine, in our sole discretion, are harmful to other
                        users or to the Site.
                    </Typography>
                </Section>

                <Section title="4. User-Generated Content">
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                        When you post a review, comment, or any other content on the Site, you
                        grant SupplementRatings a non-exclusive, royalty-free, worldwide license
                        to display, distribute, and use that content in connection with operating
                        the Site.
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                        You agree not to post content that:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                        {[
                            'Is false, misleading, or fraudulent',
                            'Constitutes medical advice or claims to diagnose, treat, cure, or prevent any disease',
                            'Infringes on any third-party intellectual property rights',
                            'Is defamatory, harassing, abusive, or otherwise harmful',
                            'Violates any applicable law or regulation',
                            'Contains spam, advertisements, or promotional material without our consent',
                        ].map((item) => (
                            <Typography component="li" variant="body1" key={item} sx={{ mb: 0.75, lineHeight: 1.8 }}>
                                {item}
                            </Typography>
                        ))}
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        We reserve the right to remove any content that violates these rules or that
                        we determine is inappropriate, without notice.
                    </Typography>
                </Section>

                <Section title="5. Amazon Affiliate Disclosure">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        SupplementRatings participates in the Amazon Services LLC Associates Program.
                        "Buy on Amazon" links on this Site are affiliate links. If you click a link
                        and make a purchase, we may earn a commission at no additional cost to you.
                        This relationship does not influence our content, ratings, or the supplements
                        we display.
                    </Typography>
                </Section>

                <Section title="6. Intellectual Property">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        The SupplementRatings name, logo, and site design are owned by us. You may
                        not reproduce, distribute, or create derivative works from any part of the
                        Site without our express written permission. User-submitted reviews remain
                        the intellectual property of their authors, subject to the license granted
                        in Section 4.
                    </Typography>
                </Section>

                <Section title="7. Limitation of Liability">
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                        To the fullest extent permitted by law, SupplementRatings and its operators
                        shall not be liable for any indirect, incidental, special, consequential, or
                        punitive damages arising from your use of the Site or reliance on any content
                        found here, including but not limited to health outcomes resulting from
                        supplement use.
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        The Site is provided "as is" without warranties of any kind, express or
                        implied. We do not warrant that the Site will be error-free, uninterrupted,
                        or free of harmful components.
                    </Typography>
                </Section>

                <Section title="8. Third-Party Links">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        The Site contains links to third-party websites, including Amazon.com. We
                        are not responsible for the content, privacy practices, or terms of any
                        third-party site. Visiting linked sites is at your own risk.
                    </Typography>
                </Section>

                <Section title="9. Governing Law">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        These Terms are governed by and construed in accordance with the laws of the
                        United States. Any disputes shall be resolved in a court of competent
                        jurisdiction in the applicable jurisdiction.
                    </Typography>
                </Section>

                <Section title="10. Contact">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Questions about these Terms? Contact us at{' '}
                        <MuiLink href="mailto:supplementratings.contact@gmail.com" underline="hover">
                            supplementratings.contact@gmail.com
                        </MuiLink>.
                    </Typography>
                </Section>

            </Paper>
        </Container>
    );
}
