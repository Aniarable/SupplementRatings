// frontend/src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

function Home() {
  usePageMeta({
    title: 'SupplementRatings - Real Supplement Reviews from Real People',
    description: 'Find honest, community-driven supplement reviews and ratings. Compare supplements, read real user experiences, and make informed health decisions.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SupplementRatings',
      url: 'https://supplementratings.com',
      description: 'Community-driven supplement reviews and ratings platform.',
    },
  });
  return (
    <div style={styles.container}>
      <h1>Welcome to SupplementRatings</h1>
      <p>Your trusted source for supplement reviews and ratings.</p>
      <Link to="/supplements" style={styles.button}>
        View Supplements
      </Link>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  button: {
    display: 'inline-block',
    padding: '10px 20px',
    marginTop: '20px',
    backgroundColor: '#28a745',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
  },
};

export default Home;
