import axios from 'axios';

// Dynamically determine base URL depending on environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return ''; // Use relative path in production (same domain)
  }
  return 'http://localhost:5000'; // Your dev server
};

export const BASE_URL = getBaseUrl();

// Fetch leaderboard data
export const getLeaderboard = async () => {
  const res = await axios.get(`${BASE_URL}/leaderboard`);
  return res.data.leaderboard;
};

// Claim points for a user
export const claimPoints = async (userId, points) => {
  const res = await axios.post(`${BASE_URL}/claim-points`, { userId, points });
  return res.data;
};

// Get claim history for a user
export const getClaimHistory = async (userId) => {
  const res = await axios.get(`${BASE_URL}/claim-history/${userId}`);
  return res.data.history;
};

// Get all users
export const getAllUsers = async () => {
  const res = await axios.get(`${BASE_URL}/users`);
  return res.data.users;
};

// Add a new user
export const addNewUser = async (username) => {
  const res = await axios.post(`${BASE_URL}/add-user`, { username });
  return res.data.user;
};
