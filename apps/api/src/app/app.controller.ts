import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  healthCheck(): { status: string; message: string; timestamp: string } {
    return {
      status: 'success',
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
    };
  }

  /*
  @Get()
  getData() {
    return this.appService.getData();
  }
  */
}
