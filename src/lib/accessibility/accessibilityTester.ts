/**
 * Accessibility utilities and testing helpers
 * Constitutional requirement: WCAG 2.1 AA compliance
 */

interface AccessibilityCheckResult {
  passes: boolean;
  violations: string[];
  warnings: string[];
  score: number; // 0-100
}

interface ColorContrastCheck {
  foreground: string;
  background: string;
  ratio: number;
  passes: boolean;
  level: 'AA' | 'AAA' | 'fail';
}

class AccessibilityTester {
  private static readonly MIN_CONTRAST_RATIO_AA = 4.5;
  private static readonly MIN_CONTRAST_RATIO_AA_LARGE = 3;
  private static readonly MIN_CONTRAST_RATIO_AAA = 7;

  /**
   * Comprehensive accessibility audit
   */
  public static audit(): AccessibilityCheckResult {
    const violations: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check heading hierarchy
    const headingIssues = this.checkHeadingHierarchy();
    if (headingIssues.length > 0) {
      violations.push(...headingIssues);
      score -= 10;
    }

    // Check alt text for images
    const altTextIssues = this.checkAltText();
    if (altTextIssues.length > 0) {
      violations.push(...altTextIssues);
      score -= 15;
    }

    // Check color contrast
    const contrastIssues = this.checkColorContrast();
    if (contrastIssues.length > 0) {
      violations.push(...contrastIssues);
      score -= 20;
    }

    // Check keyboard navigation
    const keyboardIssues = this.checkKeyboardAccessibility();
    if (keyboardIssues.length > 0) {
      violations.push(...keyboardIssues);
      score -= 15;
    }

    // Check ARIA labels
    const ariaIssues = this.checkARIALabels();
    if (ariaIssues.length > 0) {
      violations.push(...ariaIssues);
      score -= 10;
    }

    // Check focus management
    const focusIssues = this.checkFocusManagement();
    if (focusIssues.length > 0) {
      violations.push(...focusIssues);
      score -= 10;
    }

    // Check semantic HTML
    const semanticIssues = this.checkSemanticHTML();
    if (semanticIssues.length > 0) {
      warnings.push(...semanticIssues);
      score -= 5;
    }

    return {
      passes: violations.length === 0,
      violations,
      warnings,
      score: Math.max(0, score),
    };
  }

  private static checkHeadingHierarchy(): string[] {
    const issues: string[] = [];
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    if (headings.length === 0) {
      issues.push('No headings found - page structure unclear');
      return issues;
    }

    // Check for h1
    const h1Elements = document.querySelectorAll('h1');
    if (h1Elements.length === 0) {
      issues.push('Missing h1 element - page should have exactly one h1');
    } else if (h1Elements.length > 1) {
      issues.push('Multiple h1 elements found - page should have exactly one h1');
    }

    // Check heading sequence
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && level !== 1) {
        issues.push('First heading should be h1');
      }
      
      if (level > previousLevel + 1) {
        issues.push(`Heading level jumps from h${previousLevel} to h${level} - should be sequential`);
      }
      
