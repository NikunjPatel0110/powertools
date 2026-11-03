const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || secret.trim().length < 32) {
    throw new Error('JWT_SECRET must be configured in environment variables and be at least 32 characters');
  }
  return jwt.sign({ id }, secret.trim(), { expiresIn: '2h' });
};

const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const trimmedUsername = username.trim();
    const admin = await Admin.findOne({ username: trimmedUsername });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginAdmin, generateToken };
