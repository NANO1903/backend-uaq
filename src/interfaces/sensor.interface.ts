/**
 * Sensor status types
 */
export type SensorStatus = 'active' | 'inactive' | 'error';

/**
 * Sensor alert types
 */
export type SensorAlert = 'fire' | 'security' | 'health' | null;

/**
 * Building responsible person contact information
 */
export interface Responsible {
    name: string;
    phone: string;
    email: string;
}

/**
 * Building images for different views
 */
export interface BuildingImages {
    east: string;
    south: string;
    west: string;
    north: string;
}

/**
 * Building documents (PDFs)
 */
export interface BuildingDocuments {
    architectural: string;
    electrical: string;
    evacuationRoutes: string;
}

/**
 * Sensor entity
 */
export interface Sensor {
    id: number;
    lat: number;
    lon: number;
    name: string;
    value: string;
    icon?: string;
    status: SensorStatus;
    alert: SensorAlert;
    batteryLevel: number;
    buildingId: number;
}

/**
 * Building entity
 */
export interface Building {
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
    responsible: Responsible;
    images: BuildingImages;
    documents: BuildingDocuments;
    createdAt: string;
    updatedAt: string;
}

/**
 * API Response data structure
 */
export interface SensorsResponseData {
    sensors: Sensor[];
    buildings: Building[];
}

/**
 * API Response structure
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    timestamp: string;
}
