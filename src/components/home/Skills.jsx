// Modified Skills.jsx with skill level tags instead of percentages
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

  // Function to determine skill level based on proficiency percentage
  const getSkillLevel = (proficiency) => {
    if (proficiency < 40) return { level: 'Beginner', color: 'bg-blue-500' };
    if (proficiency < 75) return { level: 'Intermediate', color: 'bg-purple-500' };
    return { level: 'Expert', color: 'bg-accent' };
  };

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
                    {categorySkills.map((skill, index) => {
                      const skillLevel = getSkillLevel(skill.proficiency);

                      return (
                          <motion.div
                              key={skill.name}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                              viewport={{ once: true }}
                              className="bg-primary p-6 rounded-lg border border-gray-800 hover:border-accent transition-colors duration-300"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center space-x-3">
                                {skill.icon && (
                                    <img
                                        src={skill.icon}
                                        alt={skill.name}
                                        className="w-8 h-8 object-contain"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = 'https://via.placeholder.com/32?text=?';
                                        }}
                                    />
                                )}
                                <h4 className="text-lg font-bold">{skill.name}</h4>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${skillLevel.color} text-white`}>
                          {skillLevel.level}
                        </span>
                            </div>

                            <div className="w-full h-1 bg-gradient-to-r from-accent to-highlight opacity-30"></div>
                          </motion.div>
                      );
                    })}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default Skills;