console.log("🛠️  Starting server.js");
console.log("🛠️  CWD:", process.cwd());
console.log("🛠️  __filename:", __filename);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

let User, ClaimHistory;
try {
  User = require('./models/user');
  ClaimHistory = require('./models/claimHistory');
  console.log("🛠️  Models loaded");
} catch (e) {
  console.error("❌ Model load error:", e.message);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

console.log("🛠️  MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 🏠 Default route
app.get('/', (req, res) => {
  console.log("➡️  GET /");
  res.send("🎉 Server is running!");
});

// 👤 Create a test user
app.get('/create-test-user', async (req, res) => {
  console.log("➡️  GET /create-test-user");
  try {
    const newUser = new User({ username: "TestUser" });
    const savedUser = await newUser.save();
    console.log("✅ User saved:", savedUser);
    res.json({ message: "✅ Test user created!", user: savedUser });
  } catch (err) {
    console.error("❌ Error in /create-test-user:", err);
    res.status(500).json({ error: "❌ Could not create user" });
  }
});

// ⭐ POST /claim-points
app.post('/claim-points', async (req, res) => {
  const { userId, points } = req.body;

  if (!userId || typeof points !== 'number') {
    return res.status(400).json({ error: "userId and numeric points are required" });
  }

  if (points < 1 || points > 10) {
    return res.status(400).json({ error: "Points must be between 1 and 10" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.score += points;
    await user.save();

    const claim = new ClaimHistory({ userId, points });
    await claim.save();

    console.log("✅ Points claimed:", points, "by user:", user.username);
    res.json({ message: "✅ Points claimed", user, claim });
  } catch (err) {
    console.error("❌ Error in /claim-points:", err);
    res.status(500).json({ error: "❌ Failed to claim points" });
  }
});

// 📊 GET /leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ score: -1 });
    users.forEach((user, index) => {
      user.rank = index + 1;
    });
    res.json({ leaderboard: users });
  } catch (err) {
    console.error("❌ Error in /leaderboard:", err);
    res.status(500).json({ error: "❌ Failed to fetch leaderboard" });
  }
});

// 📜 GET /claim-history/:userId
app.get('/claim-history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await ClaimHistory.find({ userId })
      .populate('userId', 'username')
      .sort({ claimedAt: -1 });

    if (!history.length) {
      return res.status(404).json({ message: "No claim history found for this user." });
    }

    res.json({ history });
  } catch (err) {
    console.error("❌ Error in /claim-history/:userId:", err);
    res.status(500).json({ error: "❌ Failed to retrieve claim history" });
  }
});

// 👁️ GET /user/:id
app.get('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("❌ Error in /user/:id:", err);
    res.status(500).json({ error: "❌ Failed to fetch user" });
  }
});

// 📋 GET /users - All users for dropdown
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    console.error("❌ Error in /users:", err);
    res.status(500).json({ error: "❌ Failed to fetch users" });
  }
});

// ➕ POST /add-user - Add a new user
app.post('/add-user', async (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: "Username is required and must be a string" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const newUser = new User({ username });
    await newUser.save();

    console.log("✅ User added:", newUser.username);
    res.status(201).json({ message: "✅ User added", user: newUser });
  } catch (err) {
    console.error("❌ Error in /add-user:", err);
    res.status(500).json({ error: "❌ Failed to add user" });
  }
});

// 🌐 Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
