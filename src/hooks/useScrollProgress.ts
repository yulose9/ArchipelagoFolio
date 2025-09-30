'use client';

import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface ScrollProgressData {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  currentSection: number;
  totalSections: number;
  progress: number;
}

export const useScrollProgress = (totalSections: number = 4): ScrollProgressData => {
  const { scrollY, scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);

  // Transform scroll progress to section index
  const sectionProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, totalSections - 1]
  );

  useEffect(() => {
    const unsubscribe = sectionProgress.on("change", (value) => {
      const sectionIndex = Math.round(value);
      setCurrentSection(Math.max(0, Math.min(sectionIndex, totalSections - 1)));
    });

    return unsubscribe;
  }, [sectionProgress, totalSections]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setProgress(value);
    });

    return unsubscribe;
  }, [scrollYProgress]);

  return {
    scrollY,
    scrollYProgress,
    currentSection,
    totalSections,
    progress,
  };
};

export default useScrollProgress;