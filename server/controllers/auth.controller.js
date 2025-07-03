const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Debug 1: Log input
    console.log('Login attempt for:', username);
    
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    
    // Debug 2: Log user data
    console.log('User found:', user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Debug 3: Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(200).json({
      id: user.id,
      username: user.username,
      token
    });
    
  } catch (error) {
    // Debug 4: Log error lengkap
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};