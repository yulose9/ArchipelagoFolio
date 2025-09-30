"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapRegion {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export interface MapboxMapProps {
  className?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
  onRegionChange?: (region: MapRegion) => void;
  initialRegion?: MapRegion;
}

export interface MapboxMapRef {
  getMap: () => mapboxgl.Map | null;
  flyTo: (region: MapRegion) => void;
  easeTo: (region: MapRegion) => void;
  animateCamera: (options: {
    center?: [number, number];
    zoom?: number;
    pitch?: number;
    bearing?: number;
    duration?: number;
  }) => void;
}

const MapboxMap = forwardRef<MapboxMapRef, MapboxMapProps>(
  ({ className, onMapLoad, onRegionChange, initialRegion }, ref) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const currentRegionRef = useRef<MapRegion | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Default region (Philippines center)
    const defaultRegion: MapRegion = {
      latitude: 12.8797,
      longitude: 121.774,
      zoom: 5.5,
      pitch: 45,
      bearing: 0,
    };

    const region = initialRegion || defaultRegion;

    // Expose map methods via ref
    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
      
      // Smooth animated transition with curve
      flyTo: (newRegion: MapRegion) => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
          // Cancel any ongoing animations
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          
          mapRef.current.flyTo({
            center: [newRegion.longitude, newRegion.latitude],
            zoom: newRegion.zoom,
            pitch: newRegion.pitch || 0,
            bearing: newRegion.bearing || 0,
            duration: 3000, // 3 second smooth animation
            essential: true,
            curve: 1.42, // Natural curve for the animation path
            speed: 0.6, // Moderate speed
            easing: (t: number) => t * (2 - t), // Ease out quad
          });
        }
      },
      
      // Quick animated transition
      easeTo: (newRegion: MapRegion) => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
          mapRef.current.easeTo({
            center: [newRegion.longitude, newRegion.latitude],
            zoom: newRegion.zoom,
            pitch: newRegion.pitch || 0,
            bearing: newRegion.bearing || 0,
            duration: 1500,
            essential: true,
            easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
          });
        }
      },
      
      // Custom camera animation
      animateCamera: (options) => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
          const {
            center,
            zoom,
            pitch,
            bearing,
            duration = 2000,
          } = options;
          
          const animationOptions: any = {
            duration,
            essential: true,
          };
          
          if (center) animationOptions.center = center;
          if (zoom !== undefined) animationOptions.zoom = zoom;
          if (pitch !== undefined) animationOptions.pitch = pitch;
          if (bearing !== undefined) animationOptions.bearing = bearing;
          
          mapRef.current.easeTo(animationOptions);
        }
      },
    }));

    // Subtle hover/idle animation
    const startHoverAnimation = (targetRegion: MapRegion) => {
      if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

      const map = mapRef.current;
      const startTime = Date.now();
      const baseBearing = targetRegion.bearing || 0;
      const basePitch = targetRegion.pitch || 45;
      
      const animate = () => {
        if (!map || !map.isStyleLoaded()) return;
        
        const elapsed = (Date.now() - startTime) / 1000; // seconds
        
        // Gentle orbital motion
        const bearingOffset = Math.sin(elapsed * 0.1) * 3; // ±3 degrees
        const pitchOffset = Math.sin(elapsed * 0.08) * 2; // ±2 degrees
        
        map.setBearing(baseBearing + bearingOffset);
        map.setPitch(Math.min(60, Math.max(30, basePitch + pitchOffset)));
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      // Cancel any existing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
      if (!mapContainerRef.current) return;

      // Use correct environment variable name
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      
      console.log('🗺️ Mapbox initialization:', {
        hasToken: !!accessToken,
        tokenPrefix: accessToken?.substring(0, 10),
      });
      
      if (!accessToken) {
        const errorMsg = "Mapbox access token is missing. Check NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env.local";
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      if (!accessToken.startsWith('pk.')) {
        const errorMsg = "Invalid Mapbox token format. Token should start with 'pk.'";
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      mapboxgl.accessToken = accessToken;

      try {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/satellite-streets-v12", // Better 3D visualization
          center: [region.longitude, region.latitude],
          zoom: region.zoom,
          pitch: region.pitch || 45,
          bearing: region.bearing || 0,
          antialias: true,
          attributionControl: false,
          // Performance optimizations
          maxPitch: 85,
          touchPitch: true,
          touchZoomRotate: true,
          dragRotate: true,
        });

        mapRef.current = map;
        currentRegionRef.current = region;

        console.log('🗺️ Map instance created, waiting for load...');

        map.on("load", () => {
          console.log('✅ Map loaded successfully!');
          
          // Add 3D terrain for elevation
          map.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
          });

          map.setTerrain({ 
            source: "mapbox-dem", 
            exaggeration: 1.5 
          });

          // Add atmospheric sky layer
          map.addLayer({
            id: "sky",
            type: "sky",
            paint: {
              "sky-type": "atmosphere",
              "sky-atmosphere-sun": [0.0, 90.0],
              "sky-atmosphere-sun-intensity": 15,
            },
          });

          // Add 3D buildings
          const style = map.getStyle();
          const layers = style?.layers;
          const labelLayerId = layers?.find(
            (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
          )?.id;

          if (!map.getLayer('3d-buildings')) {
            map.addLayer(
              {
                id: '3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                minzoom: 12,
                paint: {
                  'fill-extrusion-color': '#aaa',
                  'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    12,
                    0,
                    12.05,
                    ['get', 'height'],
                  ],
                  'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    12,
                    0,
                    12.05,
                    ['get', 'min_height'],
                  ],
                  'fill-extrusion-opacity': 0.6,
                },
              },
              labelLayerId
            );
          }

          setIsLoaded(true);
          setError(null);
          
          if (onMapLoad) {
            onMapLoad(map);
          }

          // Start subtle animation after map loads
          setTimeout(() => {
            startHoverAnimation(region);
          }, 1000);
        });

        // Handle region changes
        const handleMoveEnd = () => {
          if (!map || !onRegionChange) return;
          
          const center = map.getCenter();
          const newRegion: MapRegion = {
            latitude: center.lat,
            longitude: center.lng,
            zoom: map.getZoom(),
            pitch: map.getPitch(),
            bearing: map.getBearing(),
          };
          
          currentRegionRef.current = newRegion;
          onRegionChange(newRegion);
        };

        map.on("moveend", handleMoveEnd);

        map.on("error", (e: mapboxgl.ErrorEvent) => {
          console.error("❌ Mapbox error:", e);
          setError(`Map error: ${e.error?.message || 'Unknown error'}`);
          setIsLoaded(false);
        });

        // Cleanup function
        return () => {
          console.log('🧹 Cleaning up map...');
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          map.remove();
        };
      } catch (err) {
        console.error("❌ Error initializing map:", err);
        setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }, []); // Empty deps - only run once

    // Update map when initialRegion changes
    useEffect(() => {
      if (mapRef.current && mapRef.current.isStyleLoaded() && initialRegion) {
        const map = mapRef.current;
        
        const currentLat = currentRegionRef.current?.latitude;
        const currentLng = currentRegionRef.current?.longitude;
        
        // Only fly if location actually changed
        if (currentLat !== initialRegion.latitude || currentLng !== initialRegion.longitude) {
          console.log('🎯 Flying to new region:', initialRegion);
          currentRegionRef.current = initialRegion;
          
          // Cancel idle animation
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          
          // Fly to new location
          map.flyTo({
            center: [initialRegion.longitude, initialRegion.latitude],
            zoom: initialRegion.zoom,
            pitch: initialRegion.pitch || 45,
            bearing: initialRegion.bearing || 0,
            duration: 3000,
            essential: true,
            curve: 1.42,
          });
          
          // Restart idle animation after flight
          setTimeout(() => {
            startHoverAnimation(initialRegion);
          }, 3500);
        }
      }
    }, [initialRegion]);

    if (error) {
      return (
        <div className={`flex items-center justify-center bg-gray-900 ${className || ""}`}>
          <div className="text-center text-white p-8">
            <p className="text-lg font-semibold mb-2">Map Error</p>
            <p className="text-sm text-gray-400 mb-4">{error}</p>
            <p className="text-xs text-gray-500">
              Check browser console for more details
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full min-h-screen">
        <div 
          ref={mapContainerRef} 
          className={`w-full h-full ${className || ""}`}
          style={{ minHeight: '100vh' }}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading 3D Map...</p>
              <p className="text-sm opacity-75 mt-2">Initializing Mapbox GL JS</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

MapboxMap.displayName = "MapboxMap";

export default MapboxMap;