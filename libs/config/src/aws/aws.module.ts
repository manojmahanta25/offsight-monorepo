import { Module } from "@nestjs/common";
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3ManagerService } from "./s3-manager.service";


@Module({
    imports: [
        AwsSdkModule.forRootAsync({
            defaultServiceOptions: {
              useFactory: (configService: ConfigService) => {
                return {
                  region: 'us-east-1',
                  credentials: {
                        accessKeyId: configService.get('AWS_ACCESS_KEY'),
                        secretAccessKey: configService.get('AWS_ACCESS_SECRET')
                    },
                };
              },
              imports: [ConfigModule],
              inject: [ConfigService],
            },
        }),
        AwsSdkModule.forFeatures([S3])
    ],
    providers: [S3ManagerService],
    exports: [S3ManagerService],
})
export class AWSModule {}