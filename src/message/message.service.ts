import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageService {
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>;
    
    constructor() {
        // for (let i = 0; i < 500; i++) {
        //     let createMessageDto: CreateMessageDto = {
        //         text: 'message #' + i,
        //         channelId: '1',
        //     };
        //     this.create('1', createMessageDto);
        // }
    }
    
    async getCount(options: FindManyOptions<Message>) {
        return this.messageRepository.count(options);
    }
    
    async findOne(options: FindOneOptions<Message>) {
        return this.messageRepository.findOne(options);
    }
    
    async findMany(options: FindManyOptions<Message>) {
        return this.messageRepository.find(options);
    }
    
    async create(dto: CreateMessageDto): Promise<Message> {
        if (dto.text.length < 1 || dto.text.length > 1000) {
            throw new BadRequestException('Invalid message length (< 1 or > 1000)');
        }
        
        const message = this.messageRepository.create(dto);
        return this.messageRepository.save(message);
    }
    
    async delete(options: FindOptionsWhere<Message>) {
        return this.messageRepository.delete(options);
    }
}
