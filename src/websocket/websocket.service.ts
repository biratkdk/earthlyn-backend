import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";

@Injectable()
export class WebSocketService {
  private io: Server;

  setServer(io: Server) {
    this.io = io;
  }

  async notifyOrderUpdate(userId: string, orderId: string, status: string) {
    this.io.to(userId).emit("order-update", { orderId, status });
  }

  async notifyDeliveryUpdate(userId: string, orderId: string, status: string, trackingId?: string) {
    this.io.to(userId).emit("delivery-update", { orderId, status, trackingId });
  }

  async notifyMessage(userId: string, message: any) {
    this.io.to(userId).emit("new-message", message);
  }

  joinUserRoom(socket: Socket, userId: string) {
    socket.join(userId);
  }

  leaveUserRoom(socket: Socket, userId: string) {
    socket.leave(userId);
  }
}