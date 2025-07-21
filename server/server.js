console.log("🛠️ Starting server.js");
console.log("🛠️ CWD:", process.cwd());
console.log("🛠️ __filename:", __filename);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const User = require('./models/user');
const ClaimHistory = require('./models/claimHistory');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log("🛠️ MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 🌐 Routes

app.get('/', (req, res) => {
  res.send("🎉 Sky Leaderboard backend is running!");
});

app.get('/create-test-user', async (req, res) => {
  try {
    const newUser = new User({ username: "TestUser" });
    const savedUser = await newUser.save();
    res.json({ message: "✅ Test user created!", user: savedUser });
  } catch (err) {
    res.status(500).json({ error: "❌ Could not create user" });
  }
});

app.post('/claim-points', async (req, res) => {
  const { userId, points } = req.body;
  if (!userId || typeof points !== 'number' || points < 1 || points > 10) {
    return res.status(400).json({ error: "Invalid userId or points" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.score += points;
    await user.save();

    const claim = new ClaimHistory({ userId, points });
    await claim.save();

    res.json({ message: "✅ Points claimed", user, claim });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to claim points" });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ score: -1 });
    users.forEach((user, i) => user.rank = i + 1);
    res.json({ leaderboard: users });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch leaderboard" });
  }
});

app.get('/claim-history/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const history = await ClaimHistory.find({ userId })
      .populate('userId', 'username')
      .sort({ claimedAt: -1 });

    if (!history.length) {
      return res.status(404).json({ message: "No claim history found" });
    }

    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to retrieve claim history" });
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch user" });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch users" });
  }
});

app.post('/add-user', async (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: "Username already exists" });

    const newUser = new User({ username });
    await newUser.save();
    res.status(201).json({ message: "✅ User added", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to add user" });
  }
});

// 🔒 Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
