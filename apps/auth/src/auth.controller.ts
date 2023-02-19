import { Controller, Get } from "@nestjs/common";
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Health')
@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) {}


  @ApiOperation({ summary: 'Get hello' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'The found record' })
  @Get()
  getHello() {
    return this.appService.getIndex();
  }

}
