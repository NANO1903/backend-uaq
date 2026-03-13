import { Injectable } from '@nestjs/common';
import {
    Sensor,
    Building,
    SensorsResponseData,
    ApiResponse,
} from '../interfaces/sensor.interface';

/**
 * Mock sensor data
 */
const MOCK_SENSORS: Sensor[] = [
    {
        id: 1,
        lat: 20.59213705652158,
        lon: -100.4099462147798,
        name: 'Sensor Rectoría',
        value: 'Normal',
        status: 'active',
        alert: 'fire',
        batteryLevel: 80,
        buildingId: 1,
    },
    {
        id: 2,
        lat: 20.59213705652158,
        lon: -100.4099462147798,
        name: 'Sensor Laboratorio',
        value: 'Normal',
        status: 'active',
        alert: null,
        batteryLevel: 95,
        buildingId: 1,
    },
    {
        id: 3,
        lat: 20.59213705652158,
        lon: -100.4099462147798,
        name: 'Sensor Entrada Principal',
        value: 'Alerta',
        status: 'active',
        alert: 'fire',
        batteryLevel: 60,
        buildingId: 1,
    },
];

/**
 * Mock building data based on the specification example
 */
const MOCK_BUILDINGS: Building[] = [
    {
        id: 1,
        name: 'pc',
        displayName: 'Protección Civil',
        address: 'Cerro de las Campanas s/n, Santiago de Querétaro',
        constructionType: 'Concreto armado',
        constructionYear: 2005,
        floors: 3,
        totalArea: '1,200 m²',
        maxCapacity: 300,
        lastStructuralReview: 'Enero 2024',
        fireProtectionSystem: 'Rociadores + extintores',
        emergencyExits: 4,
        primaryUse: 'Aulas y laboratorios académicos',
        secondaryUse: 'Oficinas administrativas',
        operatingHours: 'Lunes a viernes, 7:00 – 21:00 hrs',
        department: 'Facultad de Ingeniería — UAQ',
        observations: 'Edificio de uso mixto con acceso controlado en horario nocturno.',
        responsible: {
            name: 'Ing. Juan Pérez García',
            phone: '442-000-0000',
            email: 'responsable@uaq.mx',
        },
        images: {
            east: '/buildings/pc/east.jpg',
            south: '/buildings/pc/south.jpg',
            west: '/buildings/pc/west.jpg',
            north: '/buildings/pc/north.jpg',
        },
        documents: {
            architectural: '/buildings/pc/architectural.pdf',
            electrical: '/buildings/pc/electrical.pdf',
            evacuationRoutes: '/buildings/pc/evacuation-routes.pdf',
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
    },
];

/**
 * Sensors Service - handles business logic for sensor data
 */
@Injectable()
export class SensorsService {
    /**
     * Get all sensors with building information
     * @returns API response with sensors and buildings data
     */
    getSensors(): ApiResponse<SensorsResponseData> {
        const data: SensorsResponseData = {
            sensors: MOCK_SENSORS,
            buildings: MOCK_BUILDINGS,
        };

        return {
            success: true,
            data,
            timestamp: new Date().toISOString(),
        };
    }
}
