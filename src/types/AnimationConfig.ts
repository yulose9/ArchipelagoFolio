export interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
  scrollTrigger: ScrollTriggerConfig;
}

export interface ScrollTriggerConfig {
  start: string;
  end: string;
  scrub?: boolean;
  pin?: boolean;
  snap?: boolean;
}

export interface GSAPAnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
  stagger?: number;
  repeat?: number;
  yoyo?: boolean;
}

export interface FramerMotionVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration: number;
      ease: string;
      delay?: number;
      staggerChildren?: number;
    };
  };
}

export type EasingFunction = 
  | 'linear'
  | 'easeIn'
  | 'easeOut' 
  | 'easeInOut'
  | 'anticipate'
  | 'backIn'
  | 'backOut'
  | 'backInOut'
  | 'bounceIn'
  | 'bounceOut'
  | 'bounceInOut'
  | 'circIn'
  | 'circOut'
  | 'circInOut';