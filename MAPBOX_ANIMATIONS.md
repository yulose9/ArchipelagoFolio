# Mapbox Camera Animation Guide

## Overview

This guide explains how to use the camera animation features in the MapboxMap component. The component provides three main animation methods: `flyTo`, `easeTo`, and `animateCamera`.

## Environment Setup

### Required Environment Variable

```bash
# .env.local
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here
```

**Important**: The variable name must be exactly `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` (not `NEXT_PUBLIC_MAPBOX_TOKEN`).

## Animation Methods

### 1. `flyTo` - Smooth Curved Animation

Best for large distance transitions with a natural flight path.

```typescript
import { useRef } from 'react';
import MapboxMap, { MapboxMapRef } from '@/components/map/MapboxMap';

function MyComponent() {
  const mapRef = useRef<MapboxMapRef>(null);

  const flyToManila = () => {
    mapRef.current?.flyTo({
      latitude: 14.5995,
      longitude: 120.9842,
      zoom: 12,
      pitch: 60,
      bearing: 45,
    });
  };

  return (
    <>
      <MapboxMap ref={mapRef} />
      <button onClick={flyToManila}>Fly to Manila</button>
    </>
  );
}
```

**Features**:
- Duration: 3000ms (3 seconds)
- Curve: 1.42 (natural arc)
- Speed: 0.6 (moderate)
- Easing: Ease-out quadratic

### 2. `easeTo` - Quick Linear Animation

Best for small adjustments or quick transitions.

```typescript
const zoomIn = () => {
  mapRef.current?.easeTo({
    latitude: 14.5995,
    longitude: 120.9842,
    zoom: 15, // Zoom in
    pitch: 45,
    bearing: 0,
  });
};
```

**Features**:
- Duration: 1500ms (1.5 seconds)
- Easing: Ease-in-out cubic
- Direct path (no curve)

### 3. `animateCamera` - Custom Animation

Provides maximum flexibility for custom camera movements.

```typescript
const customAnimation = () => {
  mapRef.current?.animateCamera({
    center: [120.9842, 14.5995],
    zoom: 14,
    pitch: 70,
    bearing: 90,
    duration: 2500,
  });
};
```

**Options**:
- `center`: [longitude, latitude]
- `zoom`: 0-22
- `pitch`: 0-85 degrees
- `bearing`: 0-360 degrees
- `duration`: milliseconds

## Common Animation Patterns

### Orbit Around a Point

```typescript
const orbitAround = (center: [number, number], duration: number = 10000) => {
  let currentBearing = 0;
  
  const animate = () => {
    currentBearing = (currentBearing + 1) % 360;
    
    mapRef.current?.animateCamera({
      center,
      bearing: currentBearing,
      duration: 100,
    });
    
    if (currentBearing < 360) {
      requestAnimationFrame(animate);
    }
  };
  
  animate();
};
```

### Zoom and Tilt

```typescript
const zoomAndTilt = () => {
  // First zoom in
  mapRef.current?.easeTo({
    latitude: currentLat,
    longitude: currentLng,
    zoom: 16,
    pitch: 45,
    bearing: 0,
  });
  
  // Then tilt after 2 seconds
  setTimeout(() => {
    mapRef.current?.animateCamera({
      pitch: 70,
      duration: 1000,
    });
  }, 2000);
};
```

### Tour Multiple Locations

```typescript
const tourLocations = async (locations: MapRegion[]) => {
  for (const location of locations) {
    mapRef.current?.flyTo(location);
    await new Promise(resolve => setTimeout(resolve, 4000));
  }
};

// Usage
tourLocations([
  { latitude: 14.5995, longitude: 120.9842, zoom: 12, pitch: 60, bearing: 0 },
  { latitude: 10.3157, longitude: 123.8854, zoom: 13, pitch: 55, bearing: 45 },
  { latitude: 7.0731, longitude: 125.6128, zoom: 11, pitch: 50, bearing: 90 },
]);
```

