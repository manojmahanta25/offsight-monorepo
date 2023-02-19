import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
var path = require('path')

@Injectable()
export class S3ManagerService {
    constructor(
        @InjectAwsService(S3) private readonly s3: S3,
    ) {}

    async listBucketContents(bucket: string) {
        const response = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
        return response.Contents.map(c => c.Key);
    }

    async uploadFile(filename: string, fileContent:string, subPath: string) {
        const params = {
            Bucket: 'offsight-s3',
            Body: fileContent,
            Key: `${subPath}/${Date.now()}${path.extname(filename)}`,
            ACL: 'public-read'
        };
        const uploadResult = await this.s3.upload(params).promise();
        const fileStorageInDB = ({
            fileName: filename,
            fileUrl: uploadResult.Location,
            key: uploadResult.Key,
        });
        return fileStorageInDB;
    }

    async deleteFiles(fileList: { Key: string; }[]) {
        var params = {
            Bucket: 'offsight-s3',
            Delete: { Objects:fileList }
        };
        const data = await this.s3.deleteObjects(params).promise();
        return data;
    }

}