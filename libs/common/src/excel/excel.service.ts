import { Injectable, BadRequestException } from '@nestjs/common';
import { Workbook } from 'exceljs';

@Injectable()
export class ExcelService {
  constructor() {}

  async downloadExcel(data, headers, options) {
    try {
      if (!headers || !headers.length) {
        throw new BadRequestException('No headers found.');
      }
      if (!data || !data.length) {
        throw new BadRequestException('No data found.');
      }
      const header = headers.map(({ header }) => header);
      const rows = [];
      data.forEach((row, index: number) => {
        rows[index] = [];
        headers.forEach(({ key }) => {
          rows[index].push(row.hasOwnProperty(key) ? row[key] : null);
        });
      });

      const book = new Workbook();
      const sheet = book.addWorksheet('sheet1');
      rows.unshift(header);
      sheet.addRows(rows);
      const buffer = await book.xlsx.writeBuffer();
      return buffer;
      return Buffer.from(JSON.stringify(buffer)).toString('base64');
    } catch (error) {
      return error.message;
    }
  }
}
