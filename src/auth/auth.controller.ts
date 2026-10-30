import { Controller, Get, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from './basic-auth.guard';
import { Admin, AdminScope } from './admin-scope';

@Controller('auth')
export class AuthController {
  @UseGuards(BasicAuthGuard)
  @Get('check')
  check(@Admin() admin: AdminScope) {
    return { ok: true, username: admin.username, sections: admin.sections };
  }
}
