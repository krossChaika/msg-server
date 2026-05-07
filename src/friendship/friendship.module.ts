import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from '../entities/friendship';

@Module({
    controllers: [FriendshipController],
    providers: [FriendshipService],
    imports: [TypeOrmModule.forFeature([Friendship])],
    exports: [FriendshipService],
})
export class FriendshipModule {
}
