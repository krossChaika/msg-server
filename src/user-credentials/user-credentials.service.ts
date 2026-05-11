import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from '../entities/user-credentials.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class UserCredentialsService {
    @InjectRepository(UserCredentials)
    private readonly credentialsRepository: Repository<UserCredentials>;
    
    @Inject()
    private readonly userService: UserService;
    
    create(dto: { password: string; userId: string }) {
        const credentials = this.credentialsRepository.create(dto);
        return this.credentialsRepository.save(credentials);
    }
    
    async findOneByUsername(name: string) {
        const user = await this.userService.findOne({ where: { name } });
        
        if (!user) throw new NotFoundException();
        
        return this.credentialsRepository.findOneBy({ userId: user.id });
    }
}
