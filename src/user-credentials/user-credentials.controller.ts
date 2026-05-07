import { Controller } from '@nestjs/common';
import { UserCredentialsService } from './user-credentials.service';

@Controller('user-credentials')
export class UserCredentialsController {
  constructor(private readonly userCredentialsService: UserCredentialsService) {}
}
