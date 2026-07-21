import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'eu-north-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  /**
   * Uploads a file to S3 and returns the Object Key.
   * Supports PDF, DOC, DOCX, PPT, PPTX, ZIP, JPG, PNG.
   */
  async uploadFile(file: Express.Multer.File, keyPrefix = 'brochure-'): Promise<string> {
    if (!this.bucketName) {
      this.logger.error('AWS_S3_BUCKET_NAME is not set in environment variables');
      throw new InternalServerErrorException('S3 Bucket name is not configured');
    }

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      this.logger.error('AWS credentials are not configured');
      throw new InternalServerErrorException('AWS credentials are not configured');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Remove spaces and special chars from original name to make it URL-safe
    const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
    const objectKey = `${keyPrefix}${uniqueSuffix}-${safeName}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      this.logger.log(`File uploaded to S3: ${objectKey}`);
      return objectKey;
    } catch (error: any) {
      this.logger.error(`Error uploading file to S3: ${error?.message}`, error?.stack);
      throw new InternalServerErrorException(
        `Failed to upload file to S3: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Generates a pre-signed URL to view/download a private file from S3.
   * Default expiry: 1 hour.
   */
  async getPresignedUrl(objectKey: string, expiresIn = 3600): Promise<string> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('S3 Bucket name is not configured');
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        ResponseContentDisposition: 'inline',
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error: any) {
      this.logger.error(`Error generating presigned URL for ${objectKey}: ${error?.message}`);
      throw new InternalServerErrorException('Failed to generate secure URL for file');
    }
  }

  /**
   * Generates a pre-signed URL specifically for downloading (forces download attachment).
   */
  async getPresignedDownloadUrl(
    objectKey: string,
    fileName: string,
    expiresIn = 3600,
  ): Promise<string> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('S3 Bucket name is not configured');
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        ResponseContentDisposition: `attachment; filename="${fileName}"`,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error: any) {
      this.logger.error(`Error generating download URL for ${objectKey}: ${error?.message}`);
      throw new InternalServerErrorException('Failed to generate download URL for file');
    }
  }
}
