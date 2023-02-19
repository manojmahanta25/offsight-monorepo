import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ExcelService } from './excel/excel.service';

@Module({
  imports:[],
  providers: [CommonService,ExcelService,],
  exports: [CommonService,ExcelService],
})
export class CommonModule {}
