import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel';
import { User } from './user.entity';

@Entity('chat_members')
export class ChatMember {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;
    
    @PrimaryColumn({ type: 'bigint' })
    userId: string;
    
    @Column({ type: 'bigint' })
    channelId: string;
    
    @ManyToOne(() => Channel, c => c.chatMembers)
    channel: Channel;
    
    @ManyToOne(() => User)
    user: User;
}