import { Body, Controller, Inject, NotFoundException, Post, Res } from '@nestjs/common';
import { UserCredentialsService } from '../user-credentials/user-credentials.service';
import { type Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthToken, authTokenName } from '../types/auth';

@Controller('auth')
export class AuthController {
    @Inject()
    private readonly userCredentialsService: UserCredentialsService;
    
    @Inject()
    private readonly jwtService: JwtService;
    
    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const credentials = await this.userCredentialsService.findAllByPassword(password);
        
        if (credentials.length === 0) throw new NotFoundException();
        
        const user = credentials.filter(async (data) => (await data.user).name === username)[0];
        
        if (!user) throw new NotFoundException();
        
        const authToken: AuthToken = {
            id: user.id,
            username: username,
        };
        
        const token = this.jwtService.sign(authToken);
        
        res.cookie(authTokenName, token, {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        });
        
        return { message: 'Logged in' };
    }
}
