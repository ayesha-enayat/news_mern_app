const mongoose = require('mongoose');
require('dotenv').config();

// Import the actual User model (which has password hashing built-in)
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Delete existing admin to recreate with correct password
    await User.deleteOne({ email: 'admin@news.com' });
    console.log('Cleared existing admin user...');

    // Create admin user (password will be hashed by the model's pre-save hook)
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@news.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('----------------------------');
    console.log('Email: admin@news.com');
    console.log('Password: admin123');
    console.log('----------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
