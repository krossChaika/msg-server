import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../entities/channel';
import { FindOptionsRelations, Repository } from 'typeorm';
import { CreateChannelDto } from './create-channel.dto';

type CachedChannel = {
    channel: Channel;
    timeout: NodeJS.Timeout;
}

@Injectable()
export class ChannelService {
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>;
    
    private readonly idCache = new Map<string, CachedChannel>();
    
    async findOneById(
        id: string,
        relations?: FindOptionsRelations<Channel>,
    ): Promise<Channel | null> {
        const cached = this.idCache.get(id);
        if (cached) {
            console.log('return from cache');
            return cached.channel;
        }
        
        const channelPromise = this.channelRepository.findOne({
            where: {
                id: id,
            },
            relations: relations,
        });
        
        channelPromise.then((channel) => {
            if (channel) {
                this.idCache.set(id, {
                    channel,
                    timeout: setTimeout(() => {
                        this.idCache.delete(id);
                    }, 60 * 1000),
                });
            }
        });
        
        console.log('fetched');
        return channelPromise;
    }
    
    async create(dto: CreateChannelDto) {
        const channel = this.channelRepository.create({
            ...dto,
            lastMessageDate: new Date(),
        });
        return this.channelRepository.save(channel);
    }
    
    async updateLastMessageDate(channelId: string, lastMessageDate: Date) {
        return this.channelRepository.update(channelId, { lastMessageDate });
    }
}
