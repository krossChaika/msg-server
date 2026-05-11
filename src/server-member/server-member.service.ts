import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerMember } from '../entities/server-member';
import { Repository } from 'typeorm';
import { CreateServerMemberDto } from './dto/create-server-member.dto';
import { ServerService } from '../server/server.service';

@Injectable()
export class ServerMemberService {
    @InjectRepository(ServerMember)
    private readonly membersRepository: Repository<ServerMember>;
    
    @Inject(forwardRef(() => ServerService))
    private readonly serverService: ServerService;
    
    public async joinServer(userId: string, code: string) {
        if (code.length !== 6) {
            throw new BadRequestException('Invalid invite code length.');
        }
        
        const server = await this.serverService.find({
            where: {
                inviteCode: code,
            },
            relations: {
                channels: true,
            },
        });
        
        if (!server) throw new NotFoundException();
        
        const membership = await this.membersRepository.findOne({
            where: {
                userId, serverId: server.id,
            },
        });
        
        if (membership) return;
        
        this.create({ userId: userId, serverId: server.id, joinedAt: new Date() });
        
        return server;
    }
    
    public async create(dto: CreateServerMemberDto) {
        return this.membersRepository.save(dto);
    }
}
