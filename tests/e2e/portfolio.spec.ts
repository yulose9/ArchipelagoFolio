import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText('John Doe');
    
    // Check for hero section
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });

  test('should display 3D map or fallback', async ({ page }) => {
    // Wait for map to load or fallback to appear
    await page.waitForTimeout(3000);
    
    // Either the map canvas or fallback should be visible
    const mapCanvas = page.locator('canvas');
    const mapFallback = page.locator('text=Map Unavailable');
    
    const hasMap = await mapCanvas.count() > 0;
    const hasFallback = await mapFallback.count() > 0;
    
    expect(hasMap || hasFallback).toBeTruthy();
  });

  test('should navigate through portfolio sections', async ({ page }) => {
    // Scroll to trigger section visibility
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(500);
    
    // Check for portfolio sections
    const aboutSection = page.locator('text=About Me');
    const projectsSection = page.locator('text=Featured Projects');
    const skillsSection = page.locator('text=Technical Skills');
    const contactSection = page.locator('text=Get In Touch');
    
    await expect(aboutSection).toBeVisible();
    
    // Scroll to projects section
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    await page.waitForTimeout(500);
    await expect(projectsSection).toBeVisible();
    
    // Scroll to skills section
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
    await page.waitForTimeout(500);
    await expect(skillsSection).toBeVisible();
    
    // Scroll to contact section
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 4));
    await page.waitForTimeout(500);
    await expect(contactSection).toBeVisible();
  });

  test('should display scroll progress indicator', async ({ page }) => {
    const scrollIndicator = page.locator('[style*="scaleX"]').first();
    await expect(scrollIndicator).toBeVisible();
    
    // Scroll down and check if indicator updates
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(300);
    
    // The scroll indicator should still be visible
    await expect(scrollIndicator).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if content is still accessible
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle error boundary gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/*', route => {
      if (route.request().url().includes('mapbox')) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Page should still be functional even with map errors
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should maintain 60fps performance during scroll', async ({ page }) => {
    // Start performance monitoring
    await page.evaluate(() => {
      window.performanceMetrics = {
        frameCount: 0,
        startTime: performance.now(),
      };
      
      function countFrames() {
        window.performanceMetrics.frameCount++;
        requestAnimationFrame(countFrames);
      }
      countFrames();
    });
    
    // Perform scroll animation
    await page.evaluate(() => {
      const start = Date.now();
      const duration = 2000; // 2 seconds
      
      function smoothScroll() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeInOutQuad = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        window.scrollTo(0, easeInOutQuad * window.innerHeight * 3);
        
        if (progress < 1) {
          requestAnimationFrame(smoothScroll);
        }
      }
      smoothScroll();
    });
    
    await page.waitForTimeout(2500);
    
    // Check performance metrics
    const fps = await page.evaluate(() => {
      const elapsed = performance.now() - window.performanceMetrics.startTime;
      return (window.performanceMetrics.frameCount / elapsed) * 1000;
    });
    
    // Should maintain close to 60fps (allowing some tolerance)
    expect(fps).toBeGreaterThan(50);
  });

  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds (allowing for slow CI environments)
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check for skip link
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check for alt text on images (if any)
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
    
    // Check for focus management
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if focused element is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test escape key functionality (if applicable)
    await page.keyboard.press('Escape');
  });
});