import {
    BadRequestException,
    Body,
    Controller,
    Inject,
    NotFoundException,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { UserCredentialsService } from '../user-credentials/user-credentials.service';
import { type Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthToken, authTokenName } from '../types/auth';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
    @Inject()
    private readonly userCredentialsService: UserCredentialsService;
    @Inject()
    private readonly userService: UserService;
    @Inject()
    private readonly jwtService: JwtService;
    
    @Post('register')
    async register(
        @Body('username') username: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        let user = await this.userService.findOne({ where: { name: username } });
        
        if (user) throw new BadRequestException('User already exists!');
        
        user = await this.userService.create({ name: username });
        await this.userCredentialsService.create({ password, userId: user.id });
        
        const authToken: AuthToken = {
            id: user.id,
            username: user.name,
        };
        
        console.log('Created user: ', authToken);
        
        const token = this.jwtService.sign(authToken);
        
        res.cookie(authTokenName, token, {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true,
            partitioned: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        
        return { message: 'Registered', ok: true };
    }
    
    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const credentials = await this.userCredentialsService.findOneByUsername(username);
        
        if (!credentials || credentials.password !== password) {
            throw new UnauthorizedException();
        }
        
        const authToken: AuthToken = {
            id: credentials.userId,
            username: username,
        };
        
        console.log('Logged in user: ', authToken);
        
        const token = this.jwtService.sign(authToken);
        
        res.cookie(authTokenName, token, {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true,
            partitioned: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        
        return { message: 'Logged in', ok: true };
    }
}