      previousLevel = level;
    });

    return issues;
  }

  private static checkAltText(): string[] {
    const issues: string[] = [];
    const images = Array.from(document.querySelectorAll('img'));
    
    images.forEach((img, index) => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src');
      
      if (alt === null) {
        issues.push(`Image ${index + 1} (${src}) missing alt attribute`);
      } else if (alt === '') {
        // Empty alt is OK for decorative images, but check if it's truly decorative
        const isDecorative = img.hasAttribute('role') && img.getAttribute('role') === 'presentation';
        if (!isDecorative) {
          // This might be a warning rather than error
          // issues.push(`Image ${index + 1} has empty alt text - ensure it's decorative`);
        }
      } else if (alt.toLowerCase().includes('image') || alt.toLowerCase().includes('picture')) {
        issues.push(`Image ${index + 1} alt text contains redundant word 'image' or 'picture'`);
      }
    });

    return issues;
  }

  private static checkColorContrast(): string[] {
    const issues: string[] = [];
    const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span, div'));
    
    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrast = this.calculateContrastRatio(color, backgroundColor);
        if (contrast.ratio < this.MIN_CONTRAST_RATIO_AA) {
          issues.push(`Low contrast ratio ${contrast.ratio.toFixed(2)}:1 for element with text "${element.textContent?.slice(0, 50)}..."`);
        }
      }
    });

    return issues;
  }

  private static checkKeyboardAccessibility(): string[] {
    const issues: string[] = [];
    const interactiveElements = Array.from(document.querySelectorAll('button, a, input, select, textarea, [tabindex]'));
    
    interactiveElements.forEach((element) => {
      const tabIndex = element.getAttribute('tabindex');
      
      // Check for positive tabindex (anti-pattern)
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push(`Element has positive tabindex (${tabIndex}) - avoid positive tabindex values`);
      }
      
      // Check for missing focus styles
      const styles = window.getComputedStyle(element, ':focus');
      const outlineStyle = styles.outline;
      const outlineWidth = styles.outlineWidth;
      
      if (outlineStyle === 'none' || outlineWidth === '0px') {
        // Check if there's a custom focus style
        const boxShadow = styles.boxShadow;
        const border = styles.border;
        
        if (!boxShadow.includes('inset') && !border.includes('solid')) {
          issues.push(`Interactive element lacks visible focus indicator`);
        }
      }
    });

    // Check for skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    let hasSkipToMain = false;
    
    skipLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === '#main-content' || href === '#main') {
        hasSkipToMain = true;
      }
    });
    
    if (!hasSkipToMain) {
      issues.push('Missing skip to main content link');
    }

    return issues;
  }

  private static checkARIALabels(): string[] {
    const issues: string[] = [];
    
    // Check for buttons without accessible names
    const buttons = Array.from(document.querySelectorAll('button'));
    buttons.forEach((button) => {
      const hasText = button.textContent?.trim();
      const hasAriaLabel = button.getAttribute('aria-label');
      const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        issues.push('Button without accessible name (text, aria-label, or aria-labelledby)');
      }
    });

    // Check for form inputs without labels
    const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
    inputs.forEach((input) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      let hasLabel = false;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) hasLabel = true;
      }
      
      if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
        issues.push(`Form input without proper label (${input.tagName.toLowerCase()}, type: ${input.getAttribute('type') || 'text'})`);
      }
    });

    return issues;
  }

  private static checkFocusManagement(): string[] {
    const issues: string[] = [];
    
    // Check if focus is trapped in modals (basic check)
    const modals = document.querySelectorAll('[role="dialog"], .modal');
    modals.forEach((modal) => {
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length === 0) {
        issues.push('Modal without focusable elements');
      }
    });

    return issues;
  }

  private static checkSemanticHTML(): string[] {
    const warnings: string[] = [];
    
    // Check for semantic structure
    const hasMain = document.querySelector('main');
    const hasHeader = document.querySelector('header');
    const hasFooter = document.querySelector('footer');
    const hasNav = document.querySelector('nav');
    
    if (!hasMain) {
      warnings.push('Consider using <main> element for main content');
    }
    
    if (!hasHeader) {
      warnings.push('Consider using <header> element for site header');
    }
    
    if (!hasFooter) {
      warnings.push('Consider using <footer> element for site footer');
    }
    
    if (!hasNav) {
      warnings.push('Consider using <nav> element for navigation');
    }

    // Check for excessive div usage
    const divs = document.querySelectorAll('div');
    const semanticElements = document.querySelectorAll('main, header, footer, nav, section, article, aside');
    
    if (divs.length > semanticElements.length * 3) {
      warnings.push('High ratio of div elements - consider using semantic HTML elements');
    }

    return warnings;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  private static calculateContrastRatio(color1: string, color2: string): ColorContrastCheck {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    
    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    const ratio = (lighter + 0.05) / (darker + 0.05);
    
    let level: 'AA' | 'AAA' | 'fail' = 'fail';
    if (ratio >= this.MIN_CONTRAST_RATIO_AAA) {
      level = 'AAA';
    } else if (ratio >= this.MIN_CONTRAST_RATIO_AA) {
      level = 'AA';
    }
    
    return {
      foreground: color1,
      background: color2,
      ratio,
      passes: ratio >= this.MIN_CONTRAST_RATIO_AA,
      level,
    };
  }

  private static parseColor(color: string): [number, number, number] {
    // Simple RGB parser (would need enhancement for all color formats)
    const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgb) {
      return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])];
    }
    
    // Default to black if parsing fails
    return [0, 0, 0];
  }

  private static getLuminance([r, g, b]: [number, number, number]): number {
    const [rs, gs, bs] = [r, g, b].map(component => {
      component = component / 255;
      return component <= 0.03928
        ? component / 12.92
        : Math.pow((component + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Generate accessibility report
   */
  public static generateReport(): string {
    const audit = this.audit();
    
    let report = '♿ Accessibility Report\n';
    report += '======================\n\n';
    
    if (audit.passes) {
      report += '✅ All accessibility checks passed!\n\n';
    } else {
      report += `❌ ${audit.violations.length} accessibility violations found:\n`;
      audit.violations.forEach(violation => {
        report += `   • ${violation}\n`;
      });
      report += '\n';
    }
    
    if (audit.warnings.length > 0) {
      report += `⚠️  ${audit.warnings.length} accessibility warnings:\n`;
      audit.warnings.forEach(warning => {
        report += `   • ${warning}\n`;
      });
      report += '\n';
    }
    
    report += `📊 Accessibility Score: ${audit.score}/100\n\n`;
    
    if (audit.score >= 90) {
      report += '🏆 Excellent accessibility!';
    } else if (audit.score >= 70) {
      report += '👍 Good accessibility, minor improvements needed';
    } else if (audit.score >= 50) {
      report += '⚠️  Moderate accessibility issues need attention';
    } else {
      report += '🚨 Significant accessibility issues require immediate attention';
    }
    
    return report;
  }
}

// Utility functions for accessibility testing
export const accessibilityUtils = {
  /**
   * Check if element is focusable
   */
  isFocusable: (element: Element): boolean => {
    const focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];
    
    return focusableElements.some(selector => element.matches(selector));
  },

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements: (container: Element = document.body): Element[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];
    
    return Array.from(container.querySelectorAll(focusableSelectors.join(', ')));
  },

  /**
   * Test keyboard navigation
   */
  testKeyboardNavigation: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const focusableElements = accessibilityUtils.getFocusableElements();
      let currentIndex = 0;
      
      const testNext = () => {
        if (currentIndex >= focusableElements.length) {
          resolve(true);
          return;
        }
        
        const element = focusableElements[currentIndex] as HTMLElement;
        element.focus();
        
        // Check if element actually received focus
        if (document.activeElement === element) {
          currentIndex++;
          setTimeout(testNext, 50);
        } else {
          console.warn('Element could not receive focus:', element);
          resolve(false);
        }
      };
      
      testNext();
    });
  },

  /**
   * Announce message to screen readers
   */
  announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Check if user prefers high contrast
   */
  prefersHighContrast: (): boolean => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  },
};

// Development accessibility monitoring
if (process.env.NODE_ENV === 'development') {
  // Run accessibility audit periodically in development
  setInterval(() => {
    console.log(AccessibilityTester.generateReport());
  }, 30000); // Every 30 seconds in development
}

export { AccessibilityTester };
export type { AccessibilityCheckResult, ColorContrastCheck };