import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { TicketType, TicketPriority, TicketStatus } from "@prisma/client";
import { CreateTicketDto } from "./dto/create-ticket.dto";

@Injectable()
export class CustomerServiceService {
  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string, dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        userId,
        issueType: dto.issueType as TicketType,
        subject: dto.subject,
        description: dto.description,
        status: "OPEN" as TicketStatus,
        priority: (dto.priority || "MEDIUM") as TicketPriority,
      },
    });
  }

  async getTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: { responses: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTicket(id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: { responses: { orderBy: { createdAt: "asc" } } },
    });
  }

  async updateTicketStatus(id: string, status: string) {
    return this.prisma.ticket.update({
      where: { id },
      data: { status: status as TicketStatus },
    });
  }

  async addResponse(ticketId: string, userId: string, message: string) {
    return this.prisma.ticketResponse.create({
      data: {
        ticketId,
        userId,
        message,
      },
    });
  }

  async getOpenTickets() {
    return this.prisma.ticket.findMany({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] as TicketStatus[] } },
      orderBy: { createdAt: "asc" },
    });
  }

  async assignTicket(ticketId: string, csUserId: string) {
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: { csUserId, status: "IN_PROGRESS" as TicketStatus },
    });
  }
}