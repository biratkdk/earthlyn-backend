import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from "@nestjs/common";
import { CustomerServiceService } from "./customer-service.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Roles, UserRole } from "../common/decorators/roles.decorator";
import { CreateTicketDto } from "./dto/create-ticket.dto";

@Controller("tickets")
@UseGuards(JwtAuthGuard)
export class CustomerServiceController {
  constructor(private readonly service: CustomerServiceService) {}

  @Post()
  async createTicket(@Request() req, @Body() dto: CreateTicketDto) {
    return this.service.createTicket(req.user.id, dto);
  }

  @Get("my")
  async getMyTickets(@Request() req) {
    return this.service.getTickets(req.user.id);
  }

  @Get(":id")
  async getTicket(@Param("id") id: string) {
    return this.service.getTicket(id);
  }

  @Patch(":id/status")
  @Roles(UserRole.CUSTOMER_SERVICE, UserRole.ADMIN)
  async updateStatus(@Param("id") id: string, @Body() { status }: { status: string }) {
    return this.service.updateTicketStatus(id, status);
  }

  @Post(":id/response")
  async addResponse(@Param("id") id: string, @Request() req, @Body() { message }: { message: string }) {
    return this.service.addResponse(id, req.user.id, message);
  }

  @Get()
  @Roles(UserRole.CUSTOMER_SERVICE, UserRole.ADMIN)
  async getOpenTickets() {
    return this.service.getOpenTickets();
  }

  @Patch(":id/assign")
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER_SERVICE)
  async assignTicket(@Param("id") id: string, @Request() req) {
    return this.service.assignTicket(id, req.user.id);
  }
}
