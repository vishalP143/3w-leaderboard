import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';

const podiumLayout = [
  { rank: 1, bg: 'rgba(255, 215, 0, 0.85)', emoji: '👑', height: 130, order: 2 },
  { rank: 2, bg: 'rgba(192, 192, 192, 0.85)', emoji: '🥈', height: 110, order: 1 },
  { rank: 3, bg: 'rgba(205, 127, 50, 0.85)', emoji: '🥉', height: 100, order: 3 }
];

function Leaderboard({ leaderboard }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!leaderboard || leaderboard.length === 0) return null;

  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <Box mt={4}>
      <Typography variant="h5" align="center" gutterBottom>
        🏆 Champions
      </Typography>

      {/* 🥇 Podium View */}
      <Grid container justifyContent="center" alignItems="flex-end" spacing={2} sx={{ mb: 4 }}>
        {top3.map((user, idx) => {
          const { bg, emoji, height, order } = podiumLayout[idx];
          return (
            <Grid item key={user._id} xs={12} sm="auto" sx={{ order }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    width: isMobile ? '100%' : 110,
                    height: isMobile ? 'auto' : height,
                    backgroundColor: bg,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderRadius: 2,
                    padding: 1,
                    textAlign: 'center',
                    color: '#000'
                  }}
                >
                  <Avatar sx={{ bgcolor: '#fff', color: '#000', mb: 1 }}>
                    {emoji}
                  </Avatar>
                  <Typography fontWeight="bold" variant="subtitle2" noWrap>
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
          <Box sx={{ px: { xs: 1, sm: 0 } }}>
            {others.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 1,
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    color: '#000'
                  }}
                >
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
