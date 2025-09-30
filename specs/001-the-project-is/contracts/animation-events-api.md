# Animation Events API Contract

## POST /api/animations/track

Track animation events for performance monitoring and debugging.

### Request

```
POST /api/animations/track
Content-Type: application/json

{
  "event": "section_animation_start",
  "sectionId": "about",
  "timestamp": "2025-09-30T12:00:00.123Z",
  "animationType": "fade_in",
  "duration": 800,
  "metadata": {
    "scrollPosition": 250,
    "viewportHeight": 1080,
    "deviceType": "desktop"
  }
}
```

### Response - Success (201)

```json
{
  "tracked": true,
  "eventId": "evt_1234567890",
  "timestamp": "2025-09-30T12:00:00.125Z"
}
```

### Response - Error (400)

```json
{
  "error": {
    "code": "INVALID_EVENT",
    "message": "Animation event data is invalid",
    "details": "Missing required field: sectionId"
  }
}
```

### Contract Tests

- Request must include: event, sectionId, timestamp, animationType
- Event name must be from allowed event types
- Timestamp must be valid ISO 8601 format
- Duration must be positive number if provided
- Response must confirm tracking with unique eventId
