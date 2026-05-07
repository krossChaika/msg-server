import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { ChannelService } from '../channel/channel.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { AuthToken, authTokenName } from '../types/auth';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { Connection, ConnectionsPool } from './chat.types';
import { ChatMemberService } from '../chat-member/chat-member.service';
import { CreateChatDto } from './create-chat.dto';
import { CreateChannelDto } from '../channel/create-channel.dto';
import { ServerService } from '../server/server.service';
import { ServerMemberService } from '../server-member/server-member.service';

@Injectable()
export class ChatService {
    public connections: ConnectionsPool;
    
    @Inject()
    private readonly messageService: MessageService;
    @Inject()
    private readonly serverService: ServerService;
    @Inject()
    private readonly serverMemberService: ServerMemberService;
    @Inject()
    private readonly channelService: ChannelService;
    @Inject()
    private readonly chatMemberService: ChatMemberService;
    @Inject()
    private readonly userService: UserService;
    @Inject()
    private readonly jwtService: JwtService;
    
    public handleConnection(client: Socket) {
        try {
            const cookies = client.handshake.headers.cookie;
            
            if (!cookies) throw new UnauthorizedException();
            
            const cookie = cookies
                .replaceAll(' ', '')
                .split(';')
                .find(s => s.startsWith(authTokenName));
            if (!cookie) throw new UnauthorizedException();
            
            let authToken: AuthToken;
            
            authToken = this.jwtService.decode<AuthToken>(cookie.split('=')[1]);
            if (!authToken) throw new UnauthorizedException();
            
            const userId = authToken.id;
            
            const connection: Connection = {
                userId: userId,
                socket: client,
            };
            
            client.handshake.headers.authorization = userId;
            
            this.connections.set(userId, connection);
            // this.connectionsBySocketId.set(client.id, connection);
            
            console.log('Connected');
        } catch (error) {
            client.disconnect(true);
            console.error('Connection failed,', error);
        }
    }
    
    public handleDisconnect(client: Socket) {
        this.connections.delete(client);
    }
    
    public async createMessage(createMessageDto: CreateMessageDto) {
        const authorId = createMessageDto.userId;
        const channel = createMessageDto.channel!;
        
        const channelMembersIds = channel.getMembers().map(x => x.userId);
        
        const mes = await this.messageService.create(createMessageDto);
        
        const user = await this.userService.findOne({
            where: { id: authorId },
        });
        
        if (!user) {
            throw new UnauthorizedException('No user with id ' + authorId);
        }
        
        mes.user = user;
        
        for (const memberId of channelMembersIds) {
            if (memberId === authorId) continue;
            this.connections.emitToUser(memberId, 'create-new-message', {
                message: mes,
                serverId: channel.serverId,
            });
        }
        
        await this.channelService.updateLastMessageDate(channel.id, mes.createdAt);
        
        return { message: mes, serverId: channel.serverId };
    }
    
    public async deleteMessage(userId: string, messageId: string) {
        const message = await this.messageService.findOne({
            where: {
                id: messageId,
            },
            relations: {
                channel: {
                    server: {
                        members: true,
                    },
                    chatMembers: true,
                },
            },
        });
        
        if (!message) throw new NotFoundException();
        
        const channel = message.channel;
        
        if (channel.server?.ownerId !== userId && message.userId !== userId) {
            throw new UnauthorizedException();
        }
        
        const socketMessageToUsers = {
            messageId,
            channelId: channel.id,
        };
        
        const members = channel.server
            ? channel.server.members : channel.chatMembers;
        
        if (members) {
            for (const membership of members) {
                this.connections.emitToUser(
                    membership.userId,
                    'delete-message',
                    socketMessageToUsers,
                );
            }
        }
        
        return this.messageService.delete({ id: messageId });
    }
    
    public async createServer(ownerId: string, name: string) {
        if (name.length < 1 || name.length > 30) {
            throw new BadRequestException('Invalid server name length.');
        }
        
        const { server } = await this.serverService.create({ ownerId, name });
        const channel = await this.channelService.create({
            name: 'general',
            serverId: server.id,
        });
        server.channels = [channel];
        
        return server;
    }
    
    public async joinServer(userId: string, code: string) {
        return this.serverMemberService.joinServer(userId, code);
    }
    
    public async createChannel(authorId: string, dto: CreateChannelDto) {
        if (!dto.serverId) throw new BadRequestException('Server ID is required');
        if (dto.name.length > 30 || dto.name.length < 1) {
            throw new BadRequestException('Server Name is invalid');
        }
        
        const server = await this.serverService.find({
            where: {
                id: dto.serverId,
            },
            relations: {
                members: true,
            },
        });
        
        if (!server) throw new NotFoundException('No server with ID ' + dto.serverId);
        if (server.ownerId !== authorId) throw new UnauthorizedException();
        
        const channel = await this.channelService.create(dto);
        
        for (const membership of server.members) {
            if (membership.userId === authorId) continue;
            
            this.connections.emitToUser(
                membership.userId,
                'create-channel',
                channel,
            );
        }
        
        return channel;
    }
    
    public async createChat(authorId: string, dto: CreateChatDto) {
        if (authorId === dto.userId) return;
        
        const findResult = await this.chatMemberService.findForUsers(authorId, dto.userId);
        
        if (findResult) return;
        
        const channel = await this.channelService.create({ name: '' });
        
        const message = await this.messageService.create({
            text: dto.message,
            userId: authorId,
            channelId: channel.id,
        });
        
        const membership = this.chatMemberService.create(
            authorId,
            dto.userId,
            channel.id,
        );
        
        const m1 = await membership.membership1;
        const m2 = await membership.membership2;
        const channelWithRelations = (await this.channelService.findOneById(
            channel.id,
            {
                chatMembers: {
                    user: true,
                },
            },
        ))!;
        m1.channel = channelWithRelations;
        m2.channel = channelWithRelations;
        
        this.connections.emitToUser(dto.userId, 'create-chat', m2);
        this.connections.emitToUser(dto.userId, 'create-new-message', message);
        
        return m1;
    }
}
