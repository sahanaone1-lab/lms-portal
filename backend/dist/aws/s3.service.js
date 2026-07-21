"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var S3Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3Service = S3Service_1 = class S3Service {
    constructor() {
        this.logger = new common_1.Logger(S3Service_1.name);
        this.bucketName = process.env.AWS_S3_BUCKET_NAME;
        this.s3Client = new client_s3_1.S3Client({
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
    async uploadFile(file, keyPrefix = 'brochure-') {
        if (!this.bucketName) {
            this.logger.error('AWS_S3_BUCKET_NAME is not set in environment variables');
            throw new common_1.InternalServerErrorException('S3 Bucket name is not configured');
        }
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            this.logger.error('AWS credentials are not configured');
            throw new common_1.InternalServerErrorException('AWS credentials are not configured');
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // Remove spaces and special chars from original name to make it URL-safe
        const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
        const objectKey = `${keyPrefix}${uniqueSuffix}-${safeName}`;
        try {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: objectKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.s3Client.send(command);
            this.logger.log(`File uploaded to S3: ${objectKey}`);
            return objectKey;
        }
        catch (error) {
            this.logger.error(`Error uploading file to S3: ${error?.message}`, error?.stack);
            throw new common_1.InternalServerErrorException(`Failed to upload file to S3: ${error?.message || 'Unknown error'}`);
        }
    }
    /**
     * Generates a pre-signed URL to view/download a private file from S3.
     * Default expiry: 1 hour.
     */
    async getPresignedUrl(objectKey, expiresIn = 3600) {
        if (!this.bucketName) {
            throw new common_1.InternalServerErrorException('S3 Bucket name is not configured');
        }
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucketName,
                Key: objectKey,
                ResponseContentDisposition: 'inline',
            });
            const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
            return url;
        }
        catch (error) {
            this.logger.error(`Error generating presigned URL for ${objectKey}: ${error?.message}`);
            throw new common_1.InternalServerErrorException('Failed to generate secure URL for file');
        }
    }
    /**
     * Generates a pre-signed URL specifically for downloading (forces download attachment).
     */
    async getPresignedDownloadUrl(objectKey, fileName, expiresIn = 3600) {
        if (!this.bucketName) {
            throw new common_1.InternalServerErrorException('S3 Bucket name is not configured');
        }
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucketName,
                Key: objectKey,
                ResponseContentDisposition: `attachment; filename="${fileName}"`,
            });
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
        }
        catch (error) {
            this.logger.error(`Error generating download URL for ${objectKey}: ${error?.message}`);
            throw new common_1.InternalServerErrorException('Failed to generate download URL for file');
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = S3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3Service);
//# sourceMappingURL=s3.service.js.map