import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { getAllUsers, getClaimHistory } from '../api/leaderboardAPI';

function ClaimHistory({ selectedUserId, claimTrigger }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(selectedUserId || '');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setError('❌ Failed to load users'));
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      setUserId(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError('');
    getClaimHistory(userId)
      .then(setHistory)
      .catch(() => setError('❌ Failed to fetch claim history'))
      .finally(() => setLoading(false));
  }, [userId, claimTrigger]);

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>📜 Claim History</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel sx={{ color: '#fff' }}>Select User</InputLabel>
        <Select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          label="Select User"
          sx={{
            color: '#fff',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '& .MuiSelect-icon': { color: '#fff' }
          }}
        >
          {users.map((u) => (
            <MenuItem key={u._id} value={u._id}>
              {u.username}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && history.length > 0 && (
        <List sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, px: 2 }}>
          {history.map((item) => (
            <ListItem key={item._id} divider sx={{ color: '#fff' }}>
              <ListItemText
                primary={`User: ${item.userId.username}`}
                secondary={`Points: ${item.points} | Date: ${new Date(item.claimedAt).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {!loading && !error && userId && history.length === 0 && (
        <Typography>No claim history for this user.</Typography>
      )}
    </Box>
  );
}

export default ClaimHistory;
