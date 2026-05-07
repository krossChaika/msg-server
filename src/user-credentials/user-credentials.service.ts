import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from '../entities/user-credentials.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserCredentialsService {
    @InjectRepository(UserCredentials)
    private readonly credentialsRepository: Repository<UserCredentials>;
    
    findOneById(id: string) {
        return this.credentialsRepository.findOneBy({ id: id });
    }
    
    findOneByPassword(password: string) {
        return this.credentialsRepository.findOneBy({ password: password });
    }
    
    findAllByPassword(password: string) {
        return this.credentialsRepository.findBy({ password: password });
    }
}
