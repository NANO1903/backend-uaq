# UAQ Backend API and Supabase Contract

This document is the shareable source of truth for the backend API expected by the current frontend and for the Supabase schema that can support it when deployed on Vercel.

## Purpose and Audience

Use this document when implementing or deploying the backend service that serves the UAQ Proteccion Civil frontend.

This spec is intended for:

- backend engineers building the NestJS API
- engineers preparing the data model in Supabase
- Vercel deployers wiring environment variables between frontend and backend

## Current Frontend Consumers

The current frontend consumes four backend contracts.

### Map flow

- Frontend page: `/map`
- Main consumer files:
  - `redmi-uaq-frontend/app/hooks/useSensorData.ts`
  - `redmi-uaq-frontend/app/map/_components/MapComponent.tsx`
  - `redmi-uaq-frontend/app/map/_components/SensorInfoCarousel.tsx`
- API contract used: `GET /api/sensors`
- Expected payload shape: `{ sensors: Sensor[]; buildings: Building[] }`

### Devices list flow

- Frontend page: `/devices`
- Main consumer file: `redmi-uaq-frontend/app/devices/page.tsx`
- API contract used: `GET /api/devices`
- Expected payload shape: `Device[]`

### Buildings list flow

- Frontend page: `/buildings`
- Main consumer file: `redmi-uaq-frontend/app/buildings/page.tsx`
- API contract used: `GET /api/buildings`
- Expected payload shape: `Building[]`

### Events list flow

- Frontend page: `/events`
- Main consumer file: `redmi-uaq-frontend/app/events/page.tsx`
- API contract used: `GET /api/events`
- Expected payload shape: `Event[]`

## Base URL and Environment Variables

### Backend base URL

- Local backend base URL: `http://localhost:4000`
- NestJS global API prefix: `/api`
- Example local API endpoint: `http://localhost:4000/api/sensors`

### Frontend environment variable

Recommended frontend environment configuration:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

In production on Vercel, `NEXT_PUBLIC_API_BASE_URL` should point to the deployed backend base origin, for example:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-app.vercel.app
```

Important note:

- generic list fetching in `app/lib/api.ts` expects a base origin and appends `/api/...`
- the current `app/hooks/useSensorData.ts` is written as if the variable may already include the full `/api/sensors` path
- the preferred long-term convention is to store the backend origin only and let callers append their resource paths explicitly

## Shared Response Envelope

All API endpoints should use the same success and error envelope.

### Success response

```json
{
  "success": true,
  "data": [],
  "timestamp": "2026-04-23T18:00:00.000Z"
}
```

### Error response

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_LIST_UNAVAILABLE",
    "message": "Unable to fetch the requested resource."
  },
  "timestamp": "2026-04-23T18:00:00.000Z"
}
```

### Error object

- `code`: machine-readable string
- `message`: user-readable string

### Timestamp format

- always return ISO 8601 date-time strings in UTC

## Endpoint Catalog

## `GET /api/sensors`

Returns the map payload used by the alert queue and building detail modal.

### Response type

```ts
ApiResponse<{
  sensors: Sensor[];
  buildings: Building[];
}>
```

### Required behavior

- return all active map sensors as `data.sensors`
- return the building catalog referenced by those sensors as `data.buildings`
- each `Sensor.buildingId` must match a `Building.id`

### Example payload

