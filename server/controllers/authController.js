const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    let admin = await Admin.findOne({ username });
    if (!admin && username === 'admin') {
      admin = await Admin.create({ username, password });
    }
    if (admin && (await admin.matchPassword(password))) {
      res.json({ _id: admin._id, username: admin.username, token: generateToken(admin._id) });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginAdmin };
