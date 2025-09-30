# Portfolio Sections API Contract

## GET /api/sections

Retrieve all portfolio sections with their associated map regions and animation configurations.

### Request

```
GET /api/sections
Accept: application/json
```

### Response - Success (200)

```json
{
  "sections": [
    {
      "id": "about",
      "title": "About Me",
      "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      "mapRegion": {
        "name": "Manila Bay",
        "center": [120.9842, 14.5995],
        "zoom": 11,
        "bearing": 0,
        "pitch": 45
      },
      "animationConfig": {
        "duration": 800,
        "easing": "easeInOut",
        "delay": 200,
        "scrollTrigger": {
          "start": "0%",
          "end": "25%"
        }
      },
      "order": 1
    }
  ],
  "metadata": {
    "totalSections": 4,
    "lastUpdated": "2025-09-30T12:00:00Z"
  }
}
```

### Response - Error (500)

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Unable to load portfolio sections",
    "details": "Mock data service unavailable"
  }
}
```

### Contract Tests

- Response must contain array of sections
- Each section must have required fields: id, title, content, mapRegion, animationConfig, order
- Map region coordinates must be valid Philippines locations
- Animation configuration must have valid duration and easing values
- Sections must be ordered by 'order' field
