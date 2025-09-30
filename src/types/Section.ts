export interface Section {
  id: string;
  title: string;
  content: string;
  mapRegion: MapRegion;
  animationConfig: AnimationConfig;
  order: number;
}

export interface MapRegion {
  name: string;
  center: [number, number]; // [longitude, latitude]
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
  scrollTrigger: {
    start: string;
    end: string;
  };
}

export type AnimationState = 'idle' | 'animating-in' | 'visible' | 'animating-out' | 'hidden';

export interface Coordinates {
  longitude: number;
  latitude: number;
  elevation?: number;
}