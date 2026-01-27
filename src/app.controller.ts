import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BetterAuthGuard } from './auth/better-auth.guard';

@Controller()
export class AppController {
  @Get()
  health() {
    return { status: 'ok' };
  }
  
  @UseGuards(BetterAuthGuard)
  @Get('secret')
  getSecret(@Req() req: any) {
    return {
      message: `This is a protected message for ${req.user.name}`,
    };
  }
}
