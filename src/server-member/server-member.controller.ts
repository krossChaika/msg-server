import { Controller, Inject } from '@nestjs/common';
import { ServerMemberService } from './server-member.service';

@Controller('server-member')
export class ServerMemberController {
    @Inject()
    private readonly serverMemberService: ServerMemberService;
}
