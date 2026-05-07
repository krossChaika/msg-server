import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel';

@Entity('last_visited')
export class LastVisited {
    @PrimaryColumn({ type: 'bigint' })
    userId: string;
    
    @PrimaryColumn({ type: 'bigint' })
    channelId: string;
    
    @Column({ type: 'timestamptz' })
    date: Date;
    
    @ManyToOne(() => User, u => u.lastVisitDates, { onDelete: 'CASCADE' })
    user: User;
    
    @ManyToOne(() => Channel, c => c.firstUnreads, { onDelete: 'CASCADE' })
    channel: Channel;
}