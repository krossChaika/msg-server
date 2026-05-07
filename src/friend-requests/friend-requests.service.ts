import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from '../entities/friend-request';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateFriendRequestDto } from './create-friend-request.dto';

@Injectable()
export class FriendRequestsService {
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>;
    
    async findOne(options: FindOneOptions<FriendRequest>) {
        return this.friendRequestRepository.findOne(options);
    }
    
    async create(dto: CreateFriendRequestDto): Promise<FriendRequest> {
        if (dto.receiverId === dto.senderId) {
            throw new BadRequestException('Trying to send friend request to self');
        }
        
        const request = this.friendRequestRepository.create(dto);
        
        const res = await this.friendRequestRepository.save(request);
        return this.friendRequestRepository.findOneOrFail({
            where: { id: res.id },
        });
    }
    
    async delete(requestId: string) {
        return this.friendRequestRepository.delete(requestId);
    }
}
