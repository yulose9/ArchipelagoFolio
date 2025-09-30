# Map Regions API Contract

## GET /api/map/regions

Retrieve all available map regions for the Philippines with their camera positions.

### Request

```
GET /api/map/regions
Accept: application/json
```

### Response - Success (200)

```json
{
  "regions": [
    {
      "name": "Manila Bay",
      "center": [120.9842, 14.5995],
      "zoom": 11,
      "bearing": 0,
      "pitch": 45,
      "bounds": [
        [120.5, 14.2],
        [121.5, 14.9]
      ]
    },
    {
      "name": "Luzon",
      "center": [121.0583, 16.0583],
      "zoom": 7,
      "bearing": -15,
      "pitch": 30,
      "bounds": [
        [119.5, 12.0],
        [123.0, 19.0]
      ]
    }
  ],
  "metadata": {
    "totalRegions": 8,
    "coordinateSystem": "WGS84",
    "lastUpdated": "2025-09-30T12:00:00Z"
  }
}
```

### Response - Error (404)

```json
{
  "error": {
    "code": "REGIONS_NOT_FOUND",
    "message": "Map regions data not available",
    "details": "Geographic data service unavailable"
  }
}
```

### Contract Tests

- Response must contain array of regions
- Each region must have: name, center (longitude/latitude), zoom, bearing, pitch
- Center coordinates must be within Philippines bounds (119-127°E, 4-21°N)
- Zoom level must be between 0 and 22
- Bearing must be between 0 and 360 degrees
- Pitch must be between 0 and 60 degrees
