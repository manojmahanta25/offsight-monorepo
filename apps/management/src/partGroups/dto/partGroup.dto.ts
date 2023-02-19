import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreatePartGroupDto {
    @ApiProperty({ example: 'partGroupName' })
    @IsNotEmpty()
    @IsString()
    partGroupName: string
}

export class UpdatePartGroupDto {
    @ApiProperty({ example: 'partGroupName' })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    partGroupName: string
}