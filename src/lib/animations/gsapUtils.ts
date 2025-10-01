import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export interface GSAPAnimationOptions {
    duration?: number;
    ease?: string;
    delay?: number;
    stagger?: number;
    repeat?: number;
    yoyo?: boolean;
    onComplete?: () => void;
    onStart?: () => void;
}

export interface ScrollTriggerOptions {
    trigger?: string | Element;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
    snap?: number | number[] | 'labels' | 'labelsDirectional' | ((value: number) => number);
    onUpdate?: (self: ScrollTrigger) => void;
    onToggle?: (self: ScrollTrigger) => void;
}

export class GSAPUtils {
    // Create a basic timeline
    static createTimeline(options?: GSAPAnimationOptions) {
        return gsap.timeline({
            duration: options?.duration || 1,
            ease: options?.ease || 'power2.out',
            delay: options?.delay || 0,
            repeat: options?.repeat || 0,
            yoyo: options?.yoyo || false,
            onComplete: options?.onComplete,
            onStart: options?.onStart,
        });
    }

    // Fade in animation
    static fadeIn(
        target: string | Element | Element[],
        options: GSAPAnimationOptions = {}
    ) {
        return gsap.fromTo(
            target,
            { opacity: 0 },
            {
                opacity: 1,
                duration: options.duration || 0.8,
                ease: options.ease || 'power2.out',
                delay: options.delay || 0,
                stagger: options.stagger || 0,
                onComplete: options.onComplete,
                onStart: options.onStart,
            }
        );
    }

    // Slide in from bottom
    static slideInUp(
        target: string | Element | Element[],
        options: GSAPAnimationOptions = {}
    ) {
        return gsap.fromTo(
            target,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: options.duration || 0.8,
                ease: options.ease || 'power2.out',
                delay: options.delay || 0,
                stagger: options.stagger || 0,
                onComplete: options.onComplete,
                onStart: options.onStart,
            }
        );
    }

    // Scale animation
    static scaleIn(
        target: string | Element | Element[],
        options: GSAPAnimationOptions = {}
    ) {
        return gsap.fromTo(
            target,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: options.duration || 0.6,
                ease: options.ease || 'back.out(1.7)',
                delay: options.delay || 0,
                stagger: options.stagger || 0,
                onComplete: options.onComplete,
                onStart: options.onStart,
            }
        );
    }

    // Staggered text animation
    static animateText(
        target: string | Element,
        options: GSAPAnimationOptions = {}
    ) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return null;

        // Split text into characters
        const text = element.textContent || '';
        const chars = text.split('').map(char =>
            char === ' ' ? '&nbsp;' : `<span style="display: inline-block;">${char}</span>`
        ).join('');

        element.innerHTML = chars;

        const charElements = element.querySelectorAll('span');

        return gsap.fromTo(
            charElements,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: options.duration || 0.6,
                ease: options.ease || 'power2.out',
                stagger: options.stagger || 0.05,
                delay: options.delay || 0,
                onComplete: options.onComplete,
                onStart: options.onStart,
            }
        );
    }

    // Create scroll-triggered animation
    static createScrollTrigger(
        target: string | Element | Element[],
        animation: GSAPAnimationOptions,
        scrollOptions: ScrollTriggerOptions
    ) {
        if (typeof window === 'undefined') return null;

        return gsap.fromTo(
            target,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: animation.duration || 0.8,
                ease: animation.ease || 'power2.out',
                scrollTrigger: {
                    trigger: scrollOptions.trigger,
                    start: scrollOptions.start || 'top 80%',
                    end: scrollOptions.end || 'bottom 20%',
                    scrub: scrollOptions.scrub || false,
                    pin: scrollOptions.pin || false,
                    snap: scrollOptions.snap as any,
                    onUpdate: scrollOptions.onUpdate,
                    onToggle: scrollOptions.onToggle,
                },
                onComplete: animation.onComplete,
                onStart: animation.onStart,
            }
        );
    }

    // Parallax effect
    static createParallax(
        target: string | Element,
        speed: number = 0.5,
        scrollOptions: Partial<ScrollTriggerOptions> = {}
    ) {
        if (typeof window === 'undefined') return null;

        return gsap.to(target, {
            yPercent: -50 * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: scrollOptions.trigger || target,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                ...scrollOptions,
            },
        });
    }

    // Cleanup all ScrollTriggers
    static killAllScrollTriggers() {
        if (typeof window !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }

    // Refresh ScrollTriggers (useful after dynamic content changes)
    static refreshScrollTriggers() {
        if (typeof window !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    // Custom easing functions
    static easings = {
        elastic: 'elastic.out(1, 0.3)',
        bounce: 'bounce.out',
        back: 'back.out(1.7)',
        expo: 'expo.out',
        circ: 'circ.out',
        power2: 'power2.out',
        power3: 'power3.out',
        power4: 'power4.out',
    };
}

export default GSAPUtils;