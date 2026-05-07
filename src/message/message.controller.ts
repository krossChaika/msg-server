import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Query,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from '../guards/auth-guard';
import { ServerMembershipGuard } from '../guards/server-membership-guard';
import { type Request } from 'express';
import { LessThan, Raw } from 'typeorm';

@Controller('message')
@UseGuards(AuthGuard)
export class MessageController {
    @Inject()
    private readonly messageService: MessageService;
    
    @Get('by-channel/:id')
    async findByChannelId(
        @Param('id') id: string,
        @Query('limit') limit?: number,
        @Query('before') beforeDate?: Date,
    ) {
        return await this.messageService.findMany({
            where: {
                channel: {
                    id: id,
                },
                createdAt: Raw((alias) => `${alias} < :date`, { date: beforeDate }),
            },
            relations: {
                user: true,
            },
            order: {
                createdAt: 'desc',
            },
            take: limit,
        });
    }
    
    @Post('after')
    // @UseGuards(new ServerMembershipGuard('http'))
    @UseGuards(ServerMembershipGuard)
    async getCountAfterDate(
        @Body('channelId') channelId: string,
        @Body('date') date: string,
    ) {
        return await this.messageService.getCount({
            where: {
                channel: {
                    id: channelId,
                },
                createdAt: Raw((alias) => `${alias} >= :date`, { date: date }),
            },
        });
    }
    
    @Post()
    // @UseGuards(new ServerMembershipGuard('http'))
    @UseGuards(ServerMembershipGuard)
    async create(@Req() req: Request, @Body() createMessageDto: CreateMessageDto) {
        if (!req.headers.authorization) throw new UnauthorizedException('No user id');
        
        this.messageService.create(createMessageDto);
    }
}