```json
{
  "success": true,
  "data": {
    "sensors": [
      {
        "id": 1,
        "lat": 20.59213705652158,
        "lon": -100.4099462147798,
        "name": "Sensor Rectoria",
        "value": "Normal",
        "status": "active",
        "alert": "fire",
        "batteryLevel": 80,
        "buildingId": 1
      }
    ],
    "buildings": [
      {
        "id": 1,
        "name": "pc",
        "displayName": "Proteccion Civil",
        "address": "Cerro de las Campanas s/n, Santiago de Queretaro",
        "constructionType": "Concreto armado",
        "constructionYear": 2005,
        "floors": 3,
        "totalArea": "1,200 m2",
        "maxCapacity": 300,
        "lastStructuralReview": "2024-01-01",
        "fireProtectionSystem": "Rociadores y extintores",
        "emergencyExits": 4,
        "primaryUse": "Aulas y laboratorios academicos",
        "secondaryUse": "Oficinas administrativas",
        "operatingHours": "Lunes a viernes, 07:00-21:00",
        "department": "Facultad de Ingenieria - UAQ",
        "observations": "Edificio de uso mixto con acceso controlado en horario nocturno.",
        "responsible": {
          "name": "Ing. Juan Perez Garcia",
          "phone": "442-000-0000",
          "email": "responsable@uaq.mx"
        },
        "images": {
          "east": "/buildings/pc/east.jpg",
          "south": "/buildings/pc/south.jpg",
          "west": "/buildings/pc/west.jpg",
          "north": "/buildings/pc/north.jpg"
        },
        "documents": {
          "architectural": "/buildings/pc/architectural.pdf",
          "electrical": "/buildings/pc/electrical.pdf",
          "evacuationRoutes": "/buildings/pc/evacuation-routes.pdf"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-15T00:00:00.000Z"
      }
    ]
  },
  "timestamp": "2026-04-23T18:00:00.000Z"
}
```

## `GET /api/devices`

Returns a flat list used by the devices inventory page.

### Response type

```ts
ApiResponse<Device[]>
```

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
- `icon`: `string`
- `lat`: `number`
- `lon`: `number`

The optional `lat` and `lon` fields are not currently required by the devices page, but they may be useful if the backend wants to expose a single richer device projection.

### Example payload

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sensor Rectoria",
      "type": "smoke_detector",
      "value": "Normal",
      "status": "active",
      "alert": "fire",
      "batteryLevel": 80,
      "buildingId": 1,
      "buildingName": "Proteccion Civil",
      "location": "Acceso principal",
      "lastSeenAt": "2026-04-23T17:55:00.000Z"
    }
  ],
  "timestamp": "2026-04-23T18:00:00.000Z"
}
```

## `GET /api/buildings`

Returns the building catalog for the buildings page and also defines the full building detail model used by the map modal.

### Response type

```ts
ApiResponse<Building[]>
```

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
      "id": 1,
      "name": "pc",
      "displayName": "Proteccion Civil",
      "address": "Cerro de las Campanas s/n, Santiago de Queretaro",
      "constructionType": "Concreto armado",
      "constructionYear": 2005,
      "floors": 3,
      "totalArea": "1,200 m2",
      "maxCapacity": 300,
      "lastStructuralReview": "2024-01-01",
      "fireProtectionSystem": "Rociadores y extintores",
      "emergencyExits": 4,
      "primaryUse": "Aulas y laboratorios academicos",
      "secondaryUse": "Oficinas administrativas",
      "operatingHours": "Lunes a viernes, 07:00-21:00",
      "department": "Facultad de Ingenieria - UAQ",
      "observations": "Edificio de uso mixto con acceso controlado en horario nocturno.",
      "responsible": {
        "name": "Ing. Juan Perez Garcia",
        "phone": "442-000-0000",
        "email": "responsable@uaq.mx"
      },
      "images": {
        "east": "/buildings/pc/east.jpg",
        "south": "/buildings/pc/south.jpg",
        "west": "/buildings/pc/west.jpg",
        "north": "/buildings/pc/north.jpg"
      },
      "documents": {
        "architectural": "/buildings/pc/architectural.pdf",
        "electrical": "/buildings/pc/electrical.pdf",
        "evacuationRoutes": "/buildings/pc/evacuation-routes.pdf"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "timestamp": "2026-04-23T18:00:00.000Z"
}
```

## `GET /api/events`

Returns the event feed shown in the events table.

### Response type

