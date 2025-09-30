'use client';

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapRegion, PHILIPPINES_BOUNDS } from '../../types/MapRegion';

import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
    className?: string;
    onMapLoad?: (map: mapboxgl.Map) => void;
    onRegionChange?: (region: MapRegion) => void;
    initialRegion?: MapRegion;
}

export interface MapboxMapRef {
    flyTo: (region: MapRegion) => void;
    getMap: () => mapboxgl.Map | null;
    startCinematicTour: () => void;
}

// Metro Manila cinematic tour stops
const METRO_MANILA_TOUR = [
    {
        name: 'South Luzon Overview',
        center: [121.0, 14.2] as [number, number],
        zoom: 9,
        pitch: 40,
        bearing: 0,
        duration: 4000
    },
    {
        name: 'Makati CBD - Ayala Avenue',
        center: [121.0280, 14.5547] as [number, number],
        zoom: 16.5,
        pitch: 70,
        bearing: 135,
        duration: 6000
    },
    {
        name: 'Manila Bay Area',
        center: [120.9842, 14.5995] as [number, number],
        zoom: 15.5,
        pitch: 65,
        bearing: 90,
        duration: 5000
    },
    {
        name: 'BGC - Bonifacio Global City',
        center: [121.0494, 14.5507] as [number, number],
        zoom: 16.5,
        pitch: 75,
        bearing: 180,
        duration: 6000
    },
    {
        name: 'Ortigas Center',
        center: [121.0556, 14.5858] as [number, number],
        zoom: 16,
        pitch: 70,
        bearing: 270,
        duration: 5000
    },
    {
        name: 'North Luzon Overview',
        center: [121.0, 14.8] as [number, number],
        zoom: 9.5,
        pitch: 35,
        bearing: 0,
        duration: 4000
    }
];

