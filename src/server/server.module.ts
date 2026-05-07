import { forwardRef, Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../entities/server';
import { ServerMemberModule } from '../server-member/server-member.module';

@Module({
    controllers: [ServerController],
    providers: [ServerService],
    imports: [TypeOrmModule.forFeature([Server]), forwardRef(() => ServerMemberModule)],
    exports: [ServerService],
})
export class ServerModule {
}
