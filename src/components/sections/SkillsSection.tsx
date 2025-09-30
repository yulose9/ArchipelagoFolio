'use client';

import { motion } from 'framer-motion';
import { Section } from '../../types/Section';

interface SkillsSectionProps {
  section: Section;
  isVisible: boolean;
  className?: string;
}

const SkillsSection= ({
  section,
  isVisible,
  className = '',
}) => {
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: section.animationConfig.duration / 1000,
        delay: section.animationConfig.delay / 1000,
        staggerChildren: 0.1,
      },
    },
  };

  const skillVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      rotate: -5,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  const mockSkills = [
    { name: 'React/Next.js', level: 95, color: 'bg-blue-500' },
    { name: 'TypeScript', level: 90, color: 'bg-blue-600' },
    { name: 'Node.js', level: 85, color: 'bg-green-500' },
    { name: 'Python', level: 80, color: 'bg-yellow-500' },
    { name: 'PostgreSQL', level: 75, color: 'bg-indigo-500' },
    { name: 'AWS/Cloud', level: 70, color: 'bg-orange-500' },
    { name: 'UI/UX Design', level: 85, color: 'bg-pink-500' },
    { name: 'DevOps', level: 65, color: 'bg-gray-600' },
  ];

  return (
    <motion.section
      className={`min-h-screen flex items-center justify-center px-6 md:px-12 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={skillVariants}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {section.title}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {section.content.split('\n\n')[0]}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              variants={skillVariants}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-semibold text-lg">{skill.name}</h3>
                <span className="text-white/70 text-sm">{skill.level}%</span>
              </div>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full ${skill.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default SkillsSection;