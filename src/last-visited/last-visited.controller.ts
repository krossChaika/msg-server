import {
    Body,
    Controller,
    ExecutionContext,
    Get,
    Inject,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { LastVisitedService } from './last-visited.service';
import { type Request } from 'express';
import { AuthGuard } from '../guards/auth-guard';
import { ServerMembershipGuard } from '../guards/server-membership-guard';

@Controller('last-visited')
@UseGuards(AuthGuard)
export class LastVisitedController {
    @Inject()
    private readonly firstUnreadsService: LastVisitedService;
    
    @Post()
    // @UseGuards(new ServerMembershipGuard('ws'))
    @UseGuards(ServerMembershipGuard)
    async setForChannel(
        @Req() request: Request,
        @Body('channelId') channelId: string,
        @Body('date') date: Date,
    ) {
        if (!request.headers.authorization) throw new UnauthorizedException();
        
        return this.firstUnreadsService.setForChannel(
            request.headers.authorization,
            channelId,
            date,
        );
    }
}
