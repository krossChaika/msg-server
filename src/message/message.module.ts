import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Channel } from '../entities/channel';
import { ChannelService } from '../channel/channel.service';
import { User } from '../entities/user.entity';
import { UserService } from '../user/user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Channel, Message]),
    ],
    providers: [MessageService, ChannelService, UserService],
    controllers: [MessageController],
})
export class MessageModule {
}
