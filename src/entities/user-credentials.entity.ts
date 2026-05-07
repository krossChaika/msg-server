import 'reflect-metadata';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_credentials')
export class UserCredentials {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;
    
    @Column()
    password: string;
    
    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: Promise<User>;
}