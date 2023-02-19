import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {LoginDto} from "../login/login.dto";

export class TwoFactorAuthEnableDto {
    @ApiPropertyOptional({example: 'offsight'})
    @IsOptional()
    @IsString()
    name: string;
}

export class TwoFactorAuthVerifyDto {
    @ApiProperty({example: 123456})
    @IsNotEmpty()
    @IsNumber()
    code: number;
}

export class TwoFactorLoginDto  {
    @ApiProperty({example: 123456})
    @IsNotEmpty()
    @IsNumber()
    code: number;

    @ApiProperty({example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx'})
    @IsString()
    verifyToken: string;

}