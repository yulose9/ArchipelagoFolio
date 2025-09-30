export type UIComponentType = 'button' | 'card' | 'tooltip' | 'section-overlay';

export type AnimationState = 'idle' | 'animating-in' | 'visible' | 'animating-out' | 'hidden';

export interface UIComponent {
  type: UIComponentType;
  animationState: AnimationState;
  content: Record<string, any>;
  interactionTriggers: string[];
}

export interface InteractiveElement {
  id: string;
  component: UIComponent;
  position: {
    x: number;
    y: number;
  };
  isVisible: boolean;
}