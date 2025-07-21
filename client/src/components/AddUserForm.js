import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { addUser } from '../api/leaderboardAPI';

function AddUserForm({ onUserAdded }) {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddUser = async () => {
    setMessage('');
    setError('');

    if (!username.trim()) {
      return setError("⚠️ Username cannot be empty");
    }

    try {
      const response = await addUser(username.trim());
      setMessage(`✅ ${response.message}`);
      setUsername('');
      onUserAdded(); // 🔄 Refresh leaderboard
    } catch (err) {
      setError(err.response?.data?.error || "❌ Failed to add user");
    }
  };

  return (
    <Box mt={4}>
      <Typography
        variant="h6"
        gutterBottom
        align={isMobile ? 'center' : 'left'}
      >
        ➕ Add New User
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <TextField
          label="Enter username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          InputProps={{
            sx: { backgroundColor: '#fff' }
          }}
        />

        <Button
          variant="contained"
          onClick={handleAddUser}
          sx={{ height: { sm: '100%' } }}
        >
          Add
        </Button>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default AddUserForm;
