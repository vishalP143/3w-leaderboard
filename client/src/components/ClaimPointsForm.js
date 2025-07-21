import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

function ClaimPointsForm({ users, onClaimSuccess, selectedUserId, setSelectedUserId }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClaim = async () => {
    if (!selectedUserId) return setError("Please select a user");

    setMessage('');
    setError('');
    setLoading(true);

    const randomPoints = Math.floor(Math.random() * 10) + 1;

    try {
      const res = await axios.post(`${BASE_URL}/claim-points`, {
        userId: selectedUserId,
        points: randomPoints
      });
      setMessage(`✅ ${res.data.message} (${randomPoints} pts)`);
      await onClaimSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "❌ Claim failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom align={isMobile ? 'center' : 'left'}>
        🎯 Claim Random Points
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel sx={{ color: '#fff' }}>Select User</InputLabel>
        <Select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          label="Select User"
          sx={{
            color: '#fff',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '& .MuiSelect-icon': { color: '#fff' }
          }}
        >
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.username}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{
          display: 'flex',
          justifyContent: isMobile ? 'center' : 'flex-start',
          alignItems: 'center',
        }}
      >
        <Button
          variant="contained"
          onClick={handleClaim}
          disabled={!selectedUserId || loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Claim'}
        </Button>
      </Box>

      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}

export default ClaimPointsForm;
