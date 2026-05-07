import { Module } from '@nestjs/common';
import { ChatMemberService } from './chat-member.service';
import { ChatMemberController } from './chat-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMember } from '../entities/chat-member';

@Module({
    controllers: [ChatMemberController],
    providers: [ChatMemberService],
    exports: [ChatMemberService],
    imports: [TypeOrmModule.forFeature([ChatMember])],
})
export class ChatMemberModule {
}
