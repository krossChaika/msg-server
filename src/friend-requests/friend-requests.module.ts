import { Module } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from '../entities/friend-request';

@Module({
    controllers: [FriendRequestsController],
    providers: [FriendRequestsService],
    imports: [TypeOrmModule.forFeature([FriendRequest])],
    exports: [FriendRequestsService],
})
export class FriendRequestsModule {
}
