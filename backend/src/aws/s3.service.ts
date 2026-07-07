import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
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
   */
  async uploadFile(file: Express.Multer.File, keyPrefix = 'brochure-'): Promise<string> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('S3 Bucket name is not configured');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Remove spaces from original name to make it safer for URLs
    const safeName = file.originalname.replace(/\s+/g, '-');
    const objectKey = `${keyPrefix}${uniqueSuffix}-${safeName}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      return objectKey;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  /**
   * Generates a pre-signed URL to view/download a private file from S3.
   */
  async getPresignedUrl(objectKey: string, expiresIn = 3600): Promise<string> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('S3 Bucket name is not configured');
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        ResponseContentDisposition: 'inline', // Ensure it displays inline in browser (for PDFs)
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new InternalServerErrorException('Failed to generate secure URL for file');
    }
  }
}
