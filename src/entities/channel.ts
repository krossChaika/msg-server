import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Server } from './server';
import { Message } from './message.entity';
import { LastVisited } from './last-visited';
import { ChatMember } from './chat-member';
import { InternalServerErrorException } from '@nestjs/common';

@Entity('channels')
export class Channel {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;
    
    @Column({ type: 'varchar', length: 32, nullable: true })
    name?: string;
    
    @Column({ type: 'bigint', nullable: true })
    serverId?: string;
    
    @CreateDateColumn()
    createdAt: Date;
    
    @Column({ type: 'timestamptz', nullable: true })
    lastMessageDate: Date;
    
    @ManyToOne(() => Server, server => server.channels, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    server?: Server;
    
    @OneToMany(() => ChatMember, c => c.channel, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    chatMembers?: ChatMember[];
    
    @OneToMany(() => Message, message => message.channel)
    messages: Message[];
    
    @OneToMany(() => LastVisited, firstUnread => firstUnread.channel)
    firstUnreads: LastVisited[];
    
    public isMember(userId: string) {
        if (this.server) {
            return this.server.members.some(m => m.userId === userId);
        } else if (this.chatMembers) {
            return this.chatMembers.some(m => m.userId === userId);
        }
        throw new InternalServerErrorException('No relations loaded for channel.');
    }
    
    public getMembers() {
        if (this.server) {
            return this.server.members;
        } else if (this.chatMembers) {
            return this.chatMembers;
        }
        throw new InternalServerErrorException('No relations loaded for channel.');
    }
}

