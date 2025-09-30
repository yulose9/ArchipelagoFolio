# Data Model: Interactive 3D Map Portfolio Web App

## Core Entities

### Section

Represents a portfolio section with associated map interactions.

**Attributes**:

- `id`: Unique identifier (string)
- `title`: Section display name (string)
- `content`: Section content and description (string)
- `mapRegion`: Associated Philippines region for map focus (MapRegion)
- `animationConfig`: Animation settings for section reveal (AnimationConfig)
- `order`: Display order in scroll sequence (number)

**Validation Rules**:

- `id` must be unique across all sections
- `title` must not be empty
- `order` must be positive integer
- `mapRegion` must reference valid Philippines coordinates

**State Transitions**:

- `hidden` → `entering` → `visible` → `exiting` → `hidden`

### MapRegion

Represents a geographic region of the Philippines for map focus.

**Attributes**:

- `name`: Region name (string)
- `center`: Center coordinates [longitude, latitude] (number[])
- `zoom`: Zoom level for this region (number)
- `bearing`: Map bearing/rotation (number)
- `pitch`: 3D tilt angle (number)

**Validation Rules**:

- `center` coordinates must be within Philippines bounds
- `zoom` must be between 0 and 22
- `bearing` must be between 0 and 360
- `pitch` must be between 0 and 60

### UIComponent

Represents animated UI elements within sections.

**Attributes**:

- `type`: Component type ('button', 'card', 'tooltip', 'section-overlay')
- `animationState`: Current animation state (AnimationState)
- `content`: Component content and properties (object)
- `interactionTriggers`: Events that trigger animations (string[])

**Validation Rules**:

- `type` must be from allowed component types
- `animationState` must be valid state
- `interactionTriggers` must contain valid event names

## Value Objects

### AnimationConfig

Configuration for section and component animations.

**Attributes**:

- `duration`: Animation duration in milliseconds (number)
- `easing`: Easing function name (string)
- `delay`: Animation delay (number)
- `scrollTrigger`: Scroll position trigger settings (object)

### AnimationState

Current state of animated elements.

**Values**: 'idle', 'animating-in', 'visible', 'animating-out', 'hidden'

### Coordinates

Geographic coordinates for map positioning.

**Attributes**:

- `longitude`: East-west position (number)
- `latitude`: North-south position (number)
- `elevation`: Height above sea level (optional, number)

## Data Relationships

### Section → MapRegion

Each portfolio section is associated with exactly one map region. When a section becomes active, the map animates to focus on its associated region.

### Section → UIComponent[]

Each section contains multiple UI components that animate together as a cohesive unit. Components inherit timing from their parent section's animation configuration.

### MapRegion → Section[]

A map region can be associated with multiple sections, but each section has only one primary region focus.

## Mock Data Structure

```typescript
// Portfolio sections with mock content
const portfolioSections: Section[] = [
  {
    id: "about",
    title: "About Me",
    content: "Lorem ipsum dolor sit amet...",
    mapRegion: {
      name: "Manila Bay",
      center: [120.9842, 14.5995],
      zoom: 11,
      bearing: 0,
      pitch: 45,
    },
    animationConfig: {
      duration: 800,
      easing: "easeInOut",
      delay: 200,
      scrollTrigger: { start: "0%", end: "25%" },
    },
    order: 1,
  },
  // Additional sections...
];

// Philippines regions for map focus
const mapRegions: MapRegion[] = [
  {
    name: "Luzon",
    center: [121.0583, 16.0583],
    zoom: 7,
    bearing: -15,
    pitch: 30,
  },
  // Additional regions...
];
```

## State Management

### Global State

- `activeSection`: Currently visible section ID
- `mapState`: Current map camera position and settings
- `animationQueue`: Pending animations to execute
- `userPreferences`: Accessibility and performance preferences

### Local Component State

- Individual component animation states
- Hover and interaction states
- Loading states for assets and map tiles

## Performance Considerations

### Data Loading

- Lazy load section content as user scrolls
- Preload next section's map region data
- Cache animation configurations to prevent recalculation

### Memory Management

- Limit simultaneous active animations
- Clean up unused map layers and data
- Implement component unmounting for off-screen sections
