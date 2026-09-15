import { Controller, Get, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from './basic-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(BasicAuthGuard)
  @Get('check')
  check() {
    return { ok: true };
  }
}
