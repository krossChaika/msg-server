import 'reflect-metadata';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Server } from './server';
import { ServerMember } from './server-member';
import { LastVisited } from './last-visited';
import { Friendship } from './friendship';
import { ChatMember } from './chat-member';
import { FriendRequest } from './friend-request';

@Entity('users')
@Index(['name'], { unique: true })
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;
    
    @Column({ type: 'varchar', length: 32, unique: true })
    name: string;
    
    @OneToMany(() => ChatMember, c => c.user)
    chats: ChatMember[];
    
    @OneToMany(() => Server, server => server.owner)
    ownedServers: Server[];
    
    @OneToMany(() => ServerMember, m => m.user)
    serverMemberships: ServerMember[];
    
    @OneToMany(() => LastVisited, l => l.user)
    lastVisitDates: LastVisited[];
    
    @OneToMany(() => Friendship, f => f.user)
    friendships: Friendship[];
    
    @OneToMany(() => FriendRequest, r => r.sender)
    outgoingFriendRequests: FriendRequest[];
    
    @OneToMany(() => FriendRequest, r => r.receiver)
    incomingFriendRequests: FriendRequest[];
}
