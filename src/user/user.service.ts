import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
    @InjectRepository(User)
    private readonly userRepository: Repository<User>;
    
    async create(createUserDto: CreateUserDto) {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }
    
    findAll() {
        return this.userRepository.find();
    }
    
    async findMe(userId: string) {
        return this.userRepository.findOne({
            where: {
                id: userId,
            },
            relations: {
                lastVisitDates: true,
                friendships: true,
                incomingFriendRequests: true,
                outgoingFriendRequests: true,
                chats: {
                    channel: {
                        chatMembers: {
                            user: true,
                        },
                    },
                },
                serverMemberships: {
                    server: {
                        channels: true,
                        members: {
                            user: true,
                        },
                    },
                },
            },
        });
    }
    
    findOne(options: FindOneOptions<User>) {
        return this.userRepository.findOne(options);
    }
    
    update(id: string, updateUserDto: UpdateUserDto) {
        return this.userRepository.update(id, updateUserDto);
    }
    
    remove(id: string) {
        return this.userRepository.delete({ id: id });
    }
}
