import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');

  async onModuleInit() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    try {
      // Generate unique filename
      const randomName = crypto.randomBytes(16).toString('hex');
      const extension = path.extname(file.originalname);
      const filename = `${randomName}${extension}`;
      const filepath = path.join(this.uploadDir, filename);

      // Save file to disk
      await fs.writeFile(filepath, file.buffer);

      // Return relative URL
      return `/uploads/${filename}`;
    } catch (error) {
      throw new BadRequestException('Failed to upload file');
    }
  }

  async deleteImage(relativePath: string): Promise<void> {
    try {
      const filename = path.basename(relativePath);
      const filepath = path.join(this.uploadDir, filename);
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }
}
