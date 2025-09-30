'use client';

import { useEffect, useRef, useCallback } from 'react';
import { MapRegion } from '../types/MapRegion';

export interface UseMapAnimationProps {
  mapInstance?: mapboxgl.Map | null;
  animationDuration?: number;
  easing?: [number, number, number, number];
}

export interface MapAnimationControls {
  flyToRegion: (region: MapRegion) => Promise<boolean>;
  animateToCoordinates: (coordinates: [number, number], zoom?: number) => Promise<boolean>;
  getCurrentViewState: () => MapRegion | null;
  isAnimating: boolean;
}

export const useMapAnimation = ({
  mapInstance,
  animationDuration = 2000,
  easing = [0.25, 0.46, 0.45, 0.94],
}: UseMapAnimationProps): MapAnimationControls => {
  const isAnimatingRef = useRef(false);
  const animationPromiseRef = useRef<{
    resolve: (value: boolean) => void;
    reject: (reason: any) => void;
  } | null>(null);

  const flyToRegion = useCallback(
    (region: MapRegion): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        if (!mapInstance || isAnimatingRef.current) {
          resolve(false);
          return;
        }

        isAnimatingRef.current = true;
        animationPromiseRef.current = { resolve, reject };

        try {
          mapInstance.flyTo({
            center: region.center,
            zoom: region.zoom,
            bearing: region.bearing,
            pitch: region.pitch,
            duration: animationDuration,
            easing: (t: number) => {
              // Custom easing function using bezier curve
              const [x1, y1, x2, y2] = easing;
              // Simplified bezier calculation
              return t * t * (3 - 2 * t);
            },
          });

          // Listen for animation completion
          const onMoveEnd = () => {
            isAnimatingRef.current = false;
            mapInstance.off('moveend', onMoveEnd);
            mapInstance.off('error', onError);
            
            if (animationPromiseRef.current) {
              animationPromiseRef.current.resolve(true);
              animationPromiseRef.current = null;
            }
          };

          const onError = (error: any) => {
            isAnimatingRef.current = false;
            mapInstance.off('moveend', onMoveEnd);
            mapInstance.off('error', onError);
            
            if (animationPromiseRef.current) {
              animationPromiseRef.current.reject(error);
              animationPromiseRef.current = null;
            }
          };

          mapInstance.once('moveend', onMoveEnd);
          mapInstance.once('error', onError);

        } catch (error) {
          isAnimatingRef.current = false;
          reject(error);
        }
      });
    },
    [mapInstance, animationDuration, easing]
  );

  const animateToCoordinates = useCallback(
    (coordinates: [number, number], zoom = 10): Promise<boolean> => {
      const region: MapRegion = {
        name: 'Custom Location',
        center: coordinates,
        zoom,
        bearing: 0,
        pitch: 45,
      };
      
      return flyToRegion(region);
    },
    [flyToRegion]
  );

  const getCurrentViewState = useCallback((): MapRegion | null => {
    if (!mapInstance) return null;

    try {
      const center = mapInstance.getCenter();
      const zoom = mapInstance.getZoom();
      const bearing = mapInstance.getBearing();
      const pitch = mapInstance.getPitch();

      return {
        name: 'Current View',
        center: [center.lng, center.lat],
        zoom,
        bearing,
        pitch,
      };
    } catch (error) {
      console.error('Error getting map view state:', error);
      return null;
    }
  }, [mapInstance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationPromiseRef.current) {
        animationPromiseRef.current.resolve(false);
        animationPromiseRef.current = null;
      }
      isAnimatingRef.current = false;
    };
  }, []);

  return {
    flyToRegion,
    animateToCoordinates,
    getCurrentViewState,
    isAnimating: isAnimatingRef.current,
  };
};

export default useMapAnimation;