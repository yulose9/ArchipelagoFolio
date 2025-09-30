'use client';

import { motion } from 'framer-motion';
import { Section } from '../../types/Section';

interface AboutSectionProps {
    section: Section;
    isVisible: boolean;
    className?: string;
}

const AboutSection = ({
    section,
    isVisible,
    className = '',
}: AboutSectionProps) => {
    const containerVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: section.animationConfig.duration / 1000,
                delay: section.animationConfig.delay / 1000,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
            },
        },
    };

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
                        className="text-lg md:text-xl text-gray-700 leading-relaxed space-y-4"
                        variants={itemVariants}
                    >
                        {section.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">
                                {paragraph.trim()}
                            </p>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mt-8 flex flex-wrap justify-center gap-4"
                        variants={itemVariants}
                    >
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                            Web Developer
                        </div>
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                            UI/UX Designer
                        </div>
                        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                            Creative Thinker
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default AboutSection;