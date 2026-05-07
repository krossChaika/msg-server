import { forwardRef, Module } from '@nestjs/common';
import { ServerMemberService } from './server-member.service';
import { ServerMemberController } from './server-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMember } from '../entities/server-member';
import { ServerModule } from '../server/server.module';

@Module({
    controllers: [ServerMemberController],
    providers: [ServerMemberService],
    imports: [TypeOrmModule.forFeature([ServerMember]), forwardRef(() => ServerModule)],
    exports: [ServerMemberService],
})
export class ServerMemberModule {
}
