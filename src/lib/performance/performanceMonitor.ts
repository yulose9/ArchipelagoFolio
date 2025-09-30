/**
 * Performance monitoring utilities for the portfolio application
 * Constitutional requirement: 60fps animations, <2s loading times
 */

interface PerformanceMetrics {
  fps: number;
  loadTime: number;
  memoryUsage: number;
  paintTimes: number[];
  interactionDelay: number;
}

interface PerformanceBudget {
  maxLoadTime: number; // 2000ms
  minFPS: number; // 60fps
  maxMemoryUsage: number; // 100MB
  maxInteractionDelay: number; // 100ms
}

// Constitutional performance requirements
const PERFORMANCE_BUDGET: PerformanceBudget = {
  maxLoadTime: 2000,
  minFPS: 60,
  maxMemoryUsage: 100 * 1024 * 1024, // 100MB in bytes
  maxInteractionDelay: 100,
};

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private frameCount = 0;
  private frameStartTime = 0;
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    this.setupPerformanceObservers();
    this.startFPSMonitoring();
    this.measureLoadTime();
  }

  private setupPerformanceObservers() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.metrics.interactionDelay = fid;
          console.log('FID:', fid);
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    }
  }

  private startFPSMonitoring() {
    this.frameStartTime = performance.now();
    this.frameCount = 0;

    const measureFPS = () => {
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - this.frameStartTime >= 1000) {
        this.metrics.fps = this.frameCount;
        console.log('Current FPS:', this.metrics.fps);
        
        // Reset for next measurement
        this.frameCount = 0;
        this.frameStartTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  private measureLoadTime() {
    const navigationStart = performance.timing?.navigationStart || 0;
    const loadComplete = performance.timing?.loadEventEnd || 0;
    
    if (loadComplete > 0) {
      this.metrics.loadTime = loadComplete - navigationStart;
    } else {
      // Fallback: measure when DOM is ready
      document.addEventListener('DOMContentLoaded', () => {
        this.metrics.loadTime = performance.now();
      });
    }
  }

  public getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize;
    }
    return 0;
  }

  public checkPerformance(): { 
    passes: boolean; 
    metrics: PerformanceMetrics; 
    violations: string[] 
  } {
    const currentMetrics: PerformanceMetrics = {
      fps: this.metrics.fps || 0,
      loadTime: this.metrics.loadTime || 0,
      memoryUsage: this.getMemoryUsage(),
      paintTimes: this.getPaintTimes(),
      interactionDelay: this.metrics.interactionDelay || 0,
    };

    const violations: string[] = [];

    if (currentMetrics.loadTime > PERFORMANCE_BUDGET.maxLoadTime) {
      violations.push(`Load time ${currentMetrics.loadTime}ms exceeds budget ${PERFORMANCE_BUDGET.maxLoadTime}ms`);
    }

    if (currentMetrics.fps < PERFORMANCE_BUDGET.minFPS && currentMetrics.fps > 0) {
      violations.push(`FPS ${currentMetrics.fps} below minimum ${PERFORMANCE_BUDGET.minFPS}`);
    }

    if (currentMetrics.memoryUsage > PERFORMANCE_BUDGET.maxMemoryUsage) {
      violations.push(`Memory usage ${Math.round(currentMetrics.memoryUsage / 1024 / 1024)}MB exceeds budget ${PERFORMANCE_BUDGET.maxMemoryUsage / 1024 / 1024}MB`);
    }

    if (currentMetrics.interactionDelay > PERFORMANCE_BUDGET.maxInteractionDelay) {
      violations.push(`Interaction delay ${currentMetrics.interactionDelay}ms exceeds budget ${PERFORMANCE_BUDGET.maxInteractionDelay}ms`);
    }

    return {
      passes: violations.length === 0,
      metrics: currentMetrics,
      violations,
    };
  }

  private getPaintTimes(): number[] {
    const paintEntries = performance.getEntriesByType('paint');
    return paintEntries.map(entry => entry.startTime);
  }

  public generateReport(): string {
    const check = this.checkPerformance();
    
    let report = '🚀 Performance Report\n';
    report += '========================\n\n';
    
    if (check.passes) {
      report += '✅ All performance requirements met!\n\n';
    } else {
      report += '❌ Performance violations detected:\n';
      check.violations.forEach(violation => {
        report += `   • ${violation}\n`;
      });
      report += '\n';
    }
    
    report += 'Metrics:\n';
    report += `   📊 Load Time: ${check.metrics.loadTime}ms (budget: ${PERFORMANCE_BUDGET.maxLoadTime}ms)\n`;
    report += `   🎮 FPS: ${check.metrics.fps} (budget: ${PERFORMANCE_BUDGET.minFPS}+)\n`;
    report += `   💾 Memory: ${Math.round(check.metrics.memoryUsage / 1024 / 1024)}MB (budget: ${PERFORMANCE_BUDGET.maxMemoryUsage / 1024 / 1024}MB)\n`;
    report += `   ⚡ Interaction Delay: ${check.metrics.interactionDelay}ms (budget: ${PERFORMANCE_BUDGET.maxInteractionDelay}ms)\n`;
    
    if (check.metrics.paintTimes.length > 0) {
      report += `   🎨 Paint Times: ${check.metrics.paintTimes.join('ms, ')}ms\n`;
    }
    
    return report;
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Utility functions for performance testing
export const performanceUtils = {
  /**
   * Measure animation frame rate during a specific action
   */
  measureAnimationFPS: async (action: () => Promise<void>, duration: number = 1000): Promise<number> => {
    let frameCount = 0;
    const startTime = performance.now();
    
    const countFrames = () => {
      frameCount++;
      if (performance.now() - startTime < duration) {
        requestAnimationFrame(countFrames);
      }
    };
    
    requestAnimationFrame(countFrames);
    await action();
    
    const elapsed = performance.now() - startTime;
    return (frameCount / elapsed) * 1000;
  },

  /**
   * Measure memory usage before and after an operation
   */
  measureMemoryImpact: (operation: () => void): { before: number; after: number; delta: number } => {
    const before = (performance as any).memory?.usedJSHeapSize || 0;
    operation();
    const after = (performance as any).memory?.usedJSHeapSize || 0;
    
    return {
      before,
      after,
      delta: after - before,
    };
  },

  /**
   * Benchmark function execution time
   */
  benchmark: (fn: () => void, iterations: number = 1000): { average: number; min: number; max: number } => {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn();
      const end = performance.now();
      times.push(end - start);
    }
    
    return {
      average: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
    };
  },

  /**
   * Check if device has sufficient resources for optimal experience
   */
  checkDeviceCapabilities: (): {
    isHighPerformance: boolean;
    memory: number;
    cores: number;
    connectionSpeed: string;
  } => {
    const memory = (navigator as any).deviceMemory || 4; // Default to 4GB if not available
    const cores = navigator.hardwareConcurrency || 4;
    const connection = (navigator as any).connection;
    const connectionSpeed = connection?.effectiveType || 'unknown';
    
    const isHighPerformance = memory >= 4 && cores >= 4 && 
      ['4g', '3g'].includes(connectionSpeed);
    
    return {
      isHighPerformance,
      memory,
      cores,
      connectionSpeed,
    };
  },
};

// Global performance monitor instance
export const globalPerformanceMonitor = typeof window !== 'undefined' 
  ? new PerformanceMonitor() 
  : null;

// Development performance logging
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    if (globalPerformanceMonitor) {
      console.log(globalPerformanceMonitor.generateReport());
    }
  }, 10000); // Log every 10 seconds in development
}

export { PerformanceMonitor, PERFORMANCE_BUDGET };
export type { PerformanceMetrics, PerformanceBudget };