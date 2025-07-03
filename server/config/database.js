// server/config/database.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Muat environment variables dari root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'futuristic_portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Uji koneksi saat server dimulai
pool.getConnection()
    .then(connection => {
      console.log('✅ Berhasil terhubung ke database.');
      connection.release();
    })
    .catch(err => {
      console.error('❌ Gagal terhubung ke database:', err.message);
    });

module.exports = pool;