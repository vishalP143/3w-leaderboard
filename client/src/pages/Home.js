import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Divider,
  Box,
  TextField,
  Button,
  Alert
} from '@mui/material';

import Leaderboard from '../components/Leaderboard';
import ClaimPointsForm from '../components/ClaimPointsForm';
import ClaimHistory from '../components/ClaimHistory';
import { getLeaderboard, addNewUser } from '../api/leaderboardAPI';

function Home() {
  const [leaderboard, setLeaderboard] = useState(() => {
    const cached = localStorage.getItem('leaderboard');
    return cached ? JSON.parse(cached) : [];
  });

  const [selectedUserId, setSelectedUserId] = useState(() => {
    return localStorage.getItem('selectedUserId') || '';
  });

  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('selectedUserId', selectedUserId);
  }, [selectedUserId]);

  const refreshLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
      localStorage.setItem('leaderboard', JSON.stringify(data));
    } catch (err) {
      console.error("❌ Failed to refresh leaderboard:", err);
    }
  };

  useEffect(() => {
    refreshLeaderboard();
  }, []);

  const handleAddUser = async () => {
    setMessage('');
    setError('');
    if (!newUsername.trim()) {
      return setError("⚠️ Username cannot be empty");
    }

    try {
      await addNewUser(newUsername.trim());
      setMessage(`✅ User "${newUsername}" added successfully!`);
      setNewUsername('');
      refreshLeaderboard();
    } catch (err) {
      setError("❌ Failed to add user");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto', // 👈 allow scroll
        pt: 4
      }}
    >
      <Box
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 4,
          p: { xs: 2, sm: 4 },
          width: { xs: '95%', sm: '90%', md: '75%' },
          color: '#fff'
        }}
      >
        <Container maxWidth="sm" disableGutters sx={{ px: { xs: 1, sm: 3 } }}>
          <Typography variant="h4" gutterBottom align="center">
            🎮 Sky Leaderboard
          </Typography>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.3)' }} />

          <Leaderboard leaderboard={leaderboard} />

          {/* ➕ Add User */}
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>➕ Add New User</Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                label="Enter username"
                variant="outlined"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                fullWidth
                InputProps={{
                  sx: { backgroundColor: '#fff' }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddUser}
                sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
              >
                Add
              </Button>
            </Box>
            {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.3)' }} />

          <ClaimPointsForm
            users={leaderboard}
            onClaimSuccess={refreshLeaderboard}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.3)' }} />

          <ClaimHistory selectedUserId={selectedUserId} />
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
