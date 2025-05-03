// server/controllers/skills.controller.js
const Skill = require('../models/skill.model');

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.getAll();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const skills = await Skill.getByCategory(category);
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.getById(id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSkill = async (req, res) => {
  try {
    const { name, category, proficiency, icon, order_index } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }
    
    const skillId = await Skill.create({
      name,
      category,
      proficiency,
      icon,
      order_index
    });
    
    res.status(201).json({ 
      message: 'Skill created successfully',
      id: skillId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, proficiency, icon, order_index } = req.body;
    
    // Check if skill exists
    const skill = await Skill.getById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }
    
    await Skill.update(id, {
      name,
      category,
      proficiency,
      icon,
      order_index
    });
    
    res.status(200).json({ message: 'Skill updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if skill exists
    const skill = await Skill.getById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    await Skill.delete(id);
    
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
