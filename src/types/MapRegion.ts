export interface MapRegion {
  name: string;
  center: [number, number]; // [longitude, latitude]
  zoom: number;
  bearing: number;
  pitch: number;
  bounds?: [[number, number], [number, number]]; // Optional bounding box
}

export interface MapCameraPosition {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export const PHILIPPINES_BOUNDS: [[number, number], [number, number]] = [
  [116.0, 4.0],  // Southwest coordinates
  [127.0, 21.0]  // Northeast coordinates
];

export const PHILIPPINES_CENTER: [number, number] = [121.0583, 14.5995];