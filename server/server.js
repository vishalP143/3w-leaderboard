// server/server.js

console.log("🛠️  Starting server.js");
console.log("🛠️  CWD:", process.cwd());
console.log("🛠️  __filename:", __filename);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Load the User model
let User;
try {
  User = require('./models/user');
  console.log("🛠️  User model loaded");
} catch (e) {
  console.error("❌ Could not load User model:", e.message);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Show the Mongo URI for verification
console.log("🛠️  MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Default route
app.get('/', (req, res) => {
  console.log("➡️  GET /");
  res.send("🎉 Server is running!");
});

// Test route: create a sample user
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
