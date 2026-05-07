import { Channel } from '../../entities/channel';
import { User } from '../../entities/user.entity';

export class CreateMessageDto {
    text: string;
    userId: string;
    channelId: string;
    user?: User;
    channel?: Channel;
}
