import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../entities/channel';

@Module({
    controllers: [ChannelController],
    providers: [ChannelService],
    imports: [TypeOrmModule.forFeature([Channel])],
})
export class ChannelModule {
}
