'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export interface SectionVisibilityData {
  visibleSections: Set<string>;
  activeSection: string | null;
  sectionProgress: Map<string, number>;
}

export interface UseSectionVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
  sections: string[];
  onSectionChange?: (sectionId: string) => void;
  onVisibilityChange?: (sectionId: string, isVisible: boolean) => void;
}

export const useSectionVisibility = ({
  threshold = 0.3,
  rootMargin = '-10% 0px -10% 0px',
  sections,
  onSectionChange,
  onVisibilityChange,
}: UseSectionVisibilityOptions): SectionVisibilityData => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionProgress, setSectionProgress] = useState<Map<string, number>>(new Map());
  
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map());
  const elementsRef = useRef<Map<string, Element>>(new Map());

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.getAttribute('data-section-id');
        if (!sectionId) return;

        const isVisible = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        // Update visibility state
        setVisibleSections((prev) => {
          const newSet = new Set(prev);
          if (isVisible) {
            newSet.add(sectionId);
          } else {
            newSet.delete(sectionId);
          }
          return newSet;
        });

        // Update section progress
        setSectionProgress((prev) => {
          const newMap = new Map(prev);
          newMap.set(sectionId, intersectionRatio);
          return newMap;
        });

        // Update active section (most visible section)
        if (isVisible && intersectionRatio > (threshold || 0.3)) {
          setActiveSection(sectionId);
          onSectionChange?.(sectionId);
        }

        // Call visibility change callback
        onVisibilityChange?.(sectionId, isVisible);
      });
    },
    [threshold, onSectionChange, onVisibilityChange]
  );

  // Initialize observers
  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>();

    sections.forEach((sectionId) => {
      const observer = new IntersectionObserver(handleIntersection, {
        threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0],
        rootMargin,
      });

      observers.set(sectionId, observer);
    });

    observersRef.current = observers;

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections, handleIntersection, rootMargin]);

  // Observe elements when they become available
  useEffect(() => {
    const checkAndObserveElements = () => {
      sections.forEach((sectionId) => {
        const element = document.querySelector(`[data-section-id="${sectionId}"]`);
        const observer = observersRef.current.get(sectionId);
        
        if (element && observer && !elementsRef.current.has(sectionId)) {
          observer.observe(element);
          elementsRef.current.set(sectionId, element);
        }
      });
    };

    // Initial check
    checkAndObserveElements();

    // Set up a periodic check for dynamically added elements
    const intervalId = setInterval(checkAndObserveElements, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [sections]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      observersRef.current.forEach((observer) => observer.disconnect());
      observersRef.current.clear();
      elementsRef.current.clear();
    };
  }, []);

  // Utility function to scroll to a section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Utility function to get section visibility percentage
  const getSectionVisibility = useCallback(
    (sectionId: string): number => {
      return sectionProgress.get(sectionId) || 0;
    },
    [sectionProgress]
  );

  return {
    visibleSections,
    activeSection,
    sectionProgress,
    scrollToSection,
    getSectionVisibility,
  } as SectionVisibilityData & {
    scrollToSection: (sectionId: string) => void;
    getSectionVisibility: (sectionId: string) => number;
  };
};

export default useSectionVisibility;