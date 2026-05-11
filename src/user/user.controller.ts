import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    NotFoundException, Req, ForbiddenException, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { Request } from 'express';
import { AuthGuard } from '../guards/auth-guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }
    
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }
    
    @Get('/me')
    @UseGuards(AuthGuard)
    async findMe(@Req() req: Request) {
        if (!req.headers.authorization) return new ForbiddenException();
        
        return this.userService.findMe(req.headers.authorization);
    }
    
    @Get()
    async findAll() {
        return await this.userService.findAll();
    }
    
    @Get('/id/:id')
    async findOne(@Param('id') id: string) {
        let user = await this.userService.findOne({
            where: { id: id },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}
