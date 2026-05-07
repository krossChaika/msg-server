import { Controller, ForbiddenException, Get, Inject, Param, Req, UseGuards } from '@nestjs/common';
import { ServerMemberService } from './server-member.service';
import { type Request } from 'express';
import { AuthGuard } from '../guards/auth-guard';

@Controller('server-member')
export class ServerMemberController {
    @Inject()
    private readonly serverMemberService: ServerMemberService;
    
    @Get('me')
    @UseGuards(AuthGuard)
    async findAllForMe(@Req() req: Request) {
        if (!req.headers.authorization) return new ForbiddenException();
        
        return this.serverMemberService.findAllByUserId(req.headers.authorization);
    }
}
