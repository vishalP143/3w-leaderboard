import axios from 'axios';

export const BASE_URL = 'https://5000-vishalp143-3wleaderboar-3kvvgp1843i.ws-us120.gitpod.io';

export const getLeaderboard = async () => {
  const res = await axios.get(`${BASE_URL}/leaderboard`);
  return res.data.leaderboard;
};

export const claimPoints = async (userId, points) => {
  const res = await axios.post(`${BASE_URL}/claim-points`, { userId, points });
  return res.data;
};

export const getClaimHistory = async (userId) => {
  const res = await axios.get(`${BASE_URL}/claim-history/${userId}`);
  return res.data.history;
};

export const getAllUsers = async () => {
  const res = await axios.get(`${BASE_URL}/users`);
  return res.data.users;
};

export const addNewUser = async (username) => {
  const res = await axios.post(`${BASE_URL}/add-user`, { username });
  return res.data.user;
};
