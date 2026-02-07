import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  @Post()
  async sendMessage(@Req() req: any, @Body() createMessageDto: CreateMessageDto) {
    createMessageDto.senderId = req.user.id;
    return this.messagingService.sendMessage(createMessageDto);
  }

  @Get('conversations')
  async getConversations(@Req() req: any) {
    return this.messagingService.getUserConversations(req.user.id);
  }

  @Get('conversation/:otherId')
  async getConversation(@Req() req: any, @Param('otherId') otherId: string) {
    return this.messagingService.getConversation(req.user.id, otherId);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.messagingService.markAsRead(id);
  }
}
