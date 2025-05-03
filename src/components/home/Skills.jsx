// src/components/home/Skills.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Skills = ({ skills = [] }) => {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 bg-secondary bg-opacity-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-accent text-lg font-mono uppercase tracking-wider mb-4">My Expertise</h2>
          <h1 className="text-4xl font-bold mb-6">
            <span className="text-gradient">Technical Skills</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            I've spent years honing my skills in various technologies to create seamless, interactive, and visually stunning digital experiences.
          </p>
        </motion.div>
        
        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <div key={category}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="text-2xl font-bold mb-6"
              >
                {category}
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-primary p-6 rounded-lg border border-gray-800"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-bold">{skill.name}</h4>
                      <span className="text-accent">{skill.proficiency}%</span>
                    </div>
                    
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-accent to-highlight"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
