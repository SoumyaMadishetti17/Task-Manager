/**
 * Seed script — creates demo admin and user accounts
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing demo accounts
  await User.deleteMany({ email: { $in: ['admin@demo.com', 'user@demo.com'] } });

  await User.create([
    { name: 'Admin User', email: 'admin@demo.com', password: 'admin123', role: 'Admin', status: 'Active' },
    { name: 'Regular User', email: 'user@demo.com', password: 'user123', role: 'User', status: 'Active' },
  ]);

  console.log('✅ Demo accounts created:');
  console.log('   Admin → admin@demo.com / admin123');
  console.log('   User  → user@demo.com / user123');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
