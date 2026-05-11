import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserCredentialsService } from '../user-credentials/user-credentials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentials } from '../entities/user-credentials.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserCredentials]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            global: true,
            signOptions: {
                expiresIn: '365d',
            },
        }),
        UserModule,
    ],
    providers: [UserCredentialsService],
    controllers: [AuthController],
})
export class AuthModule {
}
