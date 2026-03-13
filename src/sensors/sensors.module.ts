import { Module } from '@nestjs/common';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';

/**
 * Sensors Module
 * Provides sensor data endpoints for the UAQ Protección Civil frontend
 */
@Module({
    controllers: [SensorsController],
    providers: [SensorsService],
    exports: [SensorsService],
})
export class SensorsModule { }
