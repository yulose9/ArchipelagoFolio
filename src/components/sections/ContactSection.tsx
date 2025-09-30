'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../../types/Section';
import { useState } from 'react';

interface ContactSectionProps {
  section: Section;
  isVisible: boolean;
  className?: string;
}

const ContactSection = ({
  section,
  isVisible,
  className = '',
}: ContactSectionProps) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: section.animationConfig.duration / 1000,
        delay: section.animationConfig.delay / 1000,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  const contactMethods = [
    {
      label: 'Email',
      value: 'contact@example.com',
      icon: '📧',
      color: 'bg-blue-500',
    },
    {
      label: 'Phone',
      value: '+1 (555) 123-4567',
      icon: '📱',
      color: 'bg-green-500',
    },
    {
      label: 'LinkedIn',
      value: '/in/portfolio-demo',
      icon: '💼',
      color: 'bg-blue-600',
    },
    {
      label: 'GitHub',
      value: '/portfolio-demo',
      icon: '🔗',
      color: 'bg-gray-700',
    },
  ];

  return (
    <motion.section
      className={`min-h-screen flex items-center justify-center px-6 md:px-12 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl"
          variants={itemVariants}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            {section.title}
          </motion.h2>
          
          <motion.div
            className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8"
            variants={itemVariants}
          >
            {section.content.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4">
                {paragraph.trim()}
              </p>
            ))}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            variants={itemVariants}
          >
            {contactMethods.map((method, index) => (
              <motion.button
                key={method.label}
                className={`${method.color} text-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (method.label === 'Email' || method.label === 'Phone') {
                    copyToClipboard(method.value, method.label);
                  }
                }}
              >
                <div className="text-3xl mb-3">{method.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{method.label}</h3>
                <p className="text-white/90">{method.value}</p>
                
                {/* Copied notification */}
                <AnimatePresence>
                  {copiedItem === method.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute inset-0 bg-green-500 flex items-center justify-center rounded-xl"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">✓</div>
                        <p className="font-semibold">Copied to clipboard!</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            className="border-t border-gray-200 pt-6"
            variants={itemVariants}
          >
            <p className="text-gray-600 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Ready to collaborate on your next project!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactSection;