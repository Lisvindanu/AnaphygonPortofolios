const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Jika tidak ada di .env, gunakan string acak (hanya untuk development!)
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_sementara_987';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  generateToken,
  verifyToken
};