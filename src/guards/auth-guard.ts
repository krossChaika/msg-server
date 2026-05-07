import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { type Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthToken, authTokenName } from '../types/auth';

@Injectable()
export class AuthGuard implements CanActivate {
    @Inject()
    private readonly jwtService: JwtService;
    
    public canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authToken = request.cookies[authTokenName];
        
        if (!authToken) {
            console.log('No token provided');
            return false;
        }
        
        const decoded = this.jwtService.decode<AuthToken>(authToken);
        
        if (!decoded) {
            console.log('Bad token');
            return false;
        }
        
        // console.log(decoded);
        request.headers.authorization = decoded.id;
        
        return true;
    }
}