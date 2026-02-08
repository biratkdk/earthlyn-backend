import { Injectable, BadRequestException } from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";
import * as crypto from "crypto";
import type { Multer } from "multer";

@Injectable()
export class FileUploadService {
  private readonly uploadDir = path.join(process.cwd(), "public", "uploads");

  async onModuleInit() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create upload directory:", error);
    }
  }

  async uploadImage(file: Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("Only image files are allowed");
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException("File size exceeds 5MB limit");
    }

    try {
      const fileName = crypto.randomBytes(16).toString("hex") + "_" + Date.now();
      const filePath = path.join(this.uploadDir, fileName);
      await fs.writeFile(filePath, file.buffer);
      return "/uploads/" + fileName;
    } catch (error) {
      throw new BadRequestException("File upload failed");
    }
  }

  async uploadVideo(file: Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    if (!file.mimetype.startsWith("video/")) {
      throw new BadRequestException("Only video files are allowed");
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException("File size exceeds 100MB limit");
    }

    try {
      const fileName = crypto.randomBytes(16).toString("hex") + "_" + Date.now();
      const filePath = path.join(this.uploadDir, fileName);
      await fs.writeFile(filePath, file.buffer);
      return "/uploads/" + fileName;
    } catch (error) {
      throw new BadRequestException("File upload failed");
    }
  }
}
