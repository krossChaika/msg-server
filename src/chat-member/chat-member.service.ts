import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMember } from '../entities/chat-member';
import { Repository } from 'typeorm';

@Injectable()
export class ChatMemberService {
    @InjectRepository(ChatMember)
    private readonly chatMemberRepository: Repository<ChatMember>;
    
    async findForUsers(
        userId1: string,
        userId2: string,
    ) {
        const memberships1 = await this.chatMemberRepository.find({
            where: {
                userId: userId1,
            },
        });
        
        const memberships2 = await this.chatMemberRepository.find({
            where: {
                userId: userId2,
            },
        });
        
        for (const m1 of memberships1) {
            for (const m2 of memberships2) {
                if (m1.channelId === m2.channelId) {
                    return { membership1: m1, membership2: m2 };
                }
            }
        }
    }
    
    create(
        userId1: string,
        userId2: string,
        channelId: string,
    ): { membership1: Promise<ChatMember>, membership2: Promise<ChatMember> } {
        const obj1 = this.chatMemberRepository.create({
            userId: userId1,
            channelId: channelId,
        });
        const obj2 = this.chatMemberRepository.create({
            userId: userId2,
            channelId: channelId,
        });
        
        return {
            membership1: this.chatMemberRepository.save(obj1),
            membership2: this.chatMemberRepository.save(obj2),
        };
    }
}
