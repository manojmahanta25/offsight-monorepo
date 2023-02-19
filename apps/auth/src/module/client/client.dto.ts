import {IsBoolean, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ClientTaskSubmitTextDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    failButtonTextMapping: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    successButtonTextMapping: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    commentButtonTextMapping: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    assignButtonTextMapping: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    successButtonEnable: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    failButtonEnable: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    commentButtonEnable: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    assignButtonEnable: boolean;

    @ApiProperty()
    @IsString()
    clientAppSettingButtonFailColor: string;

    @ApiProperty()
    @IsString()
    clientAppSettingButtonSuccessColor: string;

    @ApiProperty()
    @IsString()
    clientAppSettingButtonCommentColor: string;

    @ApiProperty()
    @IsString()
    clientAppSettingButtonAssignColor: string;

}