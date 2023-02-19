import {IsDefined, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class UserEditDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    lastName: string;

    @ApiProperty()
    @IsString()
    @MinLength(7)
    @MaxLength(12)
    phoneNumber: string;

    @ApiPropertyOptional()
    @IsEmail()
    email: string;
}

export class UserChangePasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    newPassword: string;
}

export class CreateUserByAdminDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    lastName: string;

    @ApiPropertyOptional()
    @IsString()
    @MinLength(7)
    @MaxLength(12)
    phoneNumber: string;

    @ApiPropertyOptional()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userGroupId: number;

}

export class LinkUserToClientDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userGroupId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class UserUpdateProfilePhotoDto {
    @ApiPropertyOptional()
    @IsDefined()
    @IsString()
    profileImage: string;
}

export class UserUpdateBarcodeId{
    @ApiPropertyOptional()
    @IsDefined()
    @IsString()
    barcodeId: string;
}

export class UserForgotPasswordDto{
    @ApiPropertyOptional()
    @IsDefined()
    @IsString()
    username: string;
}

export class UserResetPasswordDto{
    @ApiPropertyOptional()
    @IsDefined()
    @IsString()
    password: string;
}