import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../entities/channel';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

type ContextParser = (context: ExecutionContext) => {
    userId?: string;
    channelId?: string;
    body: any;
};

const parseContext = (context: ExecutionContext) => {
    return context.getType() === 'http'
        ? parseHttpContext(context) : parseWsContext(context);
};

const parseHttpContext: ContextParser = (context) => {
    const req = context.switchToHttp().getRequest<Request>();
    const userId = req.headers.authorization;
    const channelId = req.body.channelId;
    
    return { userId, channelId, body: req };
};

const parseWsContext = (context: ExecutionContext) => {
    const client = context.switchToWs().getClient<Socket>();
    const body = context.switchToWs().getData();
    
    const userId = client.handshake.headers.authorization;
    const channelId = body.channelId;
    
    return { userId, channelId, body };
};

export class ServerMembershipGuard implements CanActivate {
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>;
    
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const { userId, channelId, body } = parseContext(context);
        
        if (!userId || !channelId) return false;
        
        const channel = await this.channelsRepository.findOne({
            where: {
                id: channelId,
            },
            relations: {
                server: {
                    members: true,
                },
                chatMembers: true,
            },
        });
        if (!channel) return false;
        
        body.userId = userId;
        body.channel = channel;
        
        return channel.isMember(userId);
    }
}