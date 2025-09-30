import { MapRegion } from '../types/MapRegion';

export const mapRegions: MapRegion[] = [
  {
    name: 'Philippines Overview',
    center: [121.0583, 14.5995],
    zoom: 6,
    bearing: 0,
    pitch: 30,
    bounds: [
      [116.0, 4.0],
      [127.0, 21.0]
    ]
  },
  {
    name: 'Manila Bay',
    center: [120.9842, 14.5995],
    zoom: 11,
    bearing: 0,
    pitch: 45,
    bounds: [
      [120.5, 14.2],
      [121.5, 14.9]
    ]
  },
  {
    name: 'Cebu',
    center: [123.8854, 10.3157],
    zoom: 10,
    bearing: 15,
    pitch: 50,
    bounds: [
      [123.2, 9.8],
      [124.5, 10.8]
    ]
  },
  {
    name: 'Baguio',
    center: [120.5960, 16.4023],
    zoom: 12,
    bearing: -30,
    pitch: 40,
    bounds: [
      [120.2, 16.1],
      [121.0, 16.7]
    ]
  },
  {
    name: 'Davao',
    center: [125.6128, 7.0731],
    zoom: 11,
    bearing: 45,
    pitch: 35,
    bounds: [
      [125.0, 6.5],
      [126.2, 7.6]
    ]
  },
  {
    name: 'Luzon',
    center: [121.0583, 16.0583],
    zoom: 7,
    bearing: -15,
    pitch: 30,
    bounds: [
      [119.5, 12.0],
      [123.0, 19.0]
    ]
  },
  {
    name: 'Visayas',
    center: [123.5, 10.5],
    zoom: 8,
    bearing: 10,
    pitch: 40,
    bounds: [
      [122.0, 8.5],
      [125.0, 12.5]
    ]
  },
  {
    name: 'Mindanao',
    center: [125.0, 7.5],
    zoom: 7,
    bearing: 20,
    pitch: 35,
    bounds: [
      [123.0, 5.0],
      [127.0, 10.0]
    ]
  }
];

export const getRegionByName = (name: string): MapRegion | undefined => {
  return mapRegions.find(region => region.name === name);
};

export const getDefaultRegion = (): MapRegion => {
  return mapRegions[0]; // Philippines Overview
};

export const getRandomRegion = (): MapRegion => {
  const randomIndex = Math.floor(Math.random() * mapRegions.length);
  return mapRegions[randomIndex];
};