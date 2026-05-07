import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('friend_requests')
@Index(['senderId', 'receiverId'], { unique: true })
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: string;
    
    @Column({ type: 'bigint' })
    senderId: string;
    
    @Column({ type: 'bigint' })
    receiverId: string;
    
    @ManyToOne(() => User, user => user.outgoingFriendRequests, { onDelete: 'CASCADE', eager: true })
    sender: User;
    
    @ManyToOne(() => User, user => user.incomingFriendRequests, { onDelete: 'CASCADE', eager: true })
    receiver: User;
}