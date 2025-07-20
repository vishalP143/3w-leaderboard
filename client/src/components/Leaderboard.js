// client/src/components/Leaderboard.js

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';

const podiumLayout = [
  { rank: 1, bg: '#FFD700', emoji: '👑', height: 130, order: 2 }, // Center
  { rank: 2, bg: '#C0C0C0', emoji: '🥈', height: 110, order: 1 }, // Left
  { rank: 3, bg: '#CD7F32', emoji: '🥉', height: 100, order: 3 }  // Right
];

function Leaderboard({ leaderboard }) {
  if (!leaderboard || leaderboard.length === 0) return null;

  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <Box mt={4}>
      <Typography variant="h5" align="center" gutterBottom>
        🏆 Podium Champions
      </Typography>

      {/* 🥇 Podium View */}
      <Grid container justifyContent="center" alignItems="flex-end" spacing={2} sx={{ mb: 4 }}>
        {top3.map((user, idx) => {
          const { bg, emoji, height, order } = podiumLayout[idx];
          return (
            <Grid item key={user._id} sx={{ order }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    width: 110,
                    height,
                    backgroundColor: bg,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderRadius: 2,
                    padding: 1,
                    textAlign: 'center'
                  }}
                >
                  <Avatar sx={{ bgcolor: '#fff', color: '#000', mb: 1 }}>
                    {emoji}
                  </Avatar>
                  <Typography fontWeight="bold" variant="subtitle2">
                    {user.username}
                  </Typography>
                  <Typography variant="caption">{user.score} pts</Typography>
                </Paper>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* 🎮 Other Players */}
      {others.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>🎮 Other Players</Typography>
          <Box>
            {others.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <Paper elevation={2} sx={{ p: 2, mb: 1 }}>
                  <Typography>
                    <strong>#{index + 4}</strong> {user.username} - {user.score} pts
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

export default Leaderboard;
