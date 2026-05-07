import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from '../entities/friendship';
import { Repository } from 'typeorm';

@Injectable()
export class FriendshipService {
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>;
    
    async findOne(userId: string, friendId: string) {
        return this.friendshipRepository.findOne({
            where: {
                userId,
                friendId,
            },
        });
    }
    
    async create(userId: string, friendId: string) {
        const forward = this.friendshipRepository.create({
            userId,
            friendId,
        });
        
        const reverse = this.friendshipRepository.create({
            userId: friendId,
            friendId: userId,
        });
        
        return this.friendshipRepository.save([forward, reverse]);
    }
    
    async delete(userId: string, friendId: string) {
        return (this.friendshipRepository.delete({ userId, friendId })).then(_ => {
            this.friendshipRepository.delete({
                userId: friendId,
                friendId: userId,
            });
        });
    }
}