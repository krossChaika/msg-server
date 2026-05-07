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
        return await this.userRepository.insert(createUserDto);
    }
    
    findAll() {
        return this.userRepository.find();
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
