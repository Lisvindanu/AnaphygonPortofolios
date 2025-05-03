const { verifyToken } = require('../config/auth'); 

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token); // Gunakan fungsi dari auth.js
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { verifyToken: verifyTokenMiddleware };