// frontend/src/pages/Signup.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { registerUser } from '../services/api';
import { toast } from 'react-toastify';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser({ username, email, password });
      toast.success(
        <span>
          Registration successful!{' '}
          <strong>Please check your email to verify your account.</strong>
        </span>
      );
      navigate('/login');
    } catch (error) {
      let errorMessage = error.message || 'Registration failed';

      if (error.data?.username?.length) {
        const msg = error.data.username[0];
        errorMessage = msg.toLowerCase().includes('already exists')
          ? 'Username already taken. Please choose a different one.'
          : msg;
      } else if (error.data?.email?.length) {
        const msg = error.data.email[0];
        errorMessage =
          msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('email already')
            ? 'This email is already registered. Try logging in instead.'
            : msg;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Left branding panel — desktop only */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '45%',
          background: 'linear-gradient(145deg, #1565C0 0%, #1E88E5 60%, #64B5F6 100%)',
          px: 6,
          color: '#fff',
        }}
      >
        <Box
          component="img"
          src="/Supplement_Ratings_Logo.png"
          alt="Supplement Ratings"
          sx={{ height: 64, width: 'auto', mb: 4, filter: 'brightness(0) invert(1)' }}
        />
        <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
          Join the community
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ opacity: 0.85, maxWidth: 340, lineHeight: 1.7 }}>
          Share your supplement experiences and help others make informed decisions about their health.
        </Typography>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 3, sm: 6 },
          py: 6,
        }}
      >
        {/* Mobile logo */}
        <Box
          component="img"
          src="/Supplement_Ratings_Logo.png"
          alt="Supplement Ratings"
          sx={{ height: 48, width: 'auto', mb: 3, display: { xs: 'block', md: 'none' } }}
        />

        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            It's free and takes less than a minute
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
              autoFocus
            />
            <TextField
              fullWidth
              label="Email address"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.4, fontSize: '1rem' }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>

            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5, textAlign: 'center', lineHeight: 1.6 }}>
              By creating an account you agree to our{' '}
              <MuiLink component={Link} to="/terms" underline="hover" color="inherit">
                Terms of Service
              </MuiLink>
              {' '}and{' '}
              <MuiLink component={Link} to="/privacy" underline="hover" color="inherit">
                Privacy Policy
              </MuiLink>.
            </Typography>
          </Box>

          {/* Login link */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Typography
                component={Link}
                to="/login"
                variant="body2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign in
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Signup;
