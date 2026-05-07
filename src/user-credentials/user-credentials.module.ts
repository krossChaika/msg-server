import { Module } from '@nestjs/common';
import { UserCredentialsService } from './user-credentials.service';
import { UserCredentialsController } from './user-credentials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentials } from '../entities/user-credentials.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserCredentials])],
    controllers: [UserCredentialsController],
    providers: [UserCredentialsService],
})
export class UserCredentialsModule {
}
