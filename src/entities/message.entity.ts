import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel';
import { User } from './user.entity';

@Entity('messages')
@Index(['channel', 'createdAt'], { unique: true })
export class Message {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;
    
    @Column({ type: 'bigint' })
    userId: string;
    
    @Column({ type: 'bigint' })
    channelId: string;
    
    @Column({ type: 'text' })
    text: string;
    
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;
    
    @ManyToOne(() => Channel, channel => channel.messages, { onDelete: 'CASCADE' })
    channel: Channel;
    
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
}
