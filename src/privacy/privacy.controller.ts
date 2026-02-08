import { Controller, Get, Post, Body, Request, UseGuards } from "@nestjs/common";
import { PrivacyService } from "./privacy.service";
import { CreatePrivacySettingsDto } from "./dto/create-privacy-settings.dto";
import { JwtGuard } from "../common/guards/jwt.guard";

@Controller("privacy")
@UseGuards(JwtGuard)
export class PrivacyController {
  constructor(private service: PrivacyService) {}

  @Get("settings")
  async getSettings(@Request() req) {
    return this.service.getPrivacySettings(req.user.id);
  }

  @Post("settings")
  async updateSettings(
    @Request() req,
    @Body() dto: CreatePrivacySettingsDto
  ) {
    return this.service.updatePrivacySettings(req.user.id, dto);
  }

  @Post("export")
  async requestDataExport(@Request() req) {
    return this.service.requestDataExport(req.user.id);
  }

  @Get("exports")
  async getDataExports(@Request() req) {
    return this.service.getDataExports(req.user.id);
  }

  @Post("delete-account")
  async requestAccountDeletion(@Request() req) {
    return this.service.requestAccountDeletion(req.user.id);
  }

  @Post("cancel-deletion")
  async cancelDeletionRequest(@Request() req) {
    return this.service.cancelDeletionRequest(req.user.id);
  }
}