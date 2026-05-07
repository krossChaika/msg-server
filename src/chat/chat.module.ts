import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Channel } from '../entities/channel';
import { MessageService } from '../message/message.service';
import { ChannelService } from '../channel/channel.service';
import { FriendRequestsModule } from '../friend-requests/friend-requests.module';
import { FriendshipModule } from '../friendship/friendship.module';
import { UserModule } from '../user/user.module';
import { ChatMemberModule } from '../chat-member/chat-member.module';
import { ServerModule } from '../server/server.module';
import { ServerMemberModule } from '../server-member/server-member.module';

@Module({
    providers: [
        ChatGateway,
        ChatService,
        MessageService,
        ChannelService,
    ],
    imports: [
        TypeOrmModule.forFeature([Channel, Message]),
        FriendRequestsModule,
        FriendshipModule,
        UserModule,
        ServerModule,
        ServerMemberModule,
        ChatMemberModule,
    ],
})
export class ChatModule {
}
