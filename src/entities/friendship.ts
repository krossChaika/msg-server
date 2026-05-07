import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('friendships')
// @Index(['userId', 'friendId'], { unique: true })
export class Friendship {
    @PrimaryColumn({ type: 'bigint' })
    userId: string;
    
    @PrimaryColumn({ type: 'bigint' })
    friendId: string;
    
    @ManyToOne(() => User, (user) => user.friendships, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;
    
    @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'friendId' })
    friend: User;
}