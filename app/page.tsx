'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import PortfolioSections from '../src/components/sections/PortfolioSections';
import { useScrollProgress } from '../src/hooks/useScrollProgress';
import { pageTransition } from '@/lib/animations/motionVariants';
import { MapboxMapRef } from '@/components/map/MapboxMap';
import { PORTFOLIO_SECTIONS } from '@/data/portfolioSections';

// Dynamic import for Mapbox component to handle SSR
const MapboxMap = dynamic(() => import('@/components/map/MapboxMap').then(mod => ({ default: mod.default })), {
    ssr: false,
    loading: () => (
        <div className="w-full h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 animate-pulse flex items-center justify-center">
            <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-medium">Loading 3D Map...</p>
                <p className="text-sm opacity-75 mt-2">Initializing Philippines visualization</p>
            </div>
        </div>
    ),
});

// Loading fallback component
const MapLoadingFallback = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center z-0">
        <div className="text-center text-white">
            <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">Preparing Portfolio</h2>
            <p className="text-slate-300">Loading interactive 3D map experience...</p>
        </div>
    </div>
);

/**
 * Main portfolio page component
 * Integrates 3D map background with scrollable portfolio sections
 */
export default function HomePage() {
    const mapRef = useRef<MapboxMapRef>(null);
    const { currentSection } = useScrollProgress(PORTFOLIO_SECTIONS.length);

    useEffect(() => {
        if (mapRef.current && currentSection < PORTFOLIO_SECTIONS.length) {
            const region = PORTFOLIO_SECTIONS[currentSection].mapRegion;
            
            // Fly to the region using MapRegion format
            mapRef.current.flyTo(region);
        }
    }, [currentSection]);

    return (
        <motion.main
            className="min-h-screen relative overflow-x-hidden"
            variants={pageTransition}
            initial="initial"
            animate="in"
            exit="out"
        >
            {/* 3D Map Background - Fixed position */}
            <div className="fixed inset-0 z-0">
                <Suspense fallback={<MapLoadingFallback />}>
                    <MapboxMap 
                        ref={mapRef} 
                        initialRegion={PORTFOLIO_SECTIONS[0].mapRegion}
                    />
                </Suspense>
            </div>

            {/* Overlay content with portfolio sections */}
            <div className="relative z-10">
                {/* Hero section spacer to allow map visibility */}
                <section className="h-screen flex items-center justify-center">
                    <motion.div
                        className="text-center text-white px-6"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <motion.h1
                            className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl"
                            style={{ 
                                textShadow: '0 4px 30px rgba(0, 0, 0, 0.8), 0 2px 15px rgba(0, 0, 0, 0.6), 0 8px 40px rgba(0, 0, 0, 0.4)',
                                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                        >
                            John Doe
                        </motion.h1>
                        <motion.p
                            className="text-2xl md:text-4xl font-semibold text-white mb-12 max-w-3xl mx-auto px-6 py-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20"
                            style={{ 
                                textShadow: '0 3px 20px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.8)',
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                        >
                            Full-Stack Developer & Digital Innovator
                        </motion.p>
                        <motion.button
                            className="flex items-center justify-center space-x-3 mx-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-full px-8 py-4 transition-all duration-300 cursor-pointer group"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                window.scrollTo({
                                    top: window.innerHeight,
                                    behavior: 'smooth'
                                });
                            }}
                        >
                            <span className="text-lg md:text-xl font-semibold text-white" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}>
                                Scroll to Explore
                            </span>
                            <motion.div
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="text-2xl"
                            >
                                ↓
                            </motion.div>
                        </motion.button>
                    </motion.div>
                </section>

                {/* Portfolio sections with semi-transparent backgrounds */}
                <div className="bg-gradient-to-b from-transparent via-black/50 to-black/80 backdrop-blur-sm">
                    <PortfolioSections />
                </div>

                {/* Footer section */}
                <footer className="bg-black/90 backdrop-blur-sm border-t border-white/10 py-20">
                    <div className="container mx-auto px-6 text-center text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-3xl md:text-5xl font-bold mb-6">Ready to Create Something Amazing?</h3>
                            <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                                Let's bring your ideas to life with cutting-edge technology and creative solutions.
                            </p>
                            <motion.button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-lg text-lg transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get In Touch
                            </motion.button>
                        </motion.div>

                        <div className="mt-16 pt-10 border-t border-white/10">
                            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                                <p className="text-slate-400 text-base">
                                    © 2024 John Doe. All rights reserved.
                                </p>
                                <div className="flex space-x-8">
                                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-lg">
                                        GitHub
                                    </a>
                                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-lg">
                                        LinkedIn
                                    </a>
                                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-lg">
                                        Twitter
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </motion.main>
    );
}