const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('../models/Admin');

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedAdmin = async () => {
  const mongoUri = process.env.MONGO_URI;
  const username = process.env.ADMIN_USERNAME ? process.env.ADMIN_USERNAME.trim() : '';
  const password = process.env.ADMIN_PASSWORD ? String(process.env.ADMIN_PASSWORD) : '';

  if (!mongoUri) {
    console.error('Error: MONGO_URI environment variable is required.');
    process.exit(1);
  }

  if (!username || !password) {
    console.error('Error: Both ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required to seed the admin account.');
    console.error('Please configure them in your .env file or environment.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: ADMIN_PASSWORD must be at least 8 characters long.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    let admin = await Admin.findOne({ username });

    if (admin) {
      console.log(`Admin user '${username}' already exists. Updating password...`);
      admin.password = password;
      await admin.save();
      console.log(`Admin user '${username}' password updated successfully.`);
    } else {
      console.log(`Creating new admin user '${username}'...`);
      admin = await Admin.create({ username, password });
      console.log(`Admin user '${username}' created successfully (ID: ${admin._id}).`);
    }

    await mongoose.disconnect();
    console.log('Admin seed complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

seedAdmin();

