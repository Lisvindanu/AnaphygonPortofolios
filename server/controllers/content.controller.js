// server/controllers/content.controller.js
const db = require('../config/database');


exports.getAllContent = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM content ORDER BY section, order_index');
    
    // Group by section
    const contentBySection = rows.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    }, {});
    
    res.status(200).json(contentBySection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContentBySection = async (req, res) => {
  try {
    const { section } = req.params;
    const [rows] = await db.execute('SELECT * FROM content WHERE section = ? ORDER BY order_index', [section]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, content, order_index } = req.body;
    
    await db.execute(
      'UPDATE content SET title = ?, subtitle = ?, content = ?, order_index = ? WHERE id = ?',
      [title, subtitle, content, order_index, id]
    );
    
    res.status(200).json({ message: 'Content updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
