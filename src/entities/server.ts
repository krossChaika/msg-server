import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel';
import { User } from './user.entity';
import { ServerMember } from './server-member';

@Entity('servers')
@Index(['inviteCode'], { unique: true })
export class Server {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;
    
    @Column()
    name: string;
    
    @Column({ type: 'bigint' })
    ownerId: string;
    
    @Column({ type: 'varchar', length: 6 })
    inviteCode: string;
    
    @ManyToOne(() => User, user => user.ownedServers, { onDelete: 'CASCADE' })
    owner: User;
    
    @OneToMany(() => ServerMember, member => member.server)
    members: ServerMember[];
    
    @OneToMany(() => Channel, channel => channel.server)
    channels: Channel[];
}