const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../db/userModel');

async function login(email, password) {
  // Find user
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Compare password
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    throw new Error('Invalid password');
  }
  
  // Generate token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return { token, user };
}

module.exports = { login };