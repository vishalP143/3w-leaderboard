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
  MenuItem,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getAllUsers, getClaimHistory } from '../api/leaderboardAPI';

function ClaimHistory({ selectedUserId, claimTrigger }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(selectedUserId || '');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Typography
        variant="h6"
        gutterBottom
        align={isMobile ? 'center' : 'left'}
      >
        📜 Claim History
      </Typography>

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

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && history.length > 0 && (
        <List
          sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
            px: { xs: 1, sm: 2 },
            py: 1,
            maxHeight: 300,
            overflowY: 'auto'
          }}
        >
          {history.map((item) => (
            <ListItem
              key={item._id}
              divider
              sx={{
                color: '#fff',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <ListItemText
                primary={`👤 ${item.userId.username}`}
                secondary={`⭐ ${item.points} pts  •  🕒 ${new Date(item.claimedAt).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {!loading && !error && userId && history.length === 0 && (
        <Typography align="center" sx={{ mt: 2 }}>
          No claim history for this user.
        </Typography>
      )}
    </Box>
  );
}

export default ClaimHistory;