```ts
ApiResponse<Event[]>
```

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
      "deviceId": 1,
      "buildingId": 1,
      "buildingName": "Proteccion Civil",
      "deviceName": "Sensor Rectoria",
      "createdAt": "2026-04-23T16:20:00.000Z",
      "resolvedAt": null
    }
  ],
  "timestamp": "2026-04-23T18:00:00.000Z"
}
```

## Frontend Data Models

The frontend currently uses the following data models.

## Shared enums

### Sensor and Device status

```ts
'active' | 'inactive' | 'error'
```

### Sensor and Device alert

```ts
'fire' | 'security' | 'health' | null
```

### Event status

```ts
'open' | 'in_progress' | 'resolved'
```

### Event severity

```ts
'low' | 'medium' | 'high' | 'critical'
```

## `Sensor`

Used by the map, marker alerts, modal details, and alert queue.

```ts
interface Sensor {
  id: number;
  lat: number;
  lon: number;
  name: string;
  value: string;
  icon?: string;
  status: 'active' | 'inactive' | 'error';
  alert: 'fire' | 'security' | 'health' | null;
  batteryLevel: number;
  buildingId: number;
}
```

## `Device`

Used by the `/devices` resource page.

```ts
interface Device {
  id: number;
  name: string;
  type: string;
  value: string;
  status: 'active' | 'inactive' | 'error';
  alert: 'fire' | 'security' | 'health' | null;
  batteryLevel: number;
  buildingId: number;
  buildingName?: string;
  location?: string;
  lastSeenAt: string;
}
```

## `Building`

Used by the `/buildings` resource page and by the map modal.

```ts
interface Building {
  id: number;
  name: string;
  displayName: string;
  address: string;
  constructionType: string;
  constructionYear: number;
  floors: number;
  totalArea: string;
  maxCapacity: number;
  lastStructuralReview: string;
  fireProtectionSystem: string;
  emergencyExits: number;
  primaryUse: string;
  secondaryUse: string;
  operatingHours: string;
  department: string;
  observations: string;
  responsible: {
    name: string;
    phone: string;
    email: string;
  };
  images: {
    east: string;
    south: string;
    west: string;
    north: string;
  };
  documents: {
    architectural: string;
    electrical: string;
    evacuationRoutes: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## `Event`

Used by the `/events` resource page.

```ts
interface Event {
  id: number;
  title: string;
  type: string;
  status: 'open' | 'in_progress' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  deviceId?: number | null;
  buildingId?: number | null;
  buildingName?: string;
  deviceName?: string;
  createdAt: string;
  resolvedAt?: string | null;
}
```

## Why Both `Sensor` and `Device` Exist

The frontend currently uses two projections over the same physical monitoring domain.

- `Sensor` is the map-oriented projection and includes coordinates
- `Device` is the list-oriented projection and includes operational metadata such as `type`, `location`, and `lastSeenAt`

The backend may store both through a single `sensors` table and expose them through different API response shapes.

## Supabase Schema Proposal

The recommended Supabase design uses three core tables.

## Table: `buildings`

### Purpose

Stores building metadata, operational details, responsible contact data, and asset links used by both the buildings page and the map modal.

### Suggested columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `bigint generated by default as identity primary key` | Backend/public identifier |
| `name` | `text not null unique` | Slug-like building key, for example `pc` |
| `display_name` | `text not null` | Human-readable label |
| `address` | `text not null` | Full address |
| `construction_type` | `text not null` | Frontend `constructionType` |
| `construction_year` | `integer not null` | Frontend `constructionYear` |
| `floors` | `integer not null` | Number of floors |
| `total_area` | `text not null` | Kept as text to match current frontend contract |
| `max_capacity` | `integer not null` | Frontend `maxCapacity` |
| `last_structural_review` | `date not null` | Convert to string in API |
| `fire_protection_system` | `text not null` | Frontend `fireProtectionSystem` |
| `emergency_exits` | `integer not null` | Frontend `emergencyExits` |
| `primary_use` | `text not null` | Frontend `primaryUse` |
| `secondary_use` | `text not null` | Frontend `secondaryUse` |
| `operating_hours` | `text not null` | Frontend `operatingHours` |
| `department` | `text not null` | Owning department or faculty |
| `observations` | `text not null` | Free-text notes |
| `responsible` | `jsonb not null` | `{ name, phone, email }` |
| `images` | `jsonb not null` | `{ east, south, west, north }` |
| `documents` | `jsonb not null` | `{ architectural, electrical, evacuationRoutes }` |
| `created_at` | `timestamptz not null default now()` | API `createdAt` |
| `updated_at` | `timestamptz not null default now()` | API `updatedAt` |

## Table: `sensors`

### Purpose

Stores the physical monitoring devices. This table is the source for both the map `Sensor` projection and the devices list `Device` projection.

### Suggested columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `bigint generated by default as identity primary key` | Backend/public identifier |
| `building_id` | `bigint not null references buildings(id)` | Required relationship |
| `name` | `text not null` | Sensor or device label |
| `type` | `text not null` | Required by `/api/devices` |
| `value` | `text not null` | Current reading or summary |
| `lat` | `double precision not null` | Required by `Sensor` |
| `lon` | `double precision not null` | Required by `Sensor` |
| `icon` | `text null` | Optional frontend icon override |
| `status` | `text not null` | One of `active`, `inactive`, `error` |
| `alert` | `text null` | One of `fire`, `security`, `health`, or `null` |
| `battery_level` | `integer not null` | Frontend `batteryLevel` |
| `location` | `text null` | Required only for the devices page |
| `last_seen_at` | `timestamptz not null` | Frontend `lastSeenAt` |
| `created_at` | `timestamptz not null default now()` | Audit column |
| `updated_at` | `timestamptz not null default now()` | Audit column |

### Recommended constraints

- check constraint on `status` for `active`, `inactive`, `error`
- check constraint on `alert` for `fire`, `security`, `health`, or `null`
- index on `building_id`
- index on `status`
- index on `alert`
- index on `last_seen_at`

## Table: `events`

### Purpose

Stores incidents, alarms, inspections, and maintenance records displayed in the events table.

### Suggested columns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `bigint generated by default as identity primary key` | Backend/public identifier |
| `title` | `text not null` | Event title |
| `type` | `text not null` | Alarm, maintenance, inspection, emergency, or future values |
| `status` | `text not null` | `open`, `in_progress`, `resolved` |
| `severity` | `text not null` | `low`, `medium`, `high`, `critical` |
| `description` | `text not null` | Event details |
| `device_id` | `bigint null references sensors(id)` | Optional device relationship |
| `building_id` | `bigint null references buildings(id)` | Optional building relationship |
| `created_at` | `timestamptz not null default now()` | API `createdAt` |
| `resolved_at` | `timestamptz null` | API `resolvedAt` |

### Recommended constraints

- check constraint on `status` for `open`, `in_progress`, `resolved`
- check constraint on `severity` for `low`, `medium`, `high`, `critical`
- index on `device_id`
- index on `building_id`
- index on `status`
- index on `severity`
- index on `created_at desc`

## API-to-Database Mapping Rules

The backend should map snake_case database fields to the camelCase API contract expected by the frontend.

### Buildings mapping

| API field | Supabase column |
| --- | --- |
| `id` | `id` |
| `name` | `name` |
| `displayName` | `display_name` |
| `address` | `address` |
| `constructionType` | `construction_type` |
| `constructionYear` | `construction_year` |
| `floors` | `floors` |
| `totalArea` | `total_area` |
| `maxCapacity` | `max_capacity` |
| `lastStructuralReview` | `last_structural_review` |
| `fireProtectionSystem` | `fire_protection_system` |
| `emergencyExits` | `emergency_exits` |
| `primaryUse` | `primary_use` |
| `secondaryUse` | `secondary_use` |
| `operatingHours` | `operating_hours` |
| `department` | `department` |
| `observations` | `observations` |
| `responsible` | `responsible` |
| `images` | `images` |
| `documents` | `documents` |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |

### Sensor mapping for `/api/sensors`

| API field | Supabase column |
| --- | --- |
| `id` | `id` |
| `lat` | `lat` |
| `lon` | `lon` |
| `name` | `name` |
| `value` | `value` |
| `icon` | `icon` |
| `status` | `status` |
| `alert` | `alert` |
| `batteryLevel` | `battery_level` |
| `buildingId` | `building_id` |

### Device mapping for `/api/devices`

| API field | Supabase source |
| --- | --- |
| `id` | `sensors.id` |
| `name` | `sensors.name` |
| `type` | `sensors.type` |
| `value` | `sensors.value` |
| `status` | `sensors.status` |
| `alert` | `sensors.alert` |
| `batteryLevel` | `sensors.battery_level` |
| `buildingId` | `sensors.building_id` |
| `buildingName` | `buildings.display_name` |
| `location` | `sensors.location` |
| `lastSeenAt` | `sensors.last_seen_at` |

### Event mapping for `/api/events`

| API field | Supabase source |
| --- | --- |
| `id` | `events.id` |
| `title` | `events.title` |
| `type` | `events.type` |
| `status` | `events.status` |
| `severity` | `events.severity` |
| `description` | `events.description` |
| `deviceId` | `events.device_id` |
| `buildingId` | `events.building_id` |
| `buildingName` | `buildings.display_name` |
| `deviceName` | `sensors.name` |
| `createdAt` | `events.created_at` |
| `resolvedAt` | `events.resolved_at` |

## Query and Join Expectations

- `/api/sensors` should read from `sensors` plus the referenced `buildings`
- `/api/devices` should read from `sensors` joined with `buildings`
- `/api/buildings` should read directly from `buildings`
- `/api/events` should read from `events` left-joined to `buildings` and `sensors`

The current frontend performs filtering and searching client-side after fetching complete datasets.

For version 1:

- pagination is not required
- server-side filtering is not required
- server-side sorting is optional

## Known Inconsistencies to Resolve During Implementation

The current repos are not fully aligned yet. The backend implementer should use this section as a checklist.

### Existing mismatch: endpoint coverage

- the backend currently exposes only `GET /api/sensors`
- the frontend resource pages already expect `GET /api/devices`, `GET /api/buildings`, and `GET /api/events`

### Existing mismatch: base URL convention

- `redmi-uaq-frontend/.env.example` currently sets `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/sensors`
- `app/lib/api.ts` expects a base origin such as `http://localhost:4000`
- `app/hooks/useSensorData.ts` currently fetches `NEXT_PUBLIC_API_BASE_URL` directly

Recommended resolution:

- treat `NEXT_PUBLIC_API_BASE_URL` as the backend origin only
- update the map hook to fetch `${NEXT_PUBLIC_API_BASE_URL}/api/sensors`
- let all frontend callers use explicit resource paths

### Existing mismatch: page naming versus API naming

- there is no `/sensors` page in the current frontend
- the list page is `/devices`
- the map payload still uses the `sensors` contract

This is acceptable as long as the backend keeps both:

- `/api/sensors` for the map-oriented payload
- `/api/devices` for the list-oriented projection

## Vercel Implementation Notes

### Deployment topology

Recommended deployment layout:

- deploy the frontend as one Vercel project
- deploy the NestJS backend as a separate Vercel project or service
- point the frontend `NEXT_PUBLIC_API_BASE_URL` to the backend deployment origin

### Required backend behavior

- enable CORS for the frontend domain
- keep the global `/api` prefix
- return JSON with the shared envelope on both success and failure
- normalize Supabase snake_case records into camelCase API responses

### Asset handling

The current frontend expects `images` and `documents` to be URL or path strings.

The backend may return:

- public paths served by the frontend
- Supabase Storage public URLs
- any other stable HTTPS URLs

As long as the response shape stays the same, the frontend contract remains valid.

### Supabase implementation preference

To minimize frontend changes:

- keep nested `responsible`, `images`, and `documents` as JSON objects in the API
- keep `totalArea`, `operatingHours`, and similar display-oriented fields as strings
- keep event display joins `buildingName` and `deviceName` in the API response instead of forcing the frontend to join them client-side

## Minimum Backend Deliverable

For the current frontend to work against Supabase, the backend must provide:

1. `GET /api/sensors`
2. `GET /api/devices`
3. `GET /api/buildings`
4. `GET /api/events`
5. shared success and error envelopes
6. data mapping from Supabase snake_case storage to camelCase frontend contracts

If those six pieces are delivered, the current frontend can be connected to a real Supabase-backed backend without changing its page-level data models.
