# Frontend Resource Pages API Contract

This document defines the backend endpoints expected by the frontend pages for Events, Devices, and Buildings.

## Base URL

- Development base URL: `http://localhost:4000`
- Frontend requests:
  - `GET /api/events`
  - `GET /api/devices`
  - `GET /api/buildings`

## Response Convention

All three endpoints should follow the same response envelope already used by the existing sensor API.

### Success response

```json
{
  "success": true,
  "data": [],
  "timestamp": "2026-04-17T18:00:00.000Z"
}
```

### Error response

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_LIST_UNAVAILABLE",
    "message": "Unable to fetch the requested resource list."
  },
  "timestamp": "2026-04-17T18:00:00.000Z"
}
```

## `GET /api/events`

Returns a flat collection of event records for the frontend table view.

### Required fields per item

- `id`: `number`
- `title`: `string`
- `type`: `string`
- `status`: `"open" | "in_progress" | "resolved"`
- `severity`: `"low" | "medium" | "high" | "critical"`
- `description`: `string`
- `createdAt`: ISO date-time string

### Optional fields per item

- `deviceId`: `number | null`
- `buildingId`: `number | null`
- `buildingName`: `string`
- `deviceName`: `string`
- `resolvedAt`: ISO date-time string or `null`

### Example payload

```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "title": "Smoke alarm triggered in north wing",
      "type": "alarm",
      "status": "open",
      "severity": "critical",
      "description": "Smoke density exceeded the configured threshold in the laboratory corridor.",
      "deviceId": 12,
      "buildingId": 3,
      "buildingName": "Laboratorios Norte",
      "deviceName": "Smoke Sensor N-12",
      "createdAt": "2026-04-17T16:20:00.000Z",
      "resolvedAt": null
    }
  ],
  "timestamp": "2026-04-17T18:00:00.000Z"
}
```

## `GET /api/devices`

Returns a flat collection of devices/sensors for the frontend card grid.

### Required fields per item

- `id`: `number`
- `name`: `string`
- `type`: `string`
- `value`: `string`
- `status`: `"active" | "inactive" | "error"`
- `alert`: `"fire" | "security" | "health" | null`
- `batteryLevel`: `number`
- `buildingId`: `number`
- `lastSeenAt`: ISO date-time string

### Optional fields per item

- `buildingName`: `string`
- `location`: `string`

### Example payload

```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "name": "Smoke Sensor N-12",
      "type": "Smoke detector",
      "value": "High smoke density",
      "status": "active",
      "alert": "fire",
      "batteryLevel": 82,
      "buildingId": 3,
      "buildingName": "Laboratorios Norte",
      "location": "North corridor, second floor",
      "lastSeenAt": "2026-04-17T17:58:00.000Z"
    }
  ],
  "timestamp": "2026-04-17T18:00:00.000Z"
}
```

## `GET /api/buildings`

Returns a flat collection of buildings for the frontend card grid. The shape should stay compatible with the current frontend building model already used by the map flow.

### Required fields per item

- `id`: `number`
- `name`: `string`
- `displayName`: `string`
- `address`: `string`
- `constructionType`: `string`
- `constructionYear`: `number`
- `floors`: `number`
- `totalArea`: `string`
- `maxCapacity`: `number`
- `lastStructuralReview`: `string`
- `fireProtectionSystem`: `string`
- `emergencyExits`: `number`
- `primaryUse`: `string`
- `secondaryUse`: `string`
- `operatingHours`: `string`
- `department`: `string`
- `observations`: `string`
- `responsible`: object with `name`, `phone`, `email`
- `images`: object with `east`, `south`, `west`, `north`
- `documents`: object with `architectural`, `electrical`, `evacuationRoutes`
- `createdAt`: ISO date-time string
- `updatedAt`: ISO date-time string

### Example payload

```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "laboratorios-norte",
      "displayName": "Laboratorios Norte",
      "address": "Cerro de las Campanas s/n, Santiago de Queretaro",
      "constructionType": "Reinforced concrete",
      "constructionYear": 2012,
      "floors": 4,
      "totalArea": "2,450 m2",
      "maxCapacity": 420,
      "lastStructuralReview": "2026-02-10",
      "fireProtectionSystem": "Sprinklers, extinguishers, and smoke extraction",
      "emergencyExits": 6,
      "primaryUse": "Laboratories",
      "secondaryUse": "Administrative offices",
      "operatingHours": "Monday to Friday, 07:00-21:00",
      "department": "Engineering",
      "observations": "High occupancy during weekday afternoons.",
      "responsible": {
        "name": "Mtra. Lucia Martinez",
        "phone": "442-123-4567",
        "email": "lucia.martinez@uaq.mx"
      },
      "images": {
        "east": "/buildings/laboratorios-norte/east.jpg",
        "south": "/buildings/laboratorios-norte/south.jpg",
        "west": "/buildings/laboratorios-norte/west.jpg",
        "north": "/buildings/laboratorios-norte/north.jpg"
      },
      "documents": {
        "architectural": "/buildings/laboratorios-norte/architectural.pdf",
        "electrical": "/buildings/laboratorios-norte/electrical.pdf",
        "evacuationRoutes": "/buildings/laboratorios-norte/evacuation-routes.pdf"
      },
      "createdAt": "2026-01-05T14:00:00.000Z",
      "updatedAt": "2026-04-15T11:30:00.000Z"
    }
  ],
  "timestamp": "2026-04-17T18:00:00.000Z"
}
```

## Filtering and Search

The v1 frontend implementation performs filtering and search client-side after fetching each full dataset.

- Query parameters are not required for the first backend version.
- Backend support for server-side filtering, pagination, or sorting can be added later without blocking the frontend rollout.
