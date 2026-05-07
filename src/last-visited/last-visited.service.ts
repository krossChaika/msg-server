import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LastVisited } from '../entities/last-visited';

@Injectable()
export class LastVisitedService {
    @InjectRepository(LastVisited)
    private readonly firstUnreadRepository: Repository<LastVisited>;
    
    async setForChannel(userId: string, channelId: string, date: Date) {
        const newEntity = this.firstUnreadRepository.create();
        newEntity.userId = userId;
        newEntity.channelId = channelId;
        newEntity.date = date;
        await this.firstUnreadRepository.save(newEntity);
        
        // await this.firstUnreadRepository.upsert({
        //     userId, channelId, date,
        // });
    }
}
