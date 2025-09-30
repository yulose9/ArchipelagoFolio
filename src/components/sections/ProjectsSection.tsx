'use client';

import { motion } from 'framer-motion';
import { Section } from '../../types/Section';

interface ProjectsSectionProps {
  section: Section;
  isVisible: boolean;
  className?: string;
}

const ProjectsSection= ({
  section,
  isVisible,
  className = '',
}) => {
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: section.animationConfig.duration / 1000,
        delay: section.animationConfig.delay / 1000,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        staggerChildren: 0.15,
      },
    },
  };

  const projectVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  const mockProjects = [
    {
      id: 1,
      title: 'Interactive Dashboard',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tech: ['React', 'TypeScript', 'D3.js'],
      color: 'bg-gradient-to-br from-blue-500 to-purple-600',
    },
    {
      id: 2,
      title: 'E-commerce Platform',
      description: 'Sed do eiusmod tempor incididunt ut labore et dolore.',
      tech: ['Next.js', 'Stripe', 'PostgreSQL'],
      color: 'bg-gradient-to-br from-green-500 to-teal-600',
    },
    {
      id: 3,
      title: 'Mobile App',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation.',
      tech: ['React Native', 'Firebase', 'Redux'],
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
    },
  ];

  return (
    <motion.section
      className={`min-h-screen flex items-center justify-center px-6 md:px-12 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={projectVariants}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {section.title}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {section.content.split('\n\n')[0]}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProjects.map((project) => (
            <motion.div
              key={project.id}
              className={`${project.color} rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-shadow duration-300`}
              variants={projectVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
              <p className="text-white/90 mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ProjectsSection;