## Built-in Idle Animation

The map automatically starts a subtle "hover" animation when idle:

- Gentle bearing rotation: ±3 degrees
- Subtle pitch variation: ±2 degrees
- Smooth sine wave motion
- Auto-pauses during user interactions

To stop idle animation:
```typescript
// Animation stops automatically when you interact with the map
// or when a new region is set
```

## Camera Constraints

The map enforces these limits:

- **Maximum Pitch**: 85 degrees
- **Zoom Range**: 0-22
- **Bearing Range**: 0-360 degrees

## Easing Functions

### Built-in Easing

**Ease Out Quadratic** (flyTo):
```typescript
t * (2 - t)
```

**Ease In-Out Cubic** (easeTo):
```typescript
t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
```

### Custom Easing

You can pass custom easing functions to Mapbox methods:

```typescript
const customEase = (t: number) => {
  // Exponential easing
  return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
};

// Apply via direct Mapbox API
mapRef.current?.getMap()?.flyTo({
  center: [lng, lat],
  easing: customEase,
});
```

## Performance Tips

### 1. Batch Updates

Instead of multiple small animations, batch them:

```typescript
// ❌ Bad - Multiple animations
mapRef.current?.animateCamera({ zoom: 12, duration: 500 });
mapRef.current?.animateCamera({ pitch: 60, duration: 500 });
mapRef.current?.animateCamera({ bearing: 45, duration: 500 });

// ✅ Good - Single animation
mapRef.current?.animateCamera({
  zoom: 12,
  pitch: 60,
  bearing: 45,
  duration: 500,
});
```

### 2. Use `essential: true`

All animation methods set `essential: true` automatically, ensuring animations complete even when interrupted.

### 3. Cancel Ongoing Animations

The component automatically cancels previous animations when starting new ones.

## Troubleshooting

### Map Not Loading

**Error**: "Mapbox access token is missing"

**Solution**: Check that `.env.local` has:
```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_actual_token
```

Restart the dev server after adding the token:
```bash
npm run dev
```

### Black Screen

**Causes**:
1. Invalid token
2. Token not properly loaded
3. CSP blocking Mapbox domains

**Solutions**:
1. Verify token starts with `pk.`
2. Check browser console for errors
3. Ensure CSP allows Mapbox domains (already configured in `vercel.json`)

### Animation Not Working

**Check**:
1. Map is fully loaded: `mapRef.current?.getMap()?.isStyleLoaded()`
2. Component has ref: `<MapboxMap ref={mapRef} />`
3. Wait for map load event before animating

```typescript
const handleMapLoad = (map: mapboxgl.Map) => {
  console.log('Map loaded, ready for animations');
  // Now safe to animate
  mapRef.current?.flyTo(...);
};

<MapboxMap ref={mapRef} onMapLoad={handleMapLoad} />
```

## Advanced: Direct Mapbox API

For advanced use cases, access the raw Mapbox instance:

```typescript
const advancedAnimation = () => {
  const map = mapRef.current?.getMap();
  
  if (map && map.isStyleLoaded()) {
    map.flyTo({
      center: [120.9842, 14.5995],
      zoom: 12,
      pitch: 60,
      bearing: 45,
      duration: 3000,
      curve: 1.42,
      speed: 0.8,
      easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      // Additional Mapbox-specific options
      maxDuration: 5000,
      screenSpeed: 1,
    });
  }
};
```

## References

- [Mapbox GL JS Camera API](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#flyto)
- [Mapbox Easing Functions](https://docs.mapbox.com/mapbox-gl-js/api/map/#ease)
- [3D Terrain](https://docs.mapbox.com/mapbox-gl-js/example/add-terrain/)

---

**Last Updated**: 2025-09-30
**Component Version**: 2.0.0
**Mapbox GL JS**: ^2.15.0