const MapboxMap = forwardRef<MapboxMapRef, MapboxMapProps>(({
    className = '',
    onMapLoad,
    onRegionChange,
    initialRegion,
}, ref) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const flyTo = useCallback((region: MapRegion) => {
        if (!mapRef.current || !mapRef.current.isStyleLoaded()) {
            console.warn('Cannot fly to region: map not ready');
            return;
        }

        console.log('🎯 Flying to region:', region.name, region.center);
        
        mapRef.current.flyTo({
            center: region.center,
            zoom: region.zoom,
            bearing: region.bearing || 0,
            pitch: region.pitch || 60,
            duration: 4000,
            easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            essential: true,
            curve: 1.4,
            speed: 0.4
        });
        
    }, []);

    // Helper functions for smooth animations
    const lerp = (a: number | [number, number], b: number | [number, number], t: number): number | [number, number] => {
        if (Array.isArray(a) && Array.isArray(b)) {
            return [
                a[0] * (1.0 - t) + b[0] * t,
                a[1] * (1.0 - t) + b[1] * t
            ] as [number, number];
        } else if (typeof a === 'number' && typeof b === 'number') {
            return a * (1.0 - t) + b * t;
        }
        return a;
    };

    const easeInOutQuad = (t: number): number => {
        return t < 0.5 ? 2.0 * t * t : (4.0 - 2.0 * t) * t - 1.0;
    };

    const easeInCubic = (t: number): number => {
        return t * t * t;
    };

    const easeOutCubic = (t: number): number => {
        return 1 - Math.pow(1 - t, 3);
    };

    const startCinematicTour = useCallback(() => {
        if (!mapRef.current || !mapRef.current.isStyleLoaded()) {
            console.warn('Cannot start tour: map not ready');
            return;
        }

        let animationIndex = 0;
        let animationTime = 0.0;

        // Enhanced cinematic animations with drone-like movement
        const animations = [
            {
                name: 'South Luzon Approach',
                duration: 4.0,
                animate: (phase: number) => {
                    const start = [121.0, 13.8] as [number, number];
                    const end = [121.0, 14.2] as [number, number];
                    const alt = [15000, 8000]; // Start high, descend
                    const target = [121.0280, 14.5547] as [number, number]; // Look at Makati
                    
                    const camera = mapRef.current?.getFreeCameraOptions();
                    if (!camera) return;
                    
                    const position = lerp(start, end, easeInOutQuad(phase)) as [number, number];
                    const altitude = lerp(alt[0], alt[1], easeOutCubic(phase)) as number;
                    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
                    camera.lookAtPoint(target);
                    mapRef.current?.setFreeCameraOptions(camera);
                }
            },
            {
                name: 'Swoop to Makati CBD',
                duration: 6.0,
                animate: (phase: number) => {
                    const start = [121.0, 14.2] as [number, number];
                    const end = [121.0280, 14.5547] as [number, number];
                    const alt = [8000, 500]; // Descend like a drone
                    const targetStart = [121.0280, 14.5547] as [number, number];
                    const targetEnd = [121.0300, 14.5560] as [number, number];
                    
                    const camera = mapRef.current?.getFreeCameraOptions();
                    if (!camera) return;
                    
                    const position = lerp(start, end, easeInOutQuad(phase)) as [number, number];
                    const altitude = lerp(alt[0], alt[1], easeInCubic(phase)) as number;
                    const target = lerp(targetStart, targetEnd, phase) as [number, number];
                    
                    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
                    camera.lookAtPoint(target);
                    mapRef.current?.setFreeCameraOptions(camera);
                }
            },
            {
                name: 'Orbit Makati',
                duration: 5.0,
                animate: (phase: number) => {
                    const center = [121.0280, 14.5547] as [number, number];
                    const radius = 0.01;
                    const altitude = 800;
                    const angle = phase * Math.PI * 2; // Full 360° orbit
                    
                    const camera = mapRef.current?.getFreeCameraOptions();
                    if (!camera) return;
                    
                    const position = [
                        center[0] + Math.cos(angle) * radius,
                        center[1] + Math.sin(angle) * radius
                    ] as [number, number];
                    
                    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
                    camera.lookAtPoint(center);
                    mapRef.current?.setFreeCameraOptions(camera);
                }
            },
            {
                name: 'Fly to Manila Bay',
                duration: 5.0,
                animate: (phase: number) => {
                    const start = [121.0280, 14.5547] as [number, number];
                    const end = [120.9842, 14.5995] as [number, number];
                    const alt = [800, 1200];
                    const target = [120.9842, 14.5995] as [number, number];
                    
                    const camera = mapRef.current?.getFreeCameraOptions();
                    if (!camera) return;
                    
                    const position = lerp(start, end, easeInOutQuad(phase)) as [number, number];
                    const altitude = lerp(alt[0], alt[1], phase) as number;
                    
                    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
                    camera.lookAtPoint(target);
                    mapRef.current?.setFreeCameraOptions(camera);
                }
            },
            {
                name: 'Glide to BGC',
                duration: 6.0,
                animate: (phase: number) => {
                    const start = [120.9842, 14.5995] as [number, number];
                    const end = [121.0494, 14.5507] as [number, number];
                    const alt = [1200, 600];
                    const targetStart = [121.0200, 14.5700] as [number, number];
                    const targetEnd = [121.0494, 14.5507] as [number, number];
                    
                    const camera = mapRef.current?.getFreeCameraOptions();
                    if (!camera) return;
                    
                    const position = lerp(start, end, easeInOutQuad(phase)) as [number, number];
                    const altitude = lerp(alt[0], alt[1], easeOutCubic(phase)) as number;
                    const target = lerp(targetStart, targetEnd, phase) as [number, number];
                    
                    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
                    camera.lookAtPoint(target);
                    mapRef.current?.setFreeCameraOptions(camera);
                }
            },
            {
                name: 'BGC Aerial View',
                duration: 4.0,
                animate: (phase: number) => {
                    const center = [121.0494, 14.5507] as [number, number];
                    const altitude = 600;
                    const angle = phase * Math.PI; // 180° sweep
                    const radius = 0.008;
                    
                    const camera = mapRef.current?.getFreeCameraOptions();
                    if (!camera) return;
                    
                    const position = [
                        center[0] + Math.cos(angle) * radius,
                        center[1] + Math.sin(angle) * radius
                    ] as [number, number];
                    
                    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
                    camera.lookAtPoint(center);
                    mapRef.current?.setFreeCameraOptions(camera);
                }
            },
            {
                name: 'Transit to Ortigas',
                duration: 5.0,
                animate: (phase: number) => {
                    const start = [121.0494, 14.5507] as [number, number];
                    const end = [121.0556, 14.5858] as [number, number];
                    const alt = [600, 1000];
                    
                    const camera = mapRef.current?.getFreeCameraOptions();
                    if (!camera) return;
                    
                    const position = lerp(start, end, easeInOutQuad(phase)) as [number, number];
                    const altitude = lerp(alt[0], alt[1], easeInOutQuad(phase)) as number;
                    
                    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
                    camera.lookAtPoint(end);
                    mapRef.current?.setFreeCameraOptions(camera);
                }
            },
            {
                name: 'Ascend to North Luzon',
                duration: 5.0,
                animate: (phase: number) => {
                    const start = [121.0556, 14.5858] as [number, number];
                    const end = [121.0, 14.9] as [number, number];
                    const alt = [1000, 12000]; // Climb high for overview
                    const targetStart = [121.0556, 14.6] as [number, number];
                    const targetEnd = [121.0, 15.0] as [number, number];
                    
                    const camera = mapRef.current?.getFreeCameraOptions();
                    if (!camera) return;
                    
                    const position = lerp(start, end, easeInOutQuad(phase)) as [number, number];
                    const altitude = lerp(alt[0], alt[1], easeInCubic(phase)) as number;
                    const target = lerp(targetStart, targetEnd, phase) as [number, number];
                    
                    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
                    camera.lookAtPoint(target);
                    mapRef.current?.setFreeCameraOptions(camera);
                }
            }
        ];

        const animate = () => {
            if (!mapRef.current) return;

            animationIndex = animationIndex % animations.length;
            const current = animations[animationIndex];
            
            if (animationTime < current.duration) {
                const phase = animationTime / current.duration;
                console.log(`🎬 ${current.name} - ${Math.round(phase * 100)}%`);
                current.animate(phase);
            }

            animationTime += 1.0 / 60.0; // 60 FPS

            if (animationTime > current.duration) {
                animationIndex++;
                animationTime = 0.0;
            }

            requestAnimationFrame(animate);
        };

        console.log('✈️ Starting drone-like cinematic tour with free camera...');
        animate();
    }, []);

    useImperativeHandle(ref, () => ({
        flyTo,
        getMap: () => mapRef.current,
        startCinematicTour,
    }), [flyTo, startCinematicTour]);

    useEffect(() => {
        // Check if we're in the browser environment
        if (typeof window === 'undefined') {
            console.log('🚫 Skipping map initialization - not in browser');
            return;
        }
        
        if (mapRef.current) {
            console.log('🚫 Skipping map initialization - map already exists');
            return;
        }

        // Get the token from environment variables
        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        
        if (!token) {
            const errorMsg = 'Mapbox access token is required. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file.';
            console.error(errorMsg);
            setError(errorMsg);
            return;
        }

        if (!token.startsWith('pk.')) {
            const errorMsg = 'Invalid Mapbox access token format. Token should start with "pk.".';
            console.error(errorMsg);
            setError(errorMsg);
            return;
        }

        if (!mapContainerRef.current) {
            console.log('🚫 Skipping map initialization - container not ready');
            return;
        }

        // Set the global Mapbox access token
        mapboxgl.accessToken = token;

        const initialConfig = initialRegion || {
            center: [121.0280, 14.5547] as [number, number], // Makati CBD
            zoom: 16,
            pitch: 70,
            bearing: 135,
        };

        console.log('🗺️ Initializing Mapbox GL JS...', {
            center: initialConfig.center,
            zoom: initialConfig.zoom,
            tokenPrefix: token.substring(0, 15) + '...'
        });

        try {
            // Initialize the map with Apple-inspired styling (no labels) and performance optimizations
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: {
                    version: 8,
                    sources: {
                        'mapbox-streets': {
                            type: 'vector',
                            url: 'mapbox://mapbox.mapbox-streets-v8'
                        },
                        'composite': {
                            type: 'vector',
                            url: 'mapbox://mapbox.mapbox-streets-v8'
                        }
                    },
                    layers: [
                        // Background - Apple beige
                        {
                            id: 'background',
                            type: 'background',
                            paint: {
                                'background-color': '#f7f1df'
                            }
                        },
                        // Natural landscape
                        {
                            id: 'landuse-natural',
                            type: 'fill',
                            source: 'composite',
                            'source-layer': 'landuse',
                            filter: ['in', 'class', 'grass', 'scrub', 'wood'],
                            paint: {
                                'fill-color': '#d0e3b4',
                                'fill-opacity': 0.8
                            }
                        },
                        // Parks
                        {
                            id: 'park',
                            type: 'fill',
                            source: 'composite',
                            'source-layer': 'landuse',
                            filter: ['==', 'class', 'park'],
                            paint: {
                                'fill-color': '#bde6ab',
                                'fill-opacity': 0.7
                            }
                        },
                        // Medical facilities
                        {
                            id: 'landuse-medical',
                            type: 'fill',
                            source: 'composite',
                            'source-layer': 'landuse',
                            filter: ['==', 'class', 'hospital'],
                            paint: {
                                'fill-color': '#fbd3da',
                                'fill-opacity': 0.6
                            }
                        },
                        // Airport
                        {
                            id: 'airport',
                            type: 'fill',
                            source: 'composite',
                            'source-layer': 'landuse',
                            filter: ['==', 'class', 'airport'],
                            paint: {
                                'fill-color': '#cfb2db',
                                'fill-opacity': 0.5
                            }
                        },
                        // Water bodies - Apple blue
                        {
                            id: 'water',
                            type: 'fill',
                            source: 'composite',
                            'source-layer': 'water',
                            paint: {
                                'fill-color': '#a2daf2',
                                'fill-opacity': 0.8
                            }
                        },
                        // Roads - Highway (yellow)
                        {
                            id: 'road-highway',
                            type: 'line',
                            source: 'composite',
                            'source-layer': 'road',
                            filter: ['in', 'class', 'motorway', 'trunk'],
                            paint: {
                                'line-color': '#ffe15f',
                                'line-width': [
                                    'interpolate',
                                    ['exponential', 1.5],
                                    ['zoom'],
                                    10, 1,
                                    18, 10
                                ],
                                'line-opacity': 0.9
                            }
                        },
                        // Roads - Arterial (white)
                        {
                            id: 'road-arterial',
                            type: 'line',
                            source: 'composite',
                            'source-layer': 'road',
                            filter: ['in', 'class', 'primary', 'secondary'],
                            paint: {
                                'line-color': '#ffffff',
                                'line-width': [
                                    'interpolate',
                                    ['exponential', 1.5],
                                    ['zoom'],
                                    10, 0.5,
                                    18, 6
                                ],
                                'line-opacity': 0.8
                            }
                        },
                        // Roads - Local (black)
                        {
                            id: 'road-local',
                            type: 'line',
                            source: 'composite',
                            'source-layer': 'road',
                            filter: ['in', 'class', 'street', 'street_limited'],
                            paint: {
                                'line-color': '#000000',
                                'line-width': [
                                    'interpolate',
                                    ['exponential', 1.5],
                                    ['zoom'],
                                    10, 0.2,
                                    18, 3
                                ],
                                'line-opacity': 0.4
                            }
                        }
                        // NOTE: NO TEXT/LABEL LAYERS - Clean Apple-style map
                    ]
                },
                center: initialConfig.center,
                zoom: initialConfig.zoom,
                pitch: initialConfig.pitch,
                bearing: initialConfig.bearing,
                maxZoom: 22,
                minZoom: 8,
                maxBounds: PHILIPPINES_BOUNDS,
                antialias: true,
                fadeDuration: 300, // Reduced from 1000 for faster transitions
                hash: false,
                trackResize: true,
                preserveDrawingBuffer: false,
                attributionControl: false,
                // Performance optimizations
                minTileCacheSize: 1500, // Increased cache size for better performance
                maxTileCacheSize: 3000, // Allow more tiles to be cached
                renderWorldCopies: false, // Don't render multiple world copies
                collectResourceTiming: false, // Disable resource timing collection for performance
                crossSourceCollisions: false, // Disable cross-source collision detection
                refreshExpiredTiles: false, // Don't auto-refresh expired tiles
            });
            mapRef.current = map;

            // Handle successful map load and add custom 3D buildings
            map.on('load', () => {
                console.log('✅ Map loaded successfully');
                
                // Add custom 3D buildings layer with Apple Maps-like styling
                map.addLayer({
                    'id': '3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 14,
                    'layout': {},
                    'paint': {
                        // Apple-inspired building colors
                        'fill-extrusion-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'height'],
                            0, '#e8e8e8',
                            50, '#d4d4d4',
                            100, '#c0c0c0',
                            200, '#a8a8a8',
                            300, '#989898'
                        ],
                        'fill-extrusion-height': ['get', 'height'],
                        'fill-extrusion-base': ['get', 'min_height'],
                        'fill-extrusion-opacity': 0.85,
                        'fill-extrusion-vertical-gradient': true,
                        'fill-extrusion-ambient-occlusion-intensity': 0.3,
                        'fill-extrusion-ambient-occlusion-radius': 3
                    }
                });

                // Add subtle sky gradient
                map.addLayer({
                    'id': 'sky',
                    'type': 'sky',
                    'paint': {
                        'sky-type': 'gradient',
                        'sky-gradient': [
                            'interpolate',
                            ['linear'],
                            ['sky-radial-progress'],
                            0.8, 'rgba(220, 235, 250, 1.0)',
                            1, 'rgba(200, 215, 230, 0.4)'
                        ],
                        'sky-gradient-center': [0, 0],
                        'sky-gradient-radius': 90,
                        'sky-opacity': [
                            'interpolate',
                            ['exponential', 0.1],
                            ['zoom'],
                            8, 0.3,
                            16, 0.8,
                            20, 1
                        ]
                    }
                });

                // Set lighting for Apple Maps-like appearance
                map.setLights([
                    {
                        'type': 'ambient',
                        'id': 'ambient_light',
                        'properties': {
                            'intensity': 0.5
                        }
                    },
                    {
                        'type': 'directional',
                        'id': 'sun_light',
                        'properties': {
                            'intensity': 0.6,
                            'direction': [120, 60]
                        }
                    }
                ]);

                setIsLoaded(true);
                setError(null);
                
                if (onMapLoad) {
                    onMapLoad(map);
                }

                // Wait for map to be fully idle before preloading
                map.once('idle', () => {
                    console.log('🔄 Map is idle, starting tile preloading...');
                    
                    // Preload the entire Metro Manila region at once instead of individual stops
                    // This prevents NaN errors and loads everything faster
                    const manilaBounds: [[number, number], [number, number]] = [
                        [120.9, 14.2],  // Southwest (covers South Luzon to Manila Bay)
                        [121.15, 14.9]  // Northeast (covers Ortigas to North Luzon)
                    ];
                    
                    try {
                        // Preload tiles for the entire Metro Manila region
                        map.fitBounds(manilaBounds, {
                            padding: 50,
                            duration: 0,
                            maxZoom: 17,
                            preloadOnly: true
                        });
                        console.log('✅ Metro Manila tiles preloaded successfully');
                    } catch (err) {
                        console.warn('⚠️ Tile preloading failed:', err);
                    }
                });

                // Auto-start cinematic tour after 3 seconds (give time for preloading)
                setTimeout(() => {
                    console.log('🎬 Starting automatic cinematic tour...');
                    startCinematicTour();
                }, 3000);
            });

            // Handle style load
            map.on('style.load', () => {
                console.log('🎨 Map style loaded');
            });

            // Handle map errors
            map.on('error', (e: mapboxgl.ErrorEvent) => {
                console.error('❌ Mapbox error:', e);
                
                let errorMessage = 'Failed to load map';
                if (e.error) {
                    errorMessage = e.error.message || 'Unknown Mapbox error';
                    console.error('Error details:', e.error);
                }
                
                setError(`Map Error: ${errorMessage}`);
                setIsLoaded(false);
            });

            // Handle view state changes
            map.on('moveend', () => {
                if (onRegionChange && map.isStyleLoaded()) {
                    const center = map.getCenter();
                    const zoom = map.getZoom();
                    const bearing = map.getBearing();
                    const pitch = map.getPitch();

                    onRegionChange({
                        name: 'Current View',
                        center: [center.lng, center.lat],
                        zoom,
                        bearing,
                        pitch,
                    });
                }
            });

        } catch (err) {
            console.error('❌ Failed to initialize Mapbox GL JS:', err);
            const errorMsg = err instanceof Error ? err.message : 'Unknown initialization error';
            setError(`Initialization Error: ${errorMsg}`);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [onMapLoad, onRegionChange, startCinematicTour]);

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
                <div className="text-center p-8">
                    <div className="text-red-600 text-lg font-semibold mb-2">Map Error</div>
                    <div className="text-gray-600">{error}</div>
                    <div className="mt-4 text-sm text-gray-500">
                        Please check your Mapbox configuration
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative w-full h-full ${className}`}>
            <div
                ref={mapContainerRef}
                className="w-full h-full min-h-screen"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        <div className="text-white">Loading 3D Map...</div>
                        <div className="text-gray-400 text-sm mt-2">Preparing Metro Manila tour</div>
                    </div>
                </div>
            )}
            
            {/* Custom CSS to hide Mapbox logo and controls */}
            <style jsx>{`
                .mapboxgl-ctrl-logo,
                .mapboxgl-ctrl-attrib,
                .mapbox-logo {
                    display: none !important;
                }
                .mapboxgl-canvas-container {
                    cursor: default !important;
                }
                .mapboxgl-canvas {
                    outline: none !important;
                }
            `}</style>
        </div>
    );
});

MapboxMap.displayName = 'MapboxMap';

export default MapboxMap;
