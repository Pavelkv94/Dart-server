import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

export class StorageService {
    private readonly client: S3Client;
    private readonly bucket: string;

    constructor() {
        if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !process.env.S3_BUCKET) {
            throw new Error('Missing required S3 environment variables');
        }

        this.client = new S3Client({
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            }
        });
        this.bucket = process.env.S3_BUCKET;
    }

    public async downloadFile(key: string) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });
        const result = await this.client.send(command);
        return result;
    }

    public async getFiles() {
        const command = new ListObjectsV2Command({
            Bucket: this.bucket,
        });
        const result = await this.client.send(command);
        return result;
    }

    public async uploadFile(buffer: Buffer, key: string, mimeType: string) {

        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: mimeType
            });
            const result = await this.client.send(command);
            console.log("File uploaded to S3", { result });
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async deleteFile(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        });
        const result = await this.client.send(command);
        return result;
    }
}