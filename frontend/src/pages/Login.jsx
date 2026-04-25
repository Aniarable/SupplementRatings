// frontend/src/pages/Login.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, loginWithGoogle, fetchGoogleClientId } from '../services/api';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser({ username, password });
      if (response.access) {
        login(response.access);
        toast.success('Logged in successfully!');
        navigate('/feed');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initGoogle = async () => {
      if (!(window.google && googleButtonRef.current)) return;
      try {
        const enableLocalGsi = String(import.meta.env.VITE_ENABLE_GSI_LOCAL || '').toLowerCase() === 'true';
        const isLocalhost = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
        if (isLocalhost && !enableLocalGsi) return;

        const serverClientId = await fetchGoogleClientId();
        const clientId = serverClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) return;

        if (window._gsiInited === clientId) return;
        if (typeof window.google?.accounts?.id?.cancel === 'function') {
          try { window.google.accounts.id.cancel(); } catch (_) {}
        }
        if (typeof window.google?.accounts?.id?.disableAutoSelect === 'function') {
          try { window.google.accounts.id.disableAutoSelect(); } catch (_) {}
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: 'popup',
          callback: async (response) => {
            try {
              const data = await loginWithGoogle(response.credential);
              if (data.access) {
                login(data.access);
                toast.success('Logged in with Google!');
                navigate('/feed');
              }
            } catch (err) {
              toast.error(err.message || 'Google login failed');
            }
          },
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 320,
        });
        window._gsiInited = clientId;
      } catch (_) {}
    };
    initGoogle();
  }, [login, navigate]);

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
          Supplement Ratings
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ opacity: 0.85, maxWidth: 340, lineHeight: 1.7 }}>
          Real reviews from real people. Find out what supplements actually work for you.
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
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your account to continue
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
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5, mb: 1 }}>
              <Typography
                component={Link}
                to="/forgot-password"
                variant="body2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.4, fontSize: '1rem' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5, textAlign: 'center', lineHeight: 1.6 }}>
              By signing in you agree to our{' '}
              <MuiLink component={Link} to="/terms" underline="hover" color="inherit">
                Terms of Service
              </MuiLink>
              {' '}and{' '}
              <MuiLink component={Link} to="/privacy" underline="hover" color="inherit">
                Privacy Policy
              </MuiLink>.
            </Typography>
          </Box>

          {/* Google sign-in */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <div ref={googleButtonRef} />
          </Box>

          {/* Sign up link */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Typography
                component={Link}
                to="/signup"
                variant="body2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Create one
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
