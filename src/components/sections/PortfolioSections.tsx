'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioSections } from '../../data/portfolio';
import AboutSection from './AboutSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';

interface PortfolioSectionsProps {
    className?: string;
    onSectionChange?: (sectionId: string) => void;
}

const PortfolioSections = ({
    className = '',
    onSectionChange,
}: PortfolioSectionsProps) => {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
    const [activeSection, setActiveSection] = useState<string>('about');
    const [showNavigation, setShowNavigation] = useState(false);

    // Track scroll position to show/hide navigation
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const heroHeight = window.innerHeight;
            
            // Show navigation when scrolled past 50% of hero section
            setShowNavigation(scrollPosition > heroHeight * 0.5);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer setup for section visibility
    useEffect(() => {
        const observers = new Map<string, IntersectionObserver>();

        portfolioSections.forEach((section: any) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const sectionId = entry.target.getAttribute('data-section-id');
                        if (!sectionId) return;

                        setVisibleSections((prev) => {
                            const newSet = new Set(prev);
                            if (entry.isIntersecting) {
                                newSet.add(sectionId);
                                setActiveSection(sectionId);
                                onSectionChange?.(sectionId);
                            } else {
                                newSet.delete(sectionId);
                            }
                            return newSet;
                        });
                    });
                },
                {
                    threshold: 0.3, // Trigger when 30% of the section is visible
                    rootMargin: '-10% 0px -10% 0px',
                }
            );

            const element = document.querySelector(`[data-section-id="${section.id}"]`);
            if (element) {
                observer.observe(element);
                observers.set(section.id, observer);
            }
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [onSectionChange]);

    const renderSection = (section: typeof portfolioSections[0]) => {
        const isVisible = visibleSections.has(section.id);
        const commonProps = {
            section,
            isVisible,
            className: 'section-container',
        };

        switch (section.id) {
            case 'about':
                return <AboutSection {...commonProps} />;
            case 'projects':
                return <ProjectsSection {...commonProps} />;
            case 'skills':
                return <SkillsSection {...commonProps} />;
            case 'contact':
                return <ContactSection {...commonProps} />;
            default:
                return null;
        }
    };

    return (
        <div className={`${className}`}>
            {portfolioSections
                .sort((a: any, b: any) => a.order - b.order)
                .map((section: any) => (
                    <div
                        key={section.id}
                        data-section-id={section.id}
                        className="section-wrapper"
                    >
                        {renderSection(section)}
                    </div>
                ))}

            {/* Navigation indicator - fixed positioned on the right side, hidden on hero page */}
            <AnimatePresence>
                {showNavigation && (
                    <motion.div
                        className="fixed right-8 top-1/2 -translate-y-1/2 z-30"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        <div className="flex flex-col space-y-4 bg-black/30 backdrop-blur-sm rounded-full p-3 shadow-xl">
                            {portfolioSections.map((section: any) => (
                                <motion.button
                                    key={section.id}
                                    className={`w-4 h-4 rounded-full transition-all duration-300 ${activeSection === section.id
                                            ? 'bg-white scale-125 shadow-lg shadow-white/50'
                                            : 'bg-white/40 hover:bg-white/70 hover:scale-110'
                                        }`}
                                    onClick={() => {
                                        const element = document.querySelector(`[data-section-id="${section.id}"]`);
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={`Navigate to ${section.title}`}
                                    title={section.title}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PortfolioSections;