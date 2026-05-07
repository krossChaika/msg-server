import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from '../entities/server';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateServerDto } from './dto/create-server.dto';
import { ServerMemberService } from '../server-member/server-member.service';

@Injectable()
export class ServerService {
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>;
    
    @Inject()
    private readonly serverMemberService: ServerMemberService;
    
    private allSymbols: string;
    
    constructor() {
        const letters = 'qwertyuiopasdfghjklzxcvbnm';
        this.allSymbols = '1234567890' + letters + letters.toUpperCase();
    }
    
    public async create(dto: CreateServerDto) {
        dto.inviteCode = this.generateInviteCode();
        
        const server = await this.serverRepository.save(dto);
        
        const membership = await this.serverMemberService.create({
            userId: dto.ownerId,
            serverId: server.id,
            joinedAt: new Date(),
        });
        
        return { server, membership };
    }
    
    public async find(options: FindOneOptions<Server>) {
        return this.serverRepository.findOne(options);
    }
    
    private generateInviteCode() {
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += this.allSymbols.charAt(
                Math.floor(Math.random() * this.allSymbols.length),
            );
        }
        return code;
    }
}
