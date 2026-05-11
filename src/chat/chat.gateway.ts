import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { BadRequestException, Inject, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { ServerMembershipGuard } from '../guards/server-membership-guard';
import { FriendRequestsService } from '../friend-requests/friend-requests.service';
import { CreateFriendRequestDto } from '../friend-requests/create-friend-request.dto';
import { ConnectionsPool, SocketMessage } from './chat.types';
import { DecideFriendRequestDto } from '../friend-requests/decide-friend-request.dto';
import { FriendshipService } from '../friendship/friendship.service';
import { UserService } from '../user/user.service';
import { CreateChatDto } from './create-chat.dto';
import { CreateChannelDto } from '../channel/create-channel.dto';

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @Inject()
    private readonly userService: UserService;
    @Inject()
    private readonly friendRequestsService: FriendRequestsService;
    @Inject()
    private readonly friendshipService: FriendshipService;
    
    private connections = new ConnectionsPool();
    
    constructor(
        @Inject()
        private readonly chatService: ChatService,
    ) {
        this.chatService.connections = this.connections;
    }
    
    public handleConnection(client: Socket) {
        return this.chatService.handleConnection(client);
    }
    
    public handleDisconnect(client: Socket) {
        this.chatService.handleDisconnect(client);
    }
    
    @SubscribeMessage<SocketMessage>('create-new-message')
    @UseGuards(ServerMembershipGuard)
    async createNewMessage(
        @MessageBody() createMessageDto: CreateMessageDto,
    ) {
        return this.chatService.createMessage(createMessageDto);
    }
    
    @SubscribeMessage<SocketMessage>('delete-message')
    async deleteMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: { messageId: string },
    ) {
        const userId = this.getUserId(client);
        return this.chatService.deleteMessage(userId, dto.messageId);
    }
    
    @SubscribeMessage<SocketMessage>('send-friend-request')
    async sendFriendRequest(
        @ConnectedSocket() client: Socket,
        @MessageBody('username') name: string,
    ) {
        const otherUser = await this.userService.findOne({ where: { name: name } });
        
        if (!otherUser) throw new NotFoundException(`User ${name} not found`);
        
        const senderId = this.getUserId(client);
        const receiverId = otherUser.id;
        
        const friendship = await this.friendshipService.findOne(senderId, receiverId);
        
        if (friendship) {
            throw new BadRequestException('Already friends');
        }
        
        const dto: CreateFriendRequestDto = { senderId, receiverId };
        
        const req = await this.friendRequestsService.create(dto);
        
        this.connections.emitToUser(receiverId, 'receive-friend-request', req);
        
        return req;
    }
    
    @SubscribeMessage<SocketMessage>('decide-friend-request')
    async decideFriendRequest(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: DecideFriendRequestDto,
    ) {
        const userId = this.getUserId(client);
        const request = await this.friendRequestsService.findOne({
            where: {
                id: dto.id,
            },
        });
        
        if (!request || (request.senderId !== userId && request.receiverId !== userId)) {
            return;
        }
        
        const friendId = request.senderId === userId
            ? request.receiverId : request.senderId;
        
        this.friendRequestsService.delete(request.id);
        
        if (dto.action === 'accept' && userId === request.receiverId) {
            await this.friendshipService.create(userId, friendId);
            
            const forward = await this.friendshipService.findOne(userId, friendId);
            const reverse = await this.friendshipService.findOne(friendId, userId);
            
            this.connections.emitToUser(userId, 'accepted-friend-request', {
                friendship: forward,
                id: request.id,
            });
            this.connections.emitToUser(friendId, 'accepted-friend-request', {
                friendship: reverse,
                id: request.id,
            });
        } else if (dto.action === 'decline') {
            this.connections.emitToUsers(
                [userId, friendId], 'declined-friend-request', dto.id,
            );
        }
    }
    
    @SubscribeMessage<SocketMessage>('create-server')
    async createServer(
        @ConnectedSocket() client: Socket,
        @MessageBody('name') name: string,
    ) {
        const userId = this.getUserId(client);
        return this.chatService.createServer(userId, name);
    }
    
    @SubscribeMessage<SocketMessage>('join-server')
    async joinServer(
        @ConnectedSocket() client: Socket,
        @MessageBody('code') code: string,
    ) {
        const userId = this.getUserId(client);
        return this.chatService.joinServer(userId, code);
    }
    
    @SubscribeMessage<SocketMessage>('create-chat')
    async createChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: CreateChatDto,
    ) {
        const authorId = this.getUserId(client);
        return this.chatService.createChat(authorId, dto);
    }
    
    @SubscribeMessage<SocketMessage>('create-channel')
    async createChannel(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: CreateChannelDto,
    ) {
        const authorId = this.getUserId(client);
        return this.chatService.createChannel(authorId, dto);
    }
    
    private getUserId(client: Socket) {
        const id = client.handshake.headers.authorization;
        
        if (id) return id;
        
        this.disconnect(client);
        throw new UnauthorizedException();
    }
    
    private disconnect(client: Socket) {
        client.disconnect(true);
    }
}