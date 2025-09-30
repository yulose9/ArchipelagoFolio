import { PHILIPPINES_BOUNDS, PHILIPPINES_CENTER } from '../../types/MapRegion';

export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
  style: 'mapbox://styles/mapbox/satellite-streets-v12',
  center: PHILIPPINES_CENTER,
  zoom: 6,
  pitch: 45,
  bearing: 0,
  bounds: PHILIPPINES_BOUNDS,
  maxZoom: 18,
  minZoom: 3,
};

export const MAP_ANIMATION_CONFIG = {
  duration: 2000,
  easing: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
  padding: {
    top: 100,
    bottom: 100,
    left: 100,
    right: 100,
  },
};

export const PERFORMANCE_CONFIG = {
  maxTileCacheSize: 50,
  localIdeographFontFamily: 'sans-serif',
  collectResourceTiming: false,
  fadeDuration: 300,
  crossSourceCollisions: true,
};

export const validateMapboxToken = (): boolean => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  return !!(token && token.startsWith('pk.'));
};

export const getMapboxStyleUrl = (styleId: string = 'satellite-streets-v12'): string => {
  return `mapbox://styles/mapbox/${styleId}`;
};

export const createMapboxConfig = (overrides?: Partial<typeof MAPBOX_CONFIG>) => {
  return {
    ...MAPBOX_CONFIG,
    ...overrides,
  };
};