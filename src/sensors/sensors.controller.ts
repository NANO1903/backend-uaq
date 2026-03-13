import { Controller, Get } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import type { ApiResponse, SensorsResponseData } from '../interfaces/sensor.interface';

/**
 * Sensors Controller
 * Handles API endpoints for sensor data with building information
 */
@Controller('sensors')
export class SensorsController {
    constructor(private readonly sensorsService: SensorsService) { }

    /**
     * GET /api/sensors
     * Returns all sensors with their associated building information
     * @returns API response with sensors and buildings array
     */
    @Get()
    getSensors(): ApiResponse<SensorsResponseData> {
        return this.sensorsService.getSensors();
    }
}
