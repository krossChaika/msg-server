import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Server } from './server';

@Entity('server_members')
export class ServerMember {
    @PrimaryColumn({ type: 'bigint' })
    userId: string;
    
    @PrimaryColumn({ type: 'bigint' })
    serverId: string;
    
    @ManyToOne(() => User, user => user.serverMemberships, { onDelete: 'CASCADE' })
    user: User;
    
    @ManyToOne(() => Server, server => server.members, { onDelete: 'CASCADE' })
    server: Server;
    
    @CreateDateColumn()
    joinedAt: Date;
}