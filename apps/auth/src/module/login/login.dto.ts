import {IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({example:'manager@demo2.offsight.com'})
    @IsNotEmpty()
    username: string

    @ApiProperty({example:'Welcome1'})
    @IsNotEmpty()
    password: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    captcha: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    clientId:number
}

export class LoginWithBarcodeIdDto {
    @ApiProperty({example:'chris.offsight'})
    @IsNotEmpty()
    barcodeId: string

    @ApiPropertyOptional()
    @IsOptional()
    clientId:number
}

export class RefreshTokenDto{
    @ApiPropertyOptional()
    @ValidateIf(obj => !(JSON.stringify(obj) === '{}'))
    @IsNotEmpty()
    @IsString()
    refresherToken: string
}

export class LoginWithVerifyTokenDto {
    @ApiProperty({example:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'})
    @IsNotEmpty()
    @IsString()
    verifyToken: string

    @ApiProperty({example:1})
    @IsNotEmpty()
    @IsNumber()
    clientId: number
}