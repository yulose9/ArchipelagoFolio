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
      isClickable: false,
      link: '',
    },
    {
      label: 'Phone',
      value: '(+63) 912 345 6789',
      icon: '📱',
      color: 'bg-green-500',
      isClickable: false,
      link: '',
    },
    {
      label: 'LinkedIn',
      value: 'jannazarene',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: 'bg-blue-600',
      isClickable: true,
      link: 'https://www.linkedin.com/in/jannazarene/',
    },
    {
      label: 'GitHub',
      value: 'yulose9',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      color: 'bg-gray-700',
      isClickable: true,
      link: 'https://github.com/yulose9',
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
              <motion.div
                key={method.label}
                className={`${method.color} text-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (method.isClickable && method.link) {
                    window.open(method.link, '_blank', 'noopener,noreferrer');
                  } else if (method.label === 'Email' || method.label === 'Phone') {
                    copyToClipboard(method.value, method.label);
                  }
                }}
              >
                <div className="flex items-center justify-center mb-3">
                  {typeof method.icon === 'string' ? (
                    <div className="text-3xl">{method.icon}</div>
                  ) : (
                    method.icon
                  )}
                </div>
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
              </motion.div>
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