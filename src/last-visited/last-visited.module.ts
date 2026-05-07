import { Module } from '@nestjs/common';
import { LastVisitedController } from './last-visited.controller';
import { LastVisitedService } from './last-visited.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastVisited } from '../entities/last-visited';
import { Channel } from '../entities/channel';

@Module({
    imports: [
        TypeOrmModule.forFeature([LastVisited, Channel]),
    ],
    controllers: [LastVisitedController],
    providers: [LastVisitedService],
})
export class LastVisitedModule {
}
