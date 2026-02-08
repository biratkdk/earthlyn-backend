import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@WebSocketGateway({ cors: { origin: "*" } })
@Injectable()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`[WebSocket] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[WebSocket] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join")
  handleJoin(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    client.join(`user:${data.userId}`);
    return { event: "joined", data: { userId: data.userId } };
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @MessageBody() data: { recipientId: string; message: string },
    @ConnectedSocket() client: Socket
  ) {
    this.server.to(`user:${data.recipientId}`).emit("new_message", data);
  }

  async broadcastTicketUpdate(ticketId: string, update: any) {
    this.server.emit(`ticket:${ticketId}`, update);
  }

  async notifyUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit("notification", notification);
  }
}