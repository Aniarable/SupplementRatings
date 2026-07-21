import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { Link as MuiLink } from '@mui/material';
import { usePageMeta } from '../hooks/usePageMeta';

const Section = ({ title, children }) => (
    <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
        </Typography>
        {children}
    </Box>
);

export default function PrivacyPage() {
    usePageMeta({ title: 'Privacy Policy | SupplementRatings', description: 'Learn how SupplementRatings collects, uses, and protects your personal information. Your privacy matters to us.' });
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Privacy Policy
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Last updated: April 2026
            </Typography>

            <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>

                <Section title="1. Overview">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        SupplementRatings ("we", "us", "our") is committed to protecting your
                        privacy. This Privacy Policy explains what information we collect, how we
                        use it, and your rights regarding that information. By using our Site, you
                        agree to the practices described here.
                    </Typography>
                </Section>

                <Section title="2. Information We Collect">
                    <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                        Information you provide directly:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                        {[
                            'Account information: username, email address, and password (stored as a secure hash)',
                            'Profile information: optional profile image',
                            'Content you submit: supplement reviews, ratings, comments, dosage information, and health conditions you choose to share',
                        ].map((item) => (
                            <Typography component="li" variant="body1" key={item} sx={{ mb: 0.75, lineHeight: 1.8 }}>
                                {item}
                            </Typography>
                        ))}
                    </Box>
                    <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                        Information collected automatically:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                        {[
                            'Authentication tokens stored in your browser (used to keep you logged in)',
                            'Basic server logs (IP address, browser type, pages visited) for security and debugging purposes',
                        ].map((item) => (
                            <Typography component="li" variant="body1" key={item} sx={{ mb: 0.75, lineHeight: 1.8 }}>
                                {item}
                            </Typography>
                        ))}
                    </Box>
                </Section>

                <Section title="3. How We Use Your Information">
                    <Box component="ul" sx={{ pl: 3 }}>
                        {[
                            'To provide and operate the Site, including displaying your reviews and profile',
                            'To authenticate your account and maintain your session',
                            'To send transactional emails (e.g., email verification, password reset)',
                            'To respond to support requests submitted through our contact form',
                            'To monitor for abuse, spam, and violations of our Terms of Service',
                            'To improve the Site based on aggregate usage patterns',
                        ].map((item) => (
                            <Typography component="li" variant="body1" key={item} sx={{ mb: 0.75, lineHeight: 1.8 }}>
                                {item}
                            </Typography>
                        ))}
                    </Box>
                </Section>

                <Section title="4. Health Information">
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                        When you write a review, you may choose to share health-related information
                        such as conditions you are addressing or side effects you experienced. This
                        information is voluntarily submitted by you and is displayed publicly on the
                        Site as part of your review.
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        We do not sell this information, use it for targeted advertising, or share
                        it with healthcare providers or insurers.
                    </Typography>
                </Section>

                <Section title="5. Sharing Your Information">
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                        We do not sell, rent, or trade your personal information to third parties.
                        We may share information in the following limited circumstances:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                        {[
                            'With service providers who help us operate the Site (e.g., hosting, email delivery), under confidentiality obligations',
                            'If required by law, court order, or governmental authority',
                            'To protect the safety of users or the public, or to enforce our Terms of Service',
                        ].map((item) => (
                            <Typography component="li" variant="body1" key={item} sx={{ mb: 0.75, lineHeight: 1.8 }}>
                                {item}
                            </Typography>
                        ))}
                    </Box>
                </Section>

                <Section title="6. Amazon Associates Program">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        This Site contains affiliate links to Amazon.com. When you click these
                        links, Amazon may place cookies on your browser to track purchases for
                        commission purposes. Amazon's data practices are governed by{' '}
                        <MuiLink
                            href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ"
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                        >
                            Amazon's Privacy Notice
                        </MuiLink>.
                        We do not receive or store any personal information from Amazon as a result
                        of these clicks.
                    </Typography>
                </Section>

                <Section title="7. Data Retention">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        We retain your account data for as long as your account is active. If you
                        delete your account, we will remove your personal information from our
                        active systems within a reasonable period. Reviews and comments you
                        submitted may be anonymized rather than deleted to preserve the integrity
                        of the community data.
                    </Typography>
                </Section>

                <Section title="8. Your Rights">
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                        Depending on your location, you may have the right to:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                        {[
                            'Access the personal data we hold about you',
                            'Request correction of inaccurate data',
                            'Request deletion of your data',
                            'Opt out of certain data uses',
                        ].map((item) => (
                            <Typography component="li" variant="body1" key={item} sx={{ mb: 0.75, lineHeight: 1.8 }}>
                                {item}
                            </Typography>
                        ))}
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        To exercise these rights, contact us at{' '}
                        <MuiLink href="mailto:supplementratings.contact@gmail.com" underline="hover">
                            supplementratings.contact@gmail.com
                        </MuiLink>.
                        We will respond within 30 days.
                    </Typography>
                </Section>

                <Section title="9. Security">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        We use industry-standard practices to protect your data, including encrypted
                        HTTPS connections and hashed password storage. No method of transmission or
                        storage is 100% secure, and we cannot guarantee absolute security.
                    </Typography>
                </Section>

                <Section title="10. Children's Privacy">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        The Site is not directed at children under 18. We do not knowingly collect
                        personal information from anyone under 18. If you believe a minor has
                        provided us personal information, please contact us and we will delete it.
                    </Typography>
                </Section>

                <Section title="11. Changes to This Policy">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        We may update this Privacy Policy from time to time. We will post the
                        updated policy on this page with a revised "Last updated" date. Continued
                        use of the Site after changes are posted constitutes your acceptance.
                    </Typography>
                </Section>

                <Section title="12. Contact">
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Questions or concerns about this Privacy Policy? Contact us at{' '}
                        <MuiLink href="mailto:supplementratings.contact@gmail.com" underline="hover">
                            supplementratings.contact@gmail.com
                        </MuiLink>.
                    </Typography>
                </Section>

            </Paper>
        </Container>
    );
}
