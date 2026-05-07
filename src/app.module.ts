import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { UserCredentialsModule } from './user-credentials/user-credentials.module';
import { AuthModule } from './login/auth.module';
import { Server } from './entities/server';
import { ServerMember } from './entities/server-member';
import { Channel } from './entities/channel';
import { ServerModule } from './server/server.module';
import { ServerMemberModule } from './server-member/server-member.module';
import { ChannelModule } from './channel/channel.module';
import { LastVisitedModule } from './last-visited/last-visited.module';
import { FriendshipModule } from './friendship/friendship.module';
import { ChatMember } from './entities/chat-member';
import { FriendRequest } from './entities/friend-request';
import { ChatModule } from './chat/chat.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { Friendship } from './entities/friendship';
import { ChatMemberModule } from './chat-member/chat-member.module';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'typeormtest-kirillchaikovsky8-4048.j.aivencloud.com',
            port: 26271,
            ssl: {
                rejectUnauthorized: false,
            },
            username: 'avnadmin',
            password: process.env.DB_PWD,
            database: 'defaultdb',
            autoLoadEntities: true,
            entities: [ChatMember],
            synchronize: true,
            connectTimeoutMS: 0,
            extra: {
                keepAlive: true,
                idleTimeoutMillis: 300000,
            },
        }),
        MessageModule,
        UserCredentialsModule,
        AuthModule,
        ServerModule,
        ServerMemberModule,
        ChannelModule,
        LastVisitedModule,
        FriendshipModule,
        ChatModule,
        FriendRequestsModule,
        ChatMemberModule,
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
export class AppModule {
}
