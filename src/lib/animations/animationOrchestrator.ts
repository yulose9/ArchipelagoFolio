// Animation configuration interface
interface AnimationConfig {
  id?: string;
  duration?: number;
  delay?: number;
  easing?: string;
  target?: string;
  properties?: Record<string, any>;
}

// Simple animation control interface
interface AnimationControl {
  stop?: () => void;
  pause?: () => void;
  resume?: () => void;
}

/**
 * Animation orchestrator for coordinating complex multi-element animations
 * Provides utilities for sequencing, timing, and synchronizing animations
 */
export class AnimationOrchestrator {
  private animationQueue: AnimationConfig[] = [];
  private activeAnimations: Map<string, AnimationControl> = new Map();
  private isPlaying = false;

  /**
   * Add animation to the queue
   */
  public queue(config: AnimationConfig): this {
    this.animationQueue.push({
      ...config,
      id: config.id || `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
    return this;
  }

  /**
   * Play all queued animations in sequence or parallel
   */
  public async play(mode: 'sequence' | 'parallel' = 'sequence'): Promise<void> {
    if (this.isPlaying) {
      console.warn('AnimationOrchestrator: Animation already playing');
      return;
    }

    this.isPlaying = true;

    try {
      if (mode === 'sequence') {
        await this.playSequence();
      } else {
        await this.playParallel();
      }
    } finally {
      this.isPlaying = false;
    }
  }

  /**
   * Play animations in sequence
   */
  private async playSequence(): Promise<void> {
    for (const config of this.animationQueue) {
      await this.executeAnimation(config);
      
      // Wait for delay between animations if specified
      if (config.delay) {
        await this.wait(config.delay);
      }
    }
  }

  /**
   * Play animations in parallel
   */
  private async playParallel(): Promise<void> {
    const promises = this.animationQueue.map(config => 
      this.executeAnimation(config)
    );
    
    await Promise.all(promises);
  }

  /**
   * Execute a single animation
   */
  private async executeAnimation(config: AnimationConfig): Promise<void> {
    return new Promise((resolve) => {
      // Create a mock animation execution
      // In a real implementation, this would trigger actual animations
      const duration = config.duration || 1000;
      
      setTimeout(() => {
        console.log(`Animation executed: ${config.id}`);
        resolve();
      }, duration);
    });
  }

  /**
   * Stop all animations
   */
  public stop(): void {
    this.activeAnimations.forEach(animation => {
      if (animation.stop) {
        animation.stop();
      }
    });
    
    this.activeAnimations.clear();
    this.isPlaying = false;
  }

  /**
   * Clear the animation queue
   */
  public clear(): void {
    this.animationQueue = [];
  }

  /**
   * Get current queue length
   */
  public getQueueLength(): number {
    return this.animationQueue.length;
  }

  /**
   * Check if animations are currently playing
   */
  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Utility method to wait for a specified duration
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Create a sequence of staggered animations
 */
export function createStaggeredSequence(
  configs: Omit<AnimationConfig, 'id'>[],
  staggerDelay: number = 100
): AnimationConfig[] {
  return configs.map((config, index) => ({
    ...config,
    id: `stagger_${index}`,
    delay: (config.delay || 0) + (index * staggerDelay),
  }));
}

/**
 * Create timeline-based animation configuration
 */
export function createTimeline(animations: {
  time: number;
  config: Omit<AnimationConfig, 'id'>;
}[]): AnimationConfig[] {
  return animations
    .sort((a, b) => a.time - b.time)
    .map((item, index) => ({
      ...item.config,
      id: `timeline_${index}`,
      delay: item.time,
    }));
}

/**
 * Utility for creating responsive animation configurations
 */
export function createResponsiveAnimation(
  baseConfig: Omit<AnimationConfig, 'id'>,
  breakpoints: {
    mobile?: Partial<AnimationConfig>;
    tablet?: Partial<AnimationConfig>;
    desktop?: Partial<AnimationConfig>;
  }
): AnimationConfig {
  // Get current viewport width (fallback to desktop)
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  
  let responsiveConfig = { ...baseConfig };
  
  if (width < 768 && breakpoints.mobile) {
    responsiveConfig = { ...responsiveConfig, ...breakpoints.mobile };
  } else if (width < 1024 && breakpoints.tablet) {
    responsiveConfig = { ...responsiveConfig, ...breakpoints.tablet };
  } else if (breakpoints.desktop) {
    responsiveConfig = { ...responsiveConfig, ...breakpoints.desktop };
  }
  
  return {
    ...responsiveConfig,
    id: `responsive_${Date.now()}`,
  };
}

/**
 * Performance-optimized animation utilities
 */
export const animationUtils = {
  /**
   * Debounce animation triggers for performance
   */
  debounce: <T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  },

  /**
   * Throttle animation triggers for scroll events
   */
  throttle: <T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Request animation frame wrapper
   */
  raf: (callback: () => void): number => {
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      return window.requestAnimationFrame(callback);
    }
    return setTimeout(callback, 16) as unknown as number; // 60fps fallback
  },

  /**
   * Cancel animation frame
   */
  cancelRaf: (id: number): void => {
    if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(id);
    } else {
      clearTimeout(id);
    }
  },

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Get optimal animation duration based on user preferences
   */
  getOptimalDuration: (baseDuration: number): number => {
    return animationUtils.prefersReducedMotion() ? baseDuration * 0.5 : baseDuration;
  },
};

// Global animation orchestrator instance
export const globalOrchestrator = new AnimationOrchestrator();

export default {
  AnimationOrchestrator,
  createStaggeredSequence,
  createTimeline,
  createResponsiveAnimation,
  animationUtils,
  globalOrchestrator,
};