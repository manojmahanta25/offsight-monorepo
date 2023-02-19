import { IsNotEmpty, IsString } from 'class-validator';

export class ExcelHeaderDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  header: string;
}
