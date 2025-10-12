const bcrypt = require('bcrypt');
const User = require('../db/userModel');

async function register(email, password, username) {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    username
  });
  
  return user;
}

module.exports = { register };