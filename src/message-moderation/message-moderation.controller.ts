import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { MessageModerationService } from './message-moderation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';

@Controller('messages/moderation')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN, UserRole.CUSTOMER_SERVICE)
export class MessageModerationController {
  constructor(private readonly service: MessageModerationService) {}

  @Post(':messageId/flag')
  async flagMessage(
    @Request() req,
    @Param('messageId') messageId: string,
    @Body() body: { reason: string },
  ) {
    return this.service.flagMessage(req.user.id, messageId, body.reason);
  }

  @Get('flagged')
  async getFlagged() {
    return this.service.getFlaggedMessages();
  }

  @Post(':messageId/resolve')
  async resolve(@Param('messageId') messageId: string) {
    return this.service.resolveFlag(messageId);
  }

  @Post(':userId/block')
  async blockUser(@Param('userId') userId: string, @Body() body: { reason: string }) {
    return this.service.blockUser(userId, body.reason);
  }

  @Get('abuse-reports')
  async getReports() {
    return this.service.getAbuseReports();
  }
}
