import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import { addUser } from '../api/leaderboardAPI';

function AddUserForm({ onUserAdded }) {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddUser = async () => {
    setMessage('');
    setError('');

    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
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
      <Typography variant="h6" gutterBottom>Add New User</Typography>
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="outlined" onClick={handleAddUser}>Add User</Button>
      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}

export default AddUserForm;